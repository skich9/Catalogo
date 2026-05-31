import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AddCartItemDto, CheckoutDto } from './dto/cart.dto';
import { generateOrderNumber } from '../../common/utils/slug.util';
import { buildOrderWhatsAppMessage, buildWhatsAppLink } from '../../common/utils/whatsapp.util';

@Injectable()
export class CartService {
  constructor(private prisma: PrismaService) {}

  private async getOrCreateCart(sessionId: string, tenantId: string) {
    let cart = await this.prisma.cart.findUnique({
      where: { sessionId },
      include: { items: { include: { product: { include: { images: true } } } } },
    });

    if (!cart) {
      const expiresAt = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
      cart = await this.prisma.cart.create({
        data: { sessionId, tenantId, expiresAt },
        include: { items: { include: { product: { include: { images: true } } } } },
      });
    }
    return cart;
  }

  async getCart(sessionId: string, tenantId: string) {
    const cart = await this.getOrCreateCart(sessionId, tenantId);
    const total = cart.items.reduce(
      (sum, item) => sum + Number(item.priceSnapshot) * item.quantity,
      0,
    );
    return { ...cart, total };
  }

  async addItem(sessionId: string, tenantId: string, dto: AddCartItemDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, tenantId, status: 'ACTIVE' },
    });
    if (!product) throw new NotFoundException('Producto no disponible');

    const cart = await this.getOrCreateCart(sessionId, tenantId);

    const existing = cart.items.find((i) => i.productId === dto.productId);
    if (existing) {
      await this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: existing.quantity + dto.quantity },
      });
    } else {
      await this.prisma.cartItem.create({
        data: {
          cartId: cart.id,
          productId: dto.productId,
          quantity: dto.quantity,
          priceSnapshot: product.price,
        },
      });
    }

    return this.getCart(sessionId, tenantId);
  }

  async updateItem(sessionId: string, itemId: string, quantity: number) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { sessionId } },
    });
    if (!item) throw new NotFoundException('Item no encontrado');

    if (quantity <= 0) {
      await this.prisma.cartItem.delete({ where: { id: itemId } });
    } else {
      await this.prisma.cartItem.update({ where: { id: itemId }, data: { quantity } });
    }

    const cart = await this.prisma.cart.findUnique({ where: { sessionId } });
    return this.getCart(sessionId, cart!.tenantId);
  }

  async removeItem(sessionId: string, itemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: itemId, cart: { sessionId } },
    });
    if (!item) throw new NotFoundException('Item no encontrado');
    await this.prisma.cartItem.delete({ where: { id: itemId } });
    const cart = await this.prisma.cart.findUnique({ where: { sessionId } });
    return this.getCart(sessionId, cart!.tenantId);
  }

  async clearCart(sessionId: string) {
    const cart = await this.prisma.cart.findUnique({ where: { sessionId } });
    if (cart) await this.prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
    return { message: 'Carrito vaciado' };
  }

  async checkout(sessionId: string, tenantId: string, dto: CheckoutDto) {
    const cart = await this.getCart(sessionId, tenantId);
    if (!cart.items.length) throw new BadRequestException('El carrito está vacío');

    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException('Negocio no encontrado');

    const orderNumber = generateOrderNumber();
    const subtotal = cart.total;

    const order = await this.prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          tenantId,
          customerName: dto.customerName,
          customerPhone: dto.customerPhone,
          customerEmail: dto.customerEmail,
          notes: dto.notes,
          subtotal,
          total: subtotal,
          items: {
            createMany: {
              data: cart.items.map((item) => ({
                productId: item.productId,
                productName: item.product.name,
                quantity: item.quantity,
                unitPrice: item.priceSnapshot,
                total: Number(item.priceSnapshot) * item.quantity,
              })),
            },
          },
        },
        include: { items: true },
      });

      if (tenant.cartMode === 'QR_PAYMENT') {
        await tx.payment.create({
          data: {
            orderId: newOrder.id,
            amount: subtotal,
            currency: 'BOB',
          },
        });
      }

      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
      return newOrder;
    });

    if (tenant.cartMode === 'WHATSAPP' && tenant.whatsappNumber) {
      const message = buildOrderWhatsAppMessage(
        tenant.name,
        orderNumber,
        cart.items.map((i) => ({
          productName: i.product.name,
          quantity: i.quantity,
          unitPrice: Number(i.priceSnapshot),
        })),
        subtotal,
        'BOB',
      );
      const whatsappLink = buildWhatsAppLink(tenant.whatsappNumber, message);
      return { order, cartMode: 'WHATSAPP', whatsappLink };
    }

    return { order, cartMode: 'QR_PAYMENT', paymentQrUrl: tenant.paymentQrUrl };
  }
}
