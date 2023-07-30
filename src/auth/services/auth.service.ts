import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Transaction } from 'sequelize/types';
import { LoginDto, RegisterDto } from '../../auth/dto';
import { ILoginOutputModel } from '../../auth/interfaces';
import { UserModel } from '../../users/models/user.model';
import { UserService } from '../../users/services/user.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService implements OnModuleInit {
  private userService: UserService;
  private tokenService: TokenService;

  constructor(private moduleRef: ModuleRef, private jwtService: JwtService) {}

  onModuleInit() {
    this.userService = this.moduleRef.get(UserService, {
      strict: false,
    });
    this.tokenService = this.moduleRef.get(TokenService, {
      strict: false,
    });
  }

  async userTransaction(): Promise<Transaction> {
    return this.userService.transaction();
  }

  async register(
    conditions: RegisterDto,
    transaction: Transaction,
  ): Promise<UserModel> {
    const { email, password } = conditions;

    const exitsEmail = await this.userService.findOne({ where: { email } });
    if (exitsEmail) throw new Error('EMAIL_REGISTERED');

    // hash password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await this.userService.create(
      {
        ...conditions,
        password: hashedPassword,
      },
      { transaction },
    );

    return user;
  }

  async login(conditions: LoginDto): Promise<ILoginOutputModel> {
    const { email, password } = conditions;

    const user = await this.verifyLoginCredentials(email, password);

    const [accessToken, refreshToken] = await this.tokenService.generateToken(
      user,
    );

    return {
      profile: user,
      accessToken,
      refreshToken,
    };
  }

  private async verifyLoginCredentials(
    email: string,
    password: string,
  ): Promise<UserModel> {
    const userData = await this.userService.findOne({ where: { email } });

    if (!userData) {
      throw new Error('WRONG_CREDENTIALS');
    }

    const isPasswordMatching = await bcrypt.compare(
      password,
      userData.password,
    );

    if (!isPasswordMatching) {
      throw new Error('WRONG_CREDENTIALS');
    }

    delete userData.password;
    return userData;
  }

  async getMe(userId: string): Promise<UserModel | null> {
    if (!userId) return null;

    const user = await this.userService.findOne({ where: { id: userId } });
    delete user.password;
    return user;
  }
}
