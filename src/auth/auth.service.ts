import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './LoginResponse';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnprocessableEntityException('사용자를 찾을 수 없습니다.');
    }

    // 액세스 토큰과 리프레시 토큰 생성
    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY, // 환경 변수에서 비밀 키 가져오기
        expiresIn: '60m',
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY, // 환경 변수에서 비밀 키 가져오기
        expiresIn: '7d',
      },
    );

    return {
      data: {
        accessToken,
        refreshToken,
      },
    };
  }

  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOne(email);
    if (!user) {
      throw new UnprocessableEntityException('이메일이 없습니다.');
    }
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    }
    return user;
  }
}
