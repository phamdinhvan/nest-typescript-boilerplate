import { Module } from '@nestjs/common';
import { FileService } from './services/file.service';
import { FilesController } from './controllers/files.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import * as AWS from 'aws-sdk';

@Module({
  imports: [SequelizeModule.forFeature([])],
  controllers: [FilesController],
  providers: [
    {
      provide: AWS.S3,
      useFactory: () => {
        const spacesEndpoint = new AWS.Endpoint(
          process.env.DO_SPACES_END_POINT,
        );
        return new AWS.S3({
          endpoint: spacesEndpoint.href,
          credentials: new AWS.Credentials({
            accessKeyId: process.env.DO_SPACES_ACESS_KEY_ID,
            secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
          }),
        });
      },
    },
    FileService,
  ],
})
export class FilesModule {}
