import { UserModel } from '../../users/models/user.model';

export interface ILoginOutputModel {
  profile: UserModel;
  accessToken: string;
  refreshToken: string;
}

export interface IAuthPayloadInputModel {
  sub: string;
  userId: string;
}

export interface IAuthPayloadOutputModel {
  sub: string;
  userId: string;
  iat: number;
  exp: number;
}

export interface IVerifyRefeshTokenOutputModel {
  profile: UserModel;
}
