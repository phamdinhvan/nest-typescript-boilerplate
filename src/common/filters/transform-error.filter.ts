import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ResponseDto } from '../dto';
import { Response } from 'express';

@Catch(Error)
export class TransformErrorFilter implements ExceptionFilter<Error> {
  constructor(
    private readonly catchErrors: {
      fromMessage: string;
      toMessage: string;
      statusCode: HttpStatus;
    }[],
  ) {}

  catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse() as Response;
    const request = ctx.getRequest();

    try {
      for (const catchError of this.catchErrors) {
        if (error.message === catchError.fromMessage) {
          throw new HttpException(catchError.toMessage, catchError.statusCode);
        }
      }

      throw error;
    } catch (e) {
      console.log(e);
      if (e instanceof HttpException) {
        response
          .status(e.getStatus())
          .send(new ResponseDto().withHttpException(e, request));
      } else {
        response
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .send(new ResponseDto().withError(e, request));
      }
    }
  }
}
