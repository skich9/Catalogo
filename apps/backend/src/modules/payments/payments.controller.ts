import {
  Controller, Get, Post, Patch, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Payments QR')
@Controller('payments')
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Get(':orderId/qr')
  @ApiOperation({ summary: 'Obtener QR de pago para un pedido (público)' })
  getQr(@Param('orderId') orderId: string) {
    return this.paymentsService.getPaymentQr(orderId);
  }

  @Post(':orderId/proof')
  @ApiOperation({ summary: 'Cliente sube comprobante de pago' })
  uploadProof(
    @Param('orderId') orderId: string,
    @Body('proofUrl') proofUrl: string,
    @Body('proofPublicId') proofPublicId?: string,
  ) {
    return this.paymentsService.uploadProof(orderId, proofUrl, proofPublicId);
  }

  @Patch(':orderId/confirm')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin confirma el pago' })
  confirm(
    @Param('orderId') orderId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.paymentsService.confirmPayment(orderId, tenantId);
  }

  @Patch(':orderId/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Admin rechaza el pago' })
  reject(
    @Param('orderId') orderId: string,
    @CurrentUser('tenantId') tenantId: string,
    @Body('note') note?: string,
  ) {
    return this.paymentsService.rejectPayment(orderId, tenantId, note);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Pagos pendientes de confirmación' })
  getPending(@CurrentUser('tenantId') tenantId: string) {
    return this.paymentsService.getPendingPayments(tenantId);
  }
}
