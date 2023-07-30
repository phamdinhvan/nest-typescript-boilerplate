import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    type: String,
    description: 'First name',
    required: true,
    default: 'Lê',
  })
  @IsNotEmpty({ message: 'VALIDATE.FIRST_NAME.IS_REQUIRED' })
  @IsString({ message: 'VALIDATE.FIRST_NAME.MUST_BE_STRING' })
  firstName: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Last name',
    required: true,
    default: 'Minh Đức',
  })
  @IsNotEmpty({ message: 'VALIDATE.LAST_NAME.IS_REQUIRED' })
  @IsString({ message: 'VALIDATE.LAST_NAME.MUST_BE_STRING' })
  lastName: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Phone',
    required: false,
    default: '0963402842',
  })
  @IsOptional()
  phone?: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    format: 'binary',
    description: 'Partner avatar. Accept jpg, png, jpeg',
    required: false,
  })
  @IsOptional()
  avatar?: any;
  /** ------------------ */

  // @ApiProperty({
  //   type: Array,
  //   format: 'binary',
  //   description: 'Partner avatar. Accept jpg, png, jpeg',
  //   required: false,
  // })
  // @IsOptional()
  // files?: any[];
  // /** ------------------ */
}
