import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TransformErrorFilter } from '../../common/filters/transform-error.filter';
import { IRequestOptions } from '../../common/interfaces';
import { CommonUtils } from '../../common/utils';
import { UserModel } from '../../users/models/user.model';
import { LoginDto, RegisterDto } from '../dto';
import { RefreshAccessTokenDto } from '../dto/refresh-access-token.dto';
import { VerifyRefreshTokenDto } from '../dto/verify-refresh-token.dto';
import { UserJwtAuthGuard } from '../guards';
import { ILoginOutputModel } from '../interfaces';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
  ) {}

  @Post('register')
  @UseFilters(new TransformErrorFilter([]))
  async register(@Body() conditions: RegisterDto) {
    const transaction = await this.authService.userTransaction();
    return await CommonUtils.handlingApi<UserModel>(
      async () => {
        const user = await this.authService.register(conditions, transaction);
        return user;
      },
      { transaction },
    );
  }

  @Post('login')
  @UseFilters(new TransformErrorFilter([]))
  async login(@Body() conditions: LoginDto) {
    return await CommonUtils.handlingApi<ILoginOutputModel>(async () => {
      const user = await this.authService.login(conditions);
      return user;
    });
  }

  @Get('me')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new TransformErrorFilter([]))
  async me(@Req() req: IRequestOptions) {
    return await CommonUtils.handlingApi<UserModel>(async () => {
      const { id } = req.user;
      const user = await this.authService.getMe(id);
      return user;
    });
  }

  @Post('verify-refresh-token')
  async verifyRefreshToken(@Body() data: VerifyRefreshTokenDto) {
    return await CommonUtils.handlingApi<any>(async () => {
      const payload = await this.tokenService.verifyRefreshToken(
        data.refreshToken,
      );
      const profile = await this.authService.getMe(payload.userId);
      return { profile };
    });
  }

  @Post('refresh-access-token')
  async refreshAccessToken(
    @Body() data: RefreshAccessTokenDto,
  ): Promise<object> {
    const token = await this.tokenService.refreshAccessToken(data.refreshToken);
    return token;
  }
}
