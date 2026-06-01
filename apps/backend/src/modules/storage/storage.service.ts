import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
  format: string;
  resourceType: 'image' | 'video';
  duration?: number;
}

@Injectable()
export class StorageService {
  constructor(private config: ConfigService) {
    cloudinary.config({
      cloud_name: this.config.get('CLOUDINARY_CLOUD_NAME'),
      api_key:    this.config.get('CLOUDINARY_API_KEY'),
      api_secret: this.config.get('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadBuffer(
    buffer: Buffer,
    folder: string,
    resourceType: 'image' | 'video' | 'auto' = 'auto',
  ): Promise<UploadResult> {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
          transformation: resourceType === 'image'
            ? [{ quality: 'auto', fetch_format: 'auto' }]
            : undefined,
        },
        (err, result) => {
          if (err || !result) {
            reject(new InternalServerErrorException('Error subiendo archivo a Cloudinary'));
            return;
          }
          resolve({
            url:          result.secure_url,
            publicId:     result.public_id,
            width:        result.width,
            height:       result.height,
            format:       result.format,
            resourceType: result.resource_type as 'image' | 'video',
            duration:     (result as any).duration,
          });
        },
      );
      stream.end(buffer);
    });
  }

  async delete(publicId: string, resourceType: 'image' | 'video' = 'image'): Promise<void> {
    try {
      await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
    } catch {
      // No lanzar error si la imagen no existe
    }
  }
}
