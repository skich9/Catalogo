import {
  Injectable, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { generateSlug } from '../../common/utils/slug.util';
import { ProductStatus } from '@prisma/client';
import type { StorageService } from '../storage/storage.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string, query: {
    page?: number; limit?: number; categoryId?: string;
    status?: ProductStatus; search?: string; featured?: boolean;
  }) {
    const { page = 1, limit = 20, categoryId, status, search, featured } = query;
    const skip = (page - 1) * limit;

    const where: any = { tenantId };
    if (categoryId) where.categoryId = categoryId;
    if (status) where.status = status;
    if (featured !== undefined) where.isFeatured = featured;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit,
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
        include: {
          images: { orderBy: { sortOrder: 'asc' } },
          category: { select: { id: true, name: true, slug: true } },
          specs: { orderBy: { sortOrder: 'asc' } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async findOne(id: string, tenantId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, tenantId },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        category: true,
        specs: { orderBy: { sortOrder: 'asc' } },
      },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async create(tenantId: string, dto: CreateProductDto) {
    const subscription = await this.prisma.subscription.findUnique({ where: { tenantId } });
    const productCount = await this.prisma.product.count({ where: { tenantId } });

    if (subscription && productCount >= subscription.maxProducts) {
      throw new ForbiddenException(`Límite de ${subscription.maxProducts} productos alcanzado. Actualizá tu plan.`);
    }

    let slug = generateSlug(dto.name);
    const existing = await this.prisma.product.findUnique({ where: { slug_tenantId: { slug, tenantId } } });
    if (existing) slug = `${slug}-${Date.now()}`;

    const { specs, ...rest } = dto;
    return this.prisma.product.create({
      data: {
        ...rest,
        slug,
        tenantId,
        specs: specs ? { createMany: { data: specs } } : undefined,
      },
      include: { images: true, specs: true, category: true },
    });
  }

  async update(id: string, tenantId: string, dto: Partial<CreateProductDto>) {
    await this.findOne(id, tenantId);
    const { specs, ...rest } = dto;

    if (specs !== undefined) {
      await this.prisma.productSpec.deleteMany({ where: { productId: id } });
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...rest,
        specs: specs ? { createMany: { data: specs } } : undefined,
      },
      include: { images: true, specs: true, category: true },
    });
  }

  async remove(id: string, tenantId: string) {
    await this.findOne(id, tenantId);
    await this.prisma.product.delete({ where: { id } });
    return { message: 'Producto eliminado' };
  }

  async updateStatus(id: string, tenantId: string, status: ProductStatus) {
    await this.findOne(id, tenantId);
    return this.prisma.product.update({ where: { id }, data: { status } });
  }

  // ─── Gestión de imágenes ────────────────────────────────────────────────

  async addImage(
    productId: string,
    url: string,
    publicId?: string,
    resourceType: 'image' | 'video' = 'image',
  ) {
    const count = await this.prisma.productImage.count({ where: { productId } });
    return this.prisma.productImage.create({
      data: {
        productId, url, publicId, resourceType,
        isPrimary: count === 0 && resourceType === 'image',
        sortOrder: count,
      },
    });
  }

  async removeImage(productId: string, imageId: string, storage: StorageService) {
    const img = await this.prisma.productImage.findFirst({ where: { id: imageId, productId } });
    if (!img) throw new NotFoundException('Imagen no encontrada');

    if (img.publicId) await storage.delete(img.publicId);
    await this.prisma.productImage.delete({ where: { id: imageId } });

    // Si era la principal, promover la siguiente
    if (img.isPrimary) {
      const next = await this.prisma.productImage.findFirst({ where: { productId } });
      if (next) await this.prisma.productImage.update({ where: { id: next.id }, data: { isPrimary: true } });
    }
    return { message: 'Imagen eliminada' };
  }

  async setImagePrimary(productId: string, imageId: string, tenantId: string) {
    await this.findOne(productId, tenantId);
    await this.prisma.productImage.updateMany({ where: { productId }, data: { isPrimary: false } });
    return this.prisma.productImage.update({ where: { id: imageId }, data: { isPrimary: true } });
  }
}
