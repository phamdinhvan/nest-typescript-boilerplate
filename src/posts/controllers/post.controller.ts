import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { UserJwtAuthGuard } from '../../auth/guards';
import { TransformErrorFilter } from '../../common/filters/transform-error.filter';
import { CommonUtils } from '../../common/utils';
import { UploadFileInterface } from '../../files/interfaces/upload-file.interface';
import { CreatePostDto } from '../dto/create-post.dto';
import { GetPostDto } from '../dto/get-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostService } from '../services/post.service';

@ApiTags('Posts')
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post('create-post')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatarPost'))
  @UseFilters(new TransformErrorFilter([]))
  async createPost(
    @Body() conditions: CreatePostDto,
    @UploadedFile()
    avatarPost?: UploadFileInterface,
  ) {
    const transaction = await this.postService.transaction();
    return await CommonUtils.handlingApi(
      async () => {
        const post = await this.postService.createPost(
          conditions,
          avatarPost,
          transaction,
        );
        return post;
      },
      { transaction },
    );
  }

  @Post('update-post/:postId')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('avatarPost'))
  @UseFilters(new TransformErrorFilter([]))
  async updatePost(
    @Param('postId') postId: string,
    @Body() conditions: UpdatePostDto,
    @UploadedFile()
    avatarPost?: UploadFileInterface,
  ) {
    const transaction = await this.postService.transaction();
    return await CommonUtils.handlingApi(
      async () => {
        const post = await this.postService.updatePost(
          postId,
          conditions,
          avatarPost,
          transaction,
        );
        return post;
      },
      { transaction },
    );
  }

  @Get('get-posts')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new TransformErrorFilter([]))
  async getPost(@Query() conditions: GetPostDto) {
    return await CommonUtils.handlingApi(
      async () => {
        const post = await this.postService.getPost(conditions);
        return post;
      },
      {
        isPaginate: true,
      },
    );
  }

  @Get('get-detail-post/:postId')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new TransformErrorFilter([]))
  async getDetailPostById(@Param('postId') postId: string) {
    return await CommonUtils.handlingApi(async () => {
      const post = await this.postService.getDetailPostById(postId);
      return post;
    });
  }

  @Delete('delete-post/:postId')
  @UseGuards(UserJwtAuthGuard)
  @ApiBearerAuth()
  @UseFilters(new TransformErrorFilter([]))
  async deletePostById(@Param('postId') postId: string) {
    return await CommonUtils.handlingApi(
      async () => {
        return await this.postService.deleteDetailPostById(postId);
      },
      {
        message: 'DELETE_POST_SUCCESSFULLY',
      },
    );
  }
}
