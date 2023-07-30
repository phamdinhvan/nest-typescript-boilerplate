import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends CreatePostDto {
  @ApiProperty({
    type: String,
    description: 'Avatar path',
    required: false,
  })
  @IsString({ message: 'VALIDATE.AVATAR_PATH.MUST_BE_STRING' })
  @IsOptional()
  avatarPath?: string;
  /** ------------------ */
}
