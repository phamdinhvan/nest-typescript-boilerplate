import { Transaction } from 'sequelize';
import { ResponseDto } from '../../dto';
import { PaginatedResult } from '../../services/paginate';

interface Options {
  isPaginate?: boolean;
  transaction?: Transaction;
  message?: string;
}

export class CommonUtils {
  static async handlingApi<T>(cb: () => Promise<T>, options?: Options) {
    const responseDto = new ResponseDto();
    try {
      const data = (await cb()) as T;
      if (data) {
        if (options) {
          const { isPaginate, transaction, message } = options;
          //commit transaction
          if (transaction) {
            await transaction.commit();
          }
          if (isPaginate) {
            return responseDto.withPaginationData<T>(
              data as PaginatedResult<T>,
            );
          }
          if (message) {
            return responseDto.withMessage(message);
          }
        }
        return responseDto.withData<T>(data);
      }
    } catch (error) {
      //log error
      console.log(38, error.message);
      //rollback transaction
      if (options && options.transaction) {
        await options.transaction.rollback();
      }
      throw error;
    }
  }
}
