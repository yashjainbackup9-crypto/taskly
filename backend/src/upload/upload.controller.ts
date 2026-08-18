import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file?: Express.Multer.File, @Body('image') base64Image?: string) {
    if (file) {
      const result = await this.uploadService.uploadFile(file);
      return { success: true, ...result };
    }

    if (base64Image) {
      const result = await this.uploadService.uploadBase64(base64Image);
      return { success: true, ...result };
    }

    throw new BadRequestException('Please provide a file in multipart form or a base64 image string');
  }
}
