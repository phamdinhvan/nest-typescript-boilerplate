import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostModel } from './models/post.model';
import { PostController } from './controllers/post.controller';
import { PostService } from './services/post.service';

@Module({
  imports: [PassportModule, SequelizeModule.forFeature([PostModel])],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}
