import {
  Body,
  Controller,
  Post,
  UnprocessableEntityException,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './LoginUserDto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @ApiOperation({
    summary: '로그인 API',
    description: '이메일과 비밀번호를 입력하면 JWT를 반환합니다.',
  })
  @ApiBody({ type: LoginUserDto }) // Swagger에서 Body를 자동으로 인식하도록 설정
  @ApiResponse({ status: 200, description: '성공', type: String })
  @ApiResponse({ status: 422, description: '이메일 또는 비밀번호 오류' })
  async login(@Body() input: LoginUserDto, @Res() res: Response) {
    const { email, password } = input;

    // 1. 이메일, 비밀번호 일치 유저 찾기
    const user = await this.userService.findOne(email);

    // 2. 일치하는 유저 없으면 에러
    if (!user) {
      throw new UnprocessableEntityException('이메일이 없습니다.');
    }

    // 3. 비밀번호 검증
    const isAuth = await bcrypt.compare(password, user.password);
    console.log('Stored hashed password:', user.password); // 저장된 해시 비밀번호 출력
    console.log('Entered password:', password); // 입력된 비밀번호 출력
    console.log('Is password correct:', isAuth); // 결과 확인
    if (!isAuth) {
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    }

    // 4. Refresh Token 쿠키에 저장
    this.authService.setRefreshToken({ user, res });

    // 5. Access Token 반환
    const jwt = this.authService.getAccessToken({ user });
    return res.status(200).json({ accessToken: jwt });
  }
}
