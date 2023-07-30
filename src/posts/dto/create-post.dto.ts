import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePostDto {
  @ApiProperty({
    type: String,
    description: 'Title',
    required: true,
    default: 'Bai viet 1',
  })
  @IsNotEmpty({ message: 'VALIDATE.TITLE.IS_REQUIRED' })
  @IsString({ message: 'VALIDATE.TITLE.MUST_BE_STRING' })
  title: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'Partner avatar. Accept jpg, png, jpeg',
    required: false,
  })
  @IsOptional()
  avatarPost?: any;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Status',
    required: true,
    default: 'true',
  })
  //   @IsBoolean({ message: 'VALIDATE.STATUS.MUST_BE_BOOLEAN' })
  status: boolean;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Content',
    required: false,
    default: '',
  })
  @IsString({ message: 'VALIDATE.CONTENT.MUST_BE_STRING' })
  @IsOptional()
  content?: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Allow SEO',
    required: false,
    default: 'false',
  })
  //   @IsBoolean({ message: 'VALIDATE.ALLOW_SEO.MUST_BE_BOOLEAN' })
  allowSeo: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Title SEO',
    required: false,
  })
  @IsString({ message: 'VALIDATE.TITLE_SEO.MUST_BE_STRING' })
  @IsOptional()
  titleSeo?: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Description SEO',
    required: false,
    default: '',
  })
  @IsString({ message: 'VALIDATE.CONTENT.MUST_BE_STRING' })
  @IsOptional()
  descSeo?: string;
  /** ------------------ */
}
