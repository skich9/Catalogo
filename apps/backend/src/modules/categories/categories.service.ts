import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { generateSlug } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll(tenantId: string) {
    return this.prisma.category.findMany({
      where: { tenantId },
      orderBy: { sortOrder: 'asc' },
      select: { id: true, name: true, slug: true, imageUrl: true, sortOrder: true },
    });
  }

  async create(tenantId: string, name: string) {
    const slug = generateSlug(name);
    return this.prisma.category.create({
      data: { name, slug, tenantId },
    });
  }

  async update(id: string, tenantId: string, name: string) {
    const cat = await this.prisma.category.findFirst({ where: { id, tenantId } });
    if (!cat) throw new NotFoundException('Categoría no encontrada');
    return this.prisma.category.update({ where: { id }, data: { name } });
  }

  async remove(id: string, tenantId: string) {
    const cat = await this.prisma.category.findFirst({ where: { id, tenantId } });
    if (!cat) throw new NotFoundException('Categoría no encontrada');
    await this.prisma.category.delete({ where: { id } });
    return { message: 'Categoría eliminada' };
  }
}
