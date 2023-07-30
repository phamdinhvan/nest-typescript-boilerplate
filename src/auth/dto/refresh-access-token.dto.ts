import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class RefreshAccessTokenDto {
  @ApiProperty({
    type: String,
    description: 'Refresh token',
    required: true,
  })
  @IsString({ message: 'VALIDATE.REFRESH_TOKEN.MUST_BE_STRING' })
  @IsNotEmpty({ message: 'VALIDATE.REFRESH_TOKEN.IS_REQUIRED' })
  refreshToken: string;
}
