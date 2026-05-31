import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private prisma: PrismaService) {}

  async getCatalog(slug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug, isActive: true },
      select: {
        id: true, name: true, slug: true, logoUrl: true,
        description: true, facebookPageUrl: true, whatsappNumber: true,
        whatsappMessage: true, cartMode: true, paymentQrUrl: true,
        paymentInstructions: true, address: true, website: true,
        categories: {
          orderBy: { sortOrder: 'asc' },
          select: { id: true, name: true, slug: true, imageUrl: true },
        },
        subscription: { select: { plan: true, status: true } },
      },
    });
    if (!tenant) throw new NotFoundException('Catálogo no encontrado');
    return tenant;
  }

  async getProducts(slug: string, query: {
    page?: number; limit?: number; categoryId?: string; search?: string;
  }) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug, isActive: true }, select: { id: true },
    });
    if (!tenant) throw new NotFoundException('Catálogo no encontrado');

    const { page = 1, limit = 24, categoryId, search } = query;
    const skip = (page - 1) * limit;
    const where: any = { tenantId: tenant.id, status: 'ACTIVE' };
    if (categoryId) where.categoryId = categoryId;
    if (search) where.name = { contains: search, mode: 'insensitive' };

    const [items, total] = await Promise.all([
      this.prisma.product.findMany({
        where, skip, take: limit,
        orderBy: [{ isFeatured: 'desc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
        select: {
          id: true, name: true, slug: true, description: true,
          price: true, comparePrice: true, currency: true,
          isFeatured: true, whatsappNumber: true, whatsappMessage: true, facebookUrl: true,
          images: { where: { isPrimary: true }, take: 1, select: { url: true, altText: true } },
          category: { select: { name: true, slug: true } },
          specs: { orderBy: { sortOrder: 'asc' }, select: { key: true, value: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return { items, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async getProduct(tenantSlug: string, productSlug: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug, isActive: true }, select: { id: true, name: true, whatsappNumber: true },
    });
    if (!tenant) throw new NotFoundException('Catálogo no encontrado');

    const product = await this.prisma.product.findFirst({
      where: { slug: productSlug, tenantId: tenant.id, status: 'ACTIVE' },
      include: {
        images: { orderBy: { sortOrder: 'asc' } },
        specs: { orderBy: { sortOrder: 'asc' } },
        category: { select: { name: true, slug: true } },
      },
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return { ...product, tenantName: tenant.name, tenantWhatsapp: tenant.whatsappNumber };
  }
}
