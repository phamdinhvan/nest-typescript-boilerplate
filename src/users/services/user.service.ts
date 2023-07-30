import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { UploadFileInterface } from '../../files/interfaces/upload-file.interface';
import { FileService } from '../../files/services/file.service';
import { UpdateProfileDto } from '../dto';
import { UserModel } from '../models/user.model';
import { BasePostgresRepositoryService } from '../../common/services';

@Injectable()
export class UserService
  extends BasePostgresRepositoryService<UserModel>
  implements OnModuleInit
{
  private userService: UserService;
  private fileService: FileService;

  constructor(
    private moduleRef: ModuleRef,
    @InjectModel(UserModel)
    protected model: typeof UserModel,
  ) {
    super(model);
  }

  async onModuleInit() {
    this.userService = await this.moduleRef.get(UserService, {
      strict: false,
    });
    this.fileService = await this.moduleRef.get(FileService, {
      strict: false,
    });
  }

  async transaction(): Promise<Transaction> {
    return this.model.sequelize.transaction();
  }

  async updateProfile(
    conditions: UpdateProfileDto,
    userId: string,
    avatar?: UploadFileInterface,
    transaction?: Transaction,
  ): Promise<UserModel> {
    const data = { ...conditions };

    if (avatar) {
      const path = await this.fileService.uploadFile(avatar);
      data.avatar = path;
    }

    await this.model.update(data, {
      where: {
        id: userId,
      },
      transaction,
    });

    const userInfo = await this.findOne({ where: { id: userId }, transaction });
    return userInfo;
  }
}
