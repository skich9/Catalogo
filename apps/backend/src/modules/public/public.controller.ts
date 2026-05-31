import { Controller, Get, Param, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { PublicService } from './public.service';

@ApiTags('Public Catalog')
@Controller('public/catalog')
export class PublicController {
  constructor(private publicService: PublicService) {}

  @Get(':slug')
  @ApiOperation({ summary: 'Información pública del catálogo' })
  getCatalog(@Param('slug') slug: string) {
    return this.publicService.getCatalog(slug);
  }

  @Get(':slug/products')
  @ApiOperation({ summary: 'Lista de productos del catálogo (paginada)' })
  getProducts(
    @Param('slug') slug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(24), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string,
    @Query('search') search?: string,
  ) {
    return this.publicService.getProducts(slug, { page, limit, categoryId, search });
  }

  @Get(':slug/products/:productSlug')
  @ApiOperation({ summary: 'Detalle de un producto' })
  getProduct(@Param('slug') slug: string, @Param('productSlug') productSlug: string) {
    return this.publicService.getProduct(slug, productSlug);
  }
}
