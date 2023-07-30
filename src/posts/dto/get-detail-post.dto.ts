import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetDetailPostByIdDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'Partner postId',
  })
  @IsString({ message: 'VALIDATE.POST_ID.MUST_BE_STRING' })
  postId: string;
}
