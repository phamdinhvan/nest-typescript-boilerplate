import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import {
  IAuthPayloadInputModel,
  IAuthPayloadOutputModel,
} from '../../auth/interfaces';
import { UserModel } from '../../users/models/user.model';
import { UserService } from '../../users/services/user.service';

@Injectable()
export class TokenService implements OnModuleInit {
  private userService: UserService;

  constructor(private moduleRef: ModuleRef, private jwtService: JwtService) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, {
      strict: false,
    });
  }

  async generateToken(user: UserModel): Promise<string[]> {
    const payload: IAuthPayloadInputModel = {
      sub: user.id,
      userId: user.id,
    };

    return await Promise.all([
      /// access token
      this.jwtService.sign(payload),
      /// refresh token
      this.jwtService.sign(payload, {
        secret: process.env.JWT_REFRESH_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIREATION ?? '7d',
      }),
    ]);
  }

  async verifyRefreshToken(
    refreshToken: string,
  ): Promise<IAuthPayloadOutputModel> {
    const payload: IAuthPayloadOutputModel = await this.jwtService.verify(
      refreshToken,
      {
        secret: process.env.JWT_REFRESH_SECRET,
        ignoreExpiration: false,
      },
    );
    return payload;
  }

  async refreshAccessToken(refreshToken: string): Promise<object> {
    const payload = await this.verifyRefreshToken(refreshToken);
    if (payload) {
      const user = await this.userService.findOne({
        where: { id: payload['sub'] },
      });

      if (!user) {
        throw new HttpException(
          'AUTH.PERMISSION_DENIED',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const [accessToken, refreshToken] = await this.generateToken(user);
      return {
        accessToken,
        refreshToken,
      };
    }
    throw new UnauthorizedException();
  }
}
