import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'ddfkglbwh',
      api_key: process.env.CLOUDINARY_API_KEY || '347461574359385',
      api_secret: process.env.CLOUDINARY_API_SECRET || 'NggcsHXLdudh-JA_BE5Vd5uBvn8',
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; public_id: string; format: string }> {
    if (!file) {
      throw new BadRequestException('No file provided for upload');
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'taskly',
          resource_type: 'auto',
        },
        (error, result) => {
          if (error) return reject(new BadRequestException(error.message));
          if (!result) return reject(new BadRequestException('Cloudinary upload failed'));
          resolve({
            url: result.secure_url,
            public_id: result.public_id,
            format: result.format,
          });
        }
      );

      const stream = new Readable();
      stream.push(file.buffer);
      stream.push(null);
      stream.pipe(uploadStream);
    });
  }

  async uploadBase64(base64Data: string): Promise<{ url: string; public_id: string; format: string }> {
    try {
      const result = await cloudinary.uploader.upload(base64Data, {
        folder: 'taskly',
        resource_type: 'auto',
      });
      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
      };
    } catch (err: any) {
      throw new BadRequestException(err?.message || 'Failed to upload base64 image');
    }
  }
}
