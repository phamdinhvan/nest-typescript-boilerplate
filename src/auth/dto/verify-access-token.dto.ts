import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAccessTokenDto {
  @ApiProperty({
    type: String,
    description: 'Acesss token',
    required: true,
  })
  @IsString({ message: 'VALIDATE.ACCESS_TOKEN.MUST_BE_STRING' })
  @IsNotEmpty({ message: 'VALIDATE.ACCESS_TOKEN.IS_REQUIRED' })
  accessToken: string;
}
