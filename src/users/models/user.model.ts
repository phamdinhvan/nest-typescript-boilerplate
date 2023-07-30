import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

// export interface IUserBaseModel {
//   id: string;
//   firstName: string;
//   lastName: string;
//   email: string;
//   phone: string;
//   password: string;
// }

@Table({
  tableName: 'user',
  paranoid: true,
  timestamps: true,
  freezeTableName: true,
})
export class UserModel extends Model {
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    field: 'first_name',
  })
  firstName: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'last_name' })
  lastName: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'email' })
  email: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'phone' })
  phone: string;

  @Column({ type: DataType.STRING, allowNull: false, field: 'password' })
  password: string;

  @Column({ type: DataType.STRING, allowNull: true, field: 'avatar' })
  avatar?: string;
}
