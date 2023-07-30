import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class UploadFilesDto {
  @ApiProperty({
    type: Array,
    format: 'binary',
    description: 'Partner avatar. Accept jpg, png, jpeg',
    required: false,
  })
  @IsOptional()
  files?: any[];
  // /** ------------------ */
}
