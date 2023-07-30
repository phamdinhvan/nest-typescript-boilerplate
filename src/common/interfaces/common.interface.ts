import { Request } from 'express';
import { UserModel } from '../../users/models/user.model';

export interface IRequestOptions extends Request {
  user: UserModel;
}
