import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserTokenAuthStrategy } from './strategies/user-token-auth.strategy';
import { TokenService } from './services/token.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.JWT_EXPIRATION ?? '7d' },
    }),
  ],
  providers: [AuthService, TokenService, UserTokenAuthStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
