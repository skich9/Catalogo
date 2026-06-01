import {
  Controller, Get, Post, Patch, Delete, Body, Param,
  Query, UseGuards, ParseIntPipe, DefaultValuePipe,
  UploadedFile, UseInterceptors, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiConsumes } from '@nestjs/swagger';
import { ProductStatus, UserRole } from '@prisma/client';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { StorageService } from '../storage/storage.service';

const MAX_IMG  = 5  * 1024 * 1024;   // 5 MB imágenes
const MAX_VID  = 50 * 1024 * 1024;   // 50 MB videos
const ALLOWED_IMG = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_VID = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi'];

@ApiTags('Products')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private storageService: StorageService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos del negocio' })
  findAll(
    @CurrentUser('tenantId') tenantId: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: ProductStatus,
    @Query('search') search?: string,
  ) {
    return this.productsService.findAll(tenantId, { page, limit, categoryId, status, search });
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.productsService.findOne(id, tenantId);
  }

  @Post()
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Crear producto' })
  create(@CurrentUser('tenantId') tenantId: string, @Body() dto: CreateProductDto) {
    return this.productsService.create(tenantId, dto);
  }

  @Patch(':id')
  @Roles(UserRole.EMPLOYEE)
  update(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @Body() dto: Partial<CreateProductDto>,
  ) {
    return this.productsService.update(id, tenantId, dto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string, @CurrentUser('tenantId') tenantId: string) {
    return this.productsService.remove(id, tenantId);
  }

  @Patch(':id/status')
  @Roles(UserRole.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @Body('status') status: ProductStatus,
  ) {
    return this.productsService.updateStatus(id, tenantId, status);
  }

  // ─── Imágenes ─────────────────────────────────────────────────────────────

  @Post(':id/images/link')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Vincular URL de Cloudinary ya subida a un producto' })
  async linkImage(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @Body() body: { url: string; publicId?: string; resourceType?: 'image' | 'video' },
  ) {
    await this.productsService.findOne(id, tenantId);
    return this.productsService.addImage(
      id, body.url, body.publicId, body.resourceType || 'image',
    );
  }

  @Post(':id/images')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Subir imagen o video del producto' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_VID },
      fileFilter: (_, file, cb) => {
        const allowed = [...ALLOWED_IMG, ...ALLOWED_VID];
        if (!allowed.includes(file.mimetype)) {
          return cb(new BadRequestException('Formato no soportado. Use JPG, PNG, WebP, MP4 o WebM'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadImage(
    @Param('id') id: string,
    @CurrentUser('tenantId') tenantId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    await this.productsService.findOne(id, tenantId);
    const isVideo = ALLOWED_VID.includes(file.mimetype);
    const uploaded = await this.storageService.uploadBuffer(
      file.buffer,
      `catalogo-saas/products/${id}`,
      isVideo ? 'video' : 'image',
    );
    return this.productsService.addImage(
      id, uploaded.url, uploaded.publicId, uploaded.resourceType,
    );
  }

  @Delete(':id/images/:imageId')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Eliminar imagen del producto' })
  async deleteImage(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    await this.productsService.findOne(id, tenantId);
    return this.productsService.removeImage(id, imageId, this.storageService);
  }

  @Patch(':id/images/:imageId/primary')
  @Roles(UserRole.EMPLOYEE)
  @ApiOperation({ summary: 'Marcar imagen como principal' })
  setPrimary(
    @Param('id') id: string,
    @Param('imageId') imageId: string,
    @CurrentUser('tenantId') tenantId: string,
  ) {
    return this.productsService.setImagePrimary(id, imageId, tenantId);
  }
}
