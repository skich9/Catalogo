import {
  Injectable, NotFoundException, BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getPaymentQr(orderId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: { include: { tenant: true } } },
    });
    if (!payment) throw new NotFoundException('Pago no encontrado');

    return {
      orderId,
      orderNumber: payment.order.orderNumber,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      qrUrl: payment.order.tenant.paymentQrUrl,
      instructions: payment.order.tenant.paymentInstructions,
      tenantName: payment.order.tenant.name,
    };
  }

  async uploadProof(orderId: string, proofUrl: string, proofPublicId?: string) {
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment) throw new NotFoundException('Pago no encontrado');
    if (payment.status !== 'PENDING') {
      throw new BadRequestException('Este pago ya fue procesado');
    }

    return this.prisma.payment.update({
      where: { orderId },
      data: { proofUrl, proofPublicId },
    });
  }

  async confirmPayment(orderId: string, tenantId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });
    if (!payment || payment.order.tenantId !== tenantId) {
      throw new NotFoundException('Pago no encontrado');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { orderId },
        data: { status: 'CONFIRMED', confirmedAt: new Date() },
      });
      await tx.order.update({ where: { id: orderId }, data: { status: 'PAID' } });
      return updated;
    });
  }

  async rejectPayment(orderId: string, tenantId: string, note?: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { orderId },
      include: { order: true },
    });
    if (!payment || payment.order.tenantId !== tenantId) {
      throw new NotFoundException('Pago no encontrado');
    }

    return this.prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { orderId },
        data: { status: 'REJECTED', rejectedAt: new Date(), rejectionNote: note },
      });
      await tx.order.update({ where: { id: orderId }, data: { status: 'CANCELED' } });
      return updated;
    });
  }

  async getPendingPayments(tenantId: string) {
    return this.prisma.payment.findMany({
      where: {
        status: 'PENDING',
        order: { tenantId },
        proofUrl: { not: null },
      },
      include: {
        order: {
          select: {
            orderNumber: true,
            customerName: true,
            customerPhone: true,
            total: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    });
  }
}
