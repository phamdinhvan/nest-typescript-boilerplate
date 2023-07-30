import { FindOptions } from 'sequelize';
import { Model } from 'sequelize-typescript';

export interface PaginateOptions {
  pageNum?: number | string;
  pageSize?: number | string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  query?: FindOptions;
}

export interface Pagination {
  totalRecords: number;
  pageNum: number;
  totalPages: number;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: Pagination;
  _isPagination: boolean;
}

type NonAbstract<T> = { [P in keyof T]: T[P] };
type Constructor<T> = new () => T;
type NonAbstractTypeOfModelSequelize<T> = Constructor<T> &
  NonAbstract<typeof Model>;

async function paginate<T extends Model<T>>(
  model: NonAbstractTypeOfModelSequelize<T>,
  options: PaginateOptions,
): Promise<PaginatedResult<T>> {
  const { pageNum, pageSize, sortBy, sortOrder, query } = options;

  //  clone query to find all
  const queryFindData: FindOptions = { ...query };

  const offset = (+pageNum - 1) * +pageSize;
  const limit = +pageSize;
  // const order = [sortBy, sortOrder.toUpperCase()]];

  queryFindData.limit = limit;
  queryFindData.offset = offset;
  queryFindData.order = [[sortBy, sortOrder.toUpperCase()]];

  // Count meta totalPages
  const countQuery = { ...query, distinct: true };

  let totalRecords: number | any = await model.count(countQuery);

  // with case group by id
  if (totalRecords instanceof Array && totalRecords.length) {
    totalRecords = new Set(totalRecords.map((item: any) => item.id)).size;
  }
  const totalPages = Math.ceil(totalRecords / limit);

  // Get data
  const data = await model.findAll(queryFindData);

  const meta: Pagination = {
    totalRecords: totalRecords,
    pageNum: +pageNum,
    totalPages,
  };

  return {
    data: data,
    meta,
    _isPagination: true,
  };
}

export default paginate;
