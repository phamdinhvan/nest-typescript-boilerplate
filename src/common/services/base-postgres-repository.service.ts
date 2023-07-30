import {
  CreateOptions,
  DestroyOptions,
  FindOptions,
  Op,
  UpdateOptions,
  WhereOptions,
} from 'sequelize';
import { Model, ModelCtor } from 'sequelize-typescript';
import { Transaction } from 'sequelize/types';
import { PaginateOptions, PaginatedResult, Pagination } from './paginate';
import { MakeNullishOptional } from 'sequelize/types/utils';

export class BasePostgresRepositoryService<M extends Model> {
  constructor(private readonly modelClass: ModelCtor<M>) {}

  async transaction(): Promise<Transaction> {
    return this.modelClass.sequelize.transaction();
  }

  async findById(id: string): Promise<M> {
    return await this.modelClass.findByPk(id);
  }

  async findByPk(id: string): Promise<M> {
    return await this.modelClass.findByPk(id);
  }

  async findAll(
    options?: FindOptions & { where: WhereOptions<Partial<M>> },
  ): Promise<M[]> {
    return await this.modelClass.findAll(options);
  }

  async findOne(
    options?: FindOptions & { where: WhereOptions<Partial<M>> },
  ): Promise<M> {
    return await this.modelClass.findOne(options);
  }

  async update(data: Partial<M>, options?: UpdateOptions): Promise<boolean> {
    const [rowsAffected] = await this.modelClass.update(data, options);
    return rowsAffected > 0;
  }

  async create(value: Partial<M>, options?: CreateOptions): Promise<M> {
    const record = await this.modelClass.create(
      value as MakeNullishOptional<M['_creationAttributes']>,
      options,
    );
    return record ? record.toJSON() : null;
  }

  async destroy(options?: DestroyOptions): Promise<boolean> {
    const rowsAffected = await this.modelClass.destroy(options);
    return rowsAffected > 0;
  }

  async paginate(options: PaginateOptions): Promise<PaginatedResult<M>> {
    const { pageNum, pageSize, sortBy, sortOrder, query } = options;

    //  clone query to find all
    const queryFindData: FindOptions = { ...query };

    const offset = (+pageNum - 1) * +pageSize;
    const limit = pageSize;

    queryFindData.limit = +limit;
    queryFindData.offset = offset;
    queryFindData.order = [[sortBy, sortOrder.toUpperCase()]];

    // Count meta totalPages
    const countQuery = { ...query, distinct: true };

    let totalRecords: number | any = await this.modelClass.count(countQuery);

    // with case group by id
    if (totalRecords instanceof Array && totalRecords.length) {
      totalRecords = new Set(totalRecords.map((item: any) => item.id)).size;
    }
    const totalPages = Math.ceil(totalRecords / +limit);

    // Get data
    const data = await this.modelClass.findAll(queryFindData);

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

  protected parseFilterDate(filter: object): object {
    const filterDate = {};

    if (filter['date'] && filter['date']['from']) {
      filterDate[Op.gte] = filter['date']['from'];
    }

    if (filter['date'] && filter['date']['to']) {
      filterDate[Op.lte] = filter['date']['to'];
    }

    return filterDate;
  }
}
