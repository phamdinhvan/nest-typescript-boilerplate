import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from '../../common/dto';
import { UploadFilesDto } from '../dto';
import { UploadFileInterface } from '../interfaces/upload-file.interface';
import { FileService } from '../services/file.service';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FileService) {}

  @Post('upload-files')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FilesInterceptor('files', null, {
      limits: {
        fileSize: Number(process.env.maxFileSize ?? 1024 * 1024 * 100),
      },
    }),
  )
  async uploadFiles(
    @Body() _conditions: UploadFilesDto,
    @UploadedFiles() files: UploadFileInterface[],
  ): Promise<ResponseDto> {
    const filesUploaded = await this.filesService.uploadFiles(files);
    return new ResponseDto().withData(filesUploaded);
  }
}
