import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { InjectModel } from '@nestjs/sequelize';
import { Transaction } from 'sequelize';
import { BasePostgresRepositoryService } from '../../common/services';
import { PaginatedResult } from '../../common/services/paginate';
import { OtherUtils } from '../../common/utils';
import { UploadFileInterface } from '../../files/interfaces/upload-file.interface';
import { FileService } from '../../files/services/file.service';
import { PostModel } from '../../posts/models/post.model';
import { CreatePostDto } from '../dto/create-post.dto';
import { GetPostDto } from '../dto/get-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';

@Injectable()
export class PostService
  extends BasePostgresRepositoryService<PostModel>
  implements OnModuleInit
{
  private fileService: FileService;

  constructor(
    private moduleRef: ModuleRef,
    @InjectModel(PostModel)
    protected model: typeof PostModel,
  ) {
    super(model);
  }

  async onModuleInit() {
    this.fileService = await this.moduleRef.get(FileService, {
      strict: false,
    });
  }

  async getPost(conditions: GetPostDto): Promise<PaginatedResult<PostModel>> {
    const posts = await this.paginate({
      ...conditions,
    });
    return posts;
  }

  async getDetailPostById(
    postId: string,
    transaction?: Transaction,
  ): Promise<PostModel> {
    const post = await this.findOne({
      where: {
        id: postId,
      },
      transaction,
    });
    if (!post) {
      throw new Error('POST_ID_NOT_EXITS');
    }
    return post;
  }

  async createPost(
    conditions: CreatePostDto,
    avatarPost: UploadFileInterface,
    transaction: Transaction,
  ): Promise<PostModel> {
    const { title, status, content, allowSeo, titleSeo, descSeo } = conditions;
    const promises: any[] = [this.fileService.uploadFile(avatarPost)];

    const slug = OtherUtils.generateSlug(titleSeo);
    if (!!slug) {
      promises.push(
        this.findOne({
          where: {
            slugSeo: slug,
          },
          transaction,
        }),
      );
    }
    const [url, exitsPost] = await Promise.all([...promises]);
    if (exitsPost) {
      throw new Error('SLUG_POST_IS_EXITS');
    }

    const post = await this.create(
      {
        avatarPath: url,
        allowSeo: Boolean(allowSeo),
        title,
        status,
        content,
        titleSeo,
        descSeo,
        slugSeo: slug,
      },
      { transaction },
    );
    return post;
  }

  async updatePost(
    postId: string,
    conditions: UpdatePostDto,
    avatarPost: UploadFileInterface,
    transaction: Transaction,
  ): Promise<PostModel> {
    const { title, status, content, allowSeo, titleSeo, descSeo, avatarPath } =
      conditions;

    // check exits
    await this.getDetailPostById(postId);

    const promises: any[] = [this.fileService.uploadFile(avatarPost)];

    const slug = OtherUtils.generateSlug(titleSeo);
    if (!!slug) {
      promises.push(
        this.findOne({
          where: {
            slugSeo: slug,
          },
          transaction,
        }),
      );
    }
    const [url, exitsPost] = await Promise.all([...promises]);
    if (exitsPost) {
      throw new Error('SLUG_POST_IS_EXITS');
    }

    const post = await this.update(
      {
        avatarPath: url || avatarPath || null,
        allowSeo: Boolean(allowSeo),
        title,
        status,
        content,
        titleSeo,
        descSeo,
        slugSeo: slug,
      },
      { where: { id: postId }, transaction },
    );

    if (!post) {
      throw new Error('UPDATE_POST_FAILURE');
    }
    return await this.getDetailPostById(postId, transaction);
  }

  async deleteDetailPostById(postId: string): Promise<boolean> {
    return await this.destroy({
      where: {
        id: postId,
      },
    });
  }
}
