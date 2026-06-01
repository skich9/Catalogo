import {
  Controller, Post, Delete, Param, UploadedFile,
  UseInterceptors, UseGuards, BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiBearerAuth, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { StorageService } from './storage.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED  = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

@ApiTags('Storage')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('storage')
export class StorageController {
  constructor(private storageService: StorageService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir imagen a Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_, file, cb) => {
        if (!ALLOWED.includes(file.mimetype)) {
          return cb(new BadRequestException('Solo se permiten imágenes JPG, PNG, WebP o GIF'), false);
        }
        cb(null, true);
      },
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    return this.storageService.uploadBuffer(file.buffer, 'catalogo-saas/products');
  }

  @Post('upload/qr')
  @ApiOperation({ summary: 'Subir QR de pago del negocio' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: MAX_SIZE },
      fileFilter: (_, file, cb) => {
        if (!ALLOWED.includes(file.mimetype)) {
          return cb(new BadRequestException('Solo se permiten imágenes'), false);
        }
        cb(null, true);
      },
    }),
  )
  async uploadQr(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No se recibió ningún archivo');
    return this.storageService.uploadBuffer(file.buffer, 'catalogo-saas/qr-codes');
  }

  @Delete(':publicId(*)')
  @ApiOperation({ summary: 'Eliminar imagen de Cloudinary' })
  async delete(@Param('publicId') publicId: string) {
    await this.storageService.delete(publicId);
    return { message: 'Imagen eliminada' };
  }
}
