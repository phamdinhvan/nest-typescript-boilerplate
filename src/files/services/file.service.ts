import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { config } from 'dotenv';
import { UploadFileInterface } from '../interfaces/upload-file.interface';

config();

@Injectable()
export class FileService {
  private s3: AWS.S3;

  constructor() {
    const spacesEndpoint = new AWS.Endpoint(process.env.DO_SPACES_END_POINT);
    this.s3 = new AWS.S3({
      endpoint: spacesEndpoint.href,
      credentials: new AWS.Credentials({
        accessKeyId: process.env.DO_SPACES_ACESS_KEY_ID,
        secretAccessKey: process.env.DO_SPACES_SECRET_ACCESS_KEY,
      }),
      region: process.env.DO_SPACE_REGION,
      // signatureVersion: process.env.DO_SPACE_SIGNATURE_VERSION,
    });
  }

  async getSignedUrls(fileNames: string[]): Promise<string[]> {
    if (!fileNames || !fileNames.length) {
      throw new Error('SOMETHING_WENT_WRONG');
    }
    const paths: string[] = [];
    const signedUrlExpireSeconds = 60 * 5;
    for (const fileName of fileNames) {
      const url: string = await this.s3.getSignedUrlPromise('getObject', {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileName,
        Expires: signedUrlExpireSeconds,
      });

      paths.push(url);
    }

    if (!paths || !paths.length) {
      throw new Error('SOMETHING_WENT_WRONG');
    }
    console.log(104, paths);
    return paths;
  }

  async uploadFiles(files: UploadFileInterface[]): Promise<string[]> {
    if (!files || !files.length) return;

    const uploadPromises = files.map((file) => {
      // Precaution to avoid having 2 files with the same name
      const fileName = `${Date.now()}-${file.originalname}`;
      const uploadParams = {
        Bucket: process.env.DO_SPACES_BUCKET,
        Key: fileName,
        Body: file.buffer,
        ACL: 'public-read',
      };

      return this.s3.upload(uploadParams).promise();
    });

    const results = await Promise.all(uploadPromises);
    const keys = results.map((result) => result.Key);
    const urls = await this.getSignedUrls(keys);
    return urls;
  }

  async uploadFile(file: UploadFileInterface): Promise<string> {
    if (!file) return;

    // Precaution to avoid having 2 files with the same name
    const fileName = `${Date.now()}-${file.originalname}`;

    return new Promise((resolve, reject) => {
      this.s3.upload(
        {
          Bucket: process.env.DO_SPACES_BUCKET,
          Key: fileName,
          Body: file.buffer,
          ACL: 'public-read',
        },
        (error: AWS.AWSError, data) => {
          if (!error) {
            this.getSignedUrls([data.Key]).then((res) => {
              resolve(res[0]);
            });
          } else {
            reject(
              new Error(
                `DoSpacesService_ERROR: ${
                  error.message || 'Something went wrong'
                }`,
              ),
            );
          }
        },
      );
    });
  }

  async deleteFiles(urls: string[]): Promise<void> {
    const deleteObjectsParams = {
      Bucket: process.env.DO_SPACES_BUCKET,
      Delete: {
        Objects: [],
      },
    };

    urls.forEach((url) => {
      const urlParts = url.split('/');
      const fileKey = urlParts.slice(3).join('/');

      deleteObjectsParams.Delete.Objects.push({
        Key: fileKey,
      });
    });

    this.s3.deleteObjects(deleteObjectsParams, (err, data) => {
      if (err) {
        console.error(err);
      } else {
        console.log(data.Deleted);
      }
    });
  }
}
