import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RegisterDto {
  @ApiProperty({
    type: String,
    description: 'First name',
    required: true,
    default: 'Lê',
  })
  @IsNotEmpty({ message: 'VALIDATE.PASSWORD.IS_REQUIRED' })
  @IsString({ message: 'VALIDATE.PASSWORD.MUST_BE_STRING' })
  firstName: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Last name',
    required: true,
    default: 'Minh Đức',
  })
  @IsNotEmpty({ message: 'VALIDATE.PASSWORD.IS_REQUIRED' })
  @IsString({ message: 'VALIDATE.PASSWORD.MUST_BE_STRING' })
  lastName: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Email',
    required: true,
    default: 'duc121026ab@gmail.com',
  })
  @IsNotEmpty({ message: 'VALIDATE.EMAIL.IS_REQUIRED' })
  @IsEmail({}, { message: 'VALIDATE.EMAIL.MUST_BE_EMAIL' })
  email: string;
  /** ------------------ */

  @ApiProperty({
    type: String,
    description: 'Password',
    required: true,
    default: 'duc121026',
  })
  @IsNotEmpty({ message: 'VALIDATE.PASSWORD.IS_REQUIRED' })
  @IsString({ message: 'VALIDATE.PASSWORD.MUST_BE_STRING' })
  password: string;
  /** ------------------ */
}
