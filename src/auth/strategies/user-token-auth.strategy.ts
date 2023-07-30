import {
  HttpException,
  HttpStatus,
  Injectable,
  OnModuleInit,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserModel } from '../../users/models/user.model';
import { UserService } from '../../users/services/user.service';
import { IAuthPayloadOutputModel } from '../interfaces';

@Injectable()
export class UserTokenAuthStrategy
  extends PassportStrategy(Strategy, 'user-jwt')
  implements OnModuleInit
{
  private userService: UserService;

  constructor(private moduleRef: ModuleRef, private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async onModuleInit() {
    this.userService = await this.moduleRef.get(UserService, {
      strict: false,
    });
  }

  async validate(payload: IAuthPayloadOutputModel) {
    const userInfo = await this.userService.findOne({
      where: { id: payload.userId },
    });

    if (!userInfo) {
      throw new HttpException(
        'AUTH.PERMISSION_DENIED',
        HttpStatus.UNAUTHORIZED,
      );
    }
    delete userInfo.password;
    return userInfo;
  }

  async verifyAccessToken(accessToken: string): Promise<UserModel | null> {
    const payload = await this.jwtService.verifyAsync(accessToken);
    return payload;
  }
}
