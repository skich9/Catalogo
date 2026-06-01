import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface ProductRankItem {
  productId:    string;
  productName:  string;
  price:        number;
  currency:     string;
  imageUrl:     string | null;
  clicks:       number;
  waClicks:     number;
  fbClicks:     number;
  cartClicks:   number;
}

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  // Registrar un click (público, llamado desde el catálogo)
  async recordClick(tenantId: string, productId: string, type: 'whatsapp' | 'facebook' | 'cart') {
    // Verificar que el producto pertenece al tenant
    const product = await this.prisma.product.findFirst({ where: { id: productId, tenantId } });
    if (!product) return { ok: false };
    await this.prisma.productClick.create({ data: { productId, tenantId, type } });
    return { ok: true };
  }

  // Obtener ranking de productos por interés
  async getProductRanking(tenantId: string, days = 30): Promise<ProductRankItem[]> {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    // Traer todos los productos del tenant con sus clicks
    const products = await this.prisma.product.findMany({
      where: { tenantId },
      select: {
        id: true, name: true, price: true, currency: true,
        images: {
          where: { isPrimary: true },
          take: 1,
          select: { url: true },
        },
        clicks: {
          where: { createdAt: { gte: since } },
          select: { type: true },
        },
      },
    });

    return products
      .map((p) => ({
        productId:   p.id,
        productName: p.name,
        price:       Number(p.price),
        currency:    p.currency,
        imageUrl:    p.images[0]?.url ?? null,
        clicks:      p.clicks.length,
        waClicks:    p.clicks.filter((c) => c.type === 'whatsapp').length,
        fbClicks:    p.clicks.filter((c) => c.type === 'facebook').length,
        cartClicks:  p.clicks.filter((c) => c.type === 'cart').length,
      }))
      .sort((a, b) => b.clicks - a.clicks);
  }

  // Totales del negocio
  async getSummary(tenantId: string, days = 30) {
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

    const [totalOrders, pendingOrders, totalClicks, waClicks, products] = await Promise.all([
      this.prisma.order.count({ where: { tenantId } }),
      this.prisma.order.count({ where: { tenantId, status: 'PENDING' } }),
      this.prisma.productClick.count({ where: { tenantId, createdAt: { gte: since } } }),
      this.prisma.productClick.count({ where: { tenantId, type: 'whatsapp', createdAt: { gte: since } } }),
      this.prisma.product.count({ where: { tenantId, status: 'ACTIVE' } }),
    ]);

    return { totalOrders, pendingOrders, totalClicks, waClicks, activeProducts: products };
  }
}
