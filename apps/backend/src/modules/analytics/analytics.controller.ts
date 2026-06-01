import { Controller, Post, Get, Body, Query, UseGuards, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  // Público: el catálogo llama a este endpoint cuando el cliente hace click
  @Post('click')
  @ApiOperation({ summary: 'Registrar click en WhatsApp/Facebook/carrito (público)' })
  recordClick(
    @Body() body: { tenantId: string; productId: string; type: 'whatsapp' | 'facebook' | 'cart' },
  ) {
    return this.analyticsService.recordClick(body.tenantId, body.productId, body.type);
  }

  // Autenticado: el admin ve el ranking
  @Get('products')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Ranking de productos por interés' })
  getProductRanking(
    @CurrentUser('tenantId') tenantId: string,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.analyticsService.getProductRanking(tenantId, days);
  }

  @Get('summary')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resumen general del negocio' })
  getSummary(
    @CurrentUser('tenantId') tenantId: string,
    @Query('days', new DefaultValuePipe(30), ParseIntPipe) days: number,
  ) {
    return this.analyticsService.getSummary(tenantId, days);
  }
}
