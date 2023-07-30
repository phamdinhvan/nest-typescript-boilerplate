import { HttpException, HttpStatus } from '@nestjs/common';
import { Request } from 'express';
import { PaginatedResult, Pagination } from '../services/paginate';

export class ResponseDto {
  statusCode: HttpStatus = HttpStatus.OK;
  message?: string;
  data?: any;
  errors?: string[];
  debug?: any;
  timestamp?: string;
  path?: string;
  meta?: Pagination;

  // constructor() {
  //   return new Proxy(this, {
  //     get(target, prop, receiver) {
  //       target.resetDefaultValues(); //call resetDefaultValues after call method of class
  //       const value = Reflect.get(target, prop, receiver);
  //       if (typeof value === 'function') {
  //         return (...args: any[]) => {
  //           const result = value.apply(target, args);
  //           return result;
  //         };
  //       }
  //       return value;
  //     },
  //   });
  // }

  // resetDefaultValues(): void {
  //   this.statusCode = HttpStatus.OK;
  //   this.data = undefined;
  //   this.meta = undefined;
  //   this.message = undefined;
  //   this.errors = undefined;
  //   this.debug = undefined;
  //   this.timestamp = undefined;
  //   this.path = undefined;
  // }

  withStatus(statusCode: HttpStatus): ResponseDto {
    this.statusCode = statusCode;
    return this;
  }

  withMessage(message: string): ResponseDto {
    this.message = message;
    return this;
  }

  withSuccessMessage(): ResponseDto {
    this.message = 'SUCCESS';
    return this;
  }

  withData<T>(data: T): ResponseDto {
    this.data = data;
    return this;
  }

  withPaginationData<T>(resultPagination: PaginatedResult<T>): ResponseDto {
    this.data = resultPagination.data;
    this.meta = resultPagination.meta;
    return this;
  }

  withError(error: Error, request?: Request): ResponseDto {
    this.errors = [error.message];
    this.statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    this.timestamp = new Date().toISOString();
    this.path = request?.url;
    return this;
  }

  withHttpException(exception: HttpException, request: Request): ResponseDto {
    const exceptionResponse = exception.getResponse();

    this.statusCode = exception.getStatus();
    this.errors =
      typeof exceptionResponse === 'string'
        ? [exceptionResponse]
        : exceptionResponse['message'];
    this.timestamp = new Date().toISOString();
    this.path = request.url;

    return this;
  }
}
