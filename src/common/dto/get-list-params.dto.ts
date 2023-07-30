import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class GetListParamsDto {
  @ApiProperty({
    type: Object,
    required: false,
    example: { fieldName: 'value', searchValue: 'value' },
  })
  @Optional()
  // @IsObject({ message: 'VALIDATE.FILTER.INVALID_FORMAT' })
  filter: object;

  @ApiProperty({
    type: String,
    required: false,
    example: 'createdAt',
  })
  @Optional()
  @IsString({ message: 'VALIDATE.SORT_BY.INVALID_FORMAT' })
  sortBy: string;

  @ApiProperty({
    type: String,
    required: false,
    example: 'desc',
  })
  @Optional()
  @IsString({ message: 'VALIDATE.SORT_ORDER.INVALID_FORMAT' })
  sortOrder: 'desc' | 'asc';

  @ApiProperty({ type: Number, required: false, example: 10, default: 10 })
  @Optional()
  // @IsNumber({}, { message: 'VALIDATE.LIMIT.MUST_BE_NUMBER' })
  pageSize = 10;

  @ApiProperty({ type: Number, required: false, example: 1, default: 1 })
  @Optional()
  // @IsNumber({}, { message: 'VALIDATE.PAGE.MUST_BE_NUMBER' })
  pageNum = 1;
}
