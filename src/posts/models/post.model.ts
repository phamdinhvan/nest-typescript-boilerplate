import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

@Table({
  tableName: 'post',
  paranoid: true,
  timestamps: true,
  freezeTableName: true,
})
export class PostModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'title',
  })
  title: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'avatar_path',
  })
  avatarPath: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    field: 'status',
  })
  status: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'content',
  })
  content: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
    field: 'allow_seo',
  })
  allowSeo: boolean;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'title_seo',
  })
  titleSeo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'desc_seo',
  })
  descSeo: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    field: 'slug_seo',
  })
  slugSeo: string;
}
