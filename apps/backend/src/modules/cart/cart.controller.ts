import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto, CheckoutDto } from './dto/cart.dto';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get(':sessionId')
  @ApiOperation({ summary: 'Obtener carrito' })
  getCart(
    @Param('sessionId') sessionId: string,
    @Query('tenantId') tenantId: string,
  ) {
    return this.cartService.getCart(sessionId, tenantId);
  }

  @Post(':sessionId/items')
  @ApiOperation({ summary: 'Agregar producto al carrito' })
  addItem(
    @Param('sessionId') sessionId: string,
    @Query('tenantId') tenantId: string,
    @Body() dto: AddCartItemDto,
  ) {
    return this.cartService.addItem(sessionId, tenantId, dto);
  }

  @Patch(':sessionId/items/:itemId')
  @ApiOperation({ summary: 'Actualizar cantidad' })
  updateItem(
    @Param('sessionId') sessionId: string,
    @Param('itemId') itemId: string,
    @Body('quantity') quantity: number,
  ) {
    return this.cartService.updateItem(sessionId, itemId, quantity);
  }

  @Delete(':sessionId/items/:itemId')
  removeItem(@Param('sessionId') sessionId: string, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(sessionId, itemId);
  }

  @Delete(':sessionId')
  clearCart(@Param('sessionId') sessionId: string) {
    return this.cartService.clearCart(sessionId);
  }

  @Post(':sessionId/checkout')
  @ApiOperation({ summary: 'Generar pedido desde el carrito' })
  checkout(
    @Param('sessionId') sessionId: string,
    @Query('tenantId') tenantId: string,
    @Body() dto: CheckoutDto,
  ) {
    return this.cartService.checkout(sessionId, tenantId, dto);
  }
}
