import {
  Body,
  Controller,
  Put,
  Req,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserJwtAuthGuard } from '../../auth/guards';
import { TransformErrorFilter } from '../../common/filters/transform-error.filter';
import { IRequestOptions } from '../../common/interfaces';
import { CommonUtils } from '../../common/utils';
import { UploadFileInterface } from '../../files/interfaces/upload-file.interface';
import { UpdateProfileDto } from '../dto';
import { UserModel } from '../models/user.model';
import { UserService } from '../services/user.service';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Put('update-profile')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatar'))
  @UseFilters(new TransformErrorFilter([]))
  async updateProfile(
    @Req() req: IRequestOptions,
    @Body() conditions: UpdateProfileDto,
    @UploadedFile()
    avatar?: UploadFileInterface,
  ) {
    const transaction = await this.userService.transaction();
    return await CommonUtils.handlingApi<UserModel>(
      async () => {
        const { id } = req.user;
        const userInfo = await this.userService.updateProfile(
          conditions,
          id,
          avatar,
          transaction,
        );
        return userInfo;
      },
      { transaction },
    );
  }
}
