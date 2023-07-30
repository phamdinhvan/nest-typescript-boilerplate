import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyRefreshTokenDto {
  @ApiProperty({
    type: String,
    description: 'Refresh token',
    required: true,
  })
  @IsString({ message: 'VALIDATE.REFRESH_TOKEN.MUST_BE_STRING' })
  @IsNotEmpty({ message: 'VALIDATE.REFRESH_TOKEN.IS_REQUIRED' })
  refreshToken: string;
}
