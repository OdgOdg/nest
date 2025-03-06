import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './LoginUserDto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({
    summary: '로그인 API',
    description: '이메일과 비밀번호를 입력하면 JWT를 반환합니다.',
  })
  @ApiBody({ type: LoginUserDto })
  @ApiResponse({ status: 200, description: '성공', type: String })
  @ApiResponse({ status: 422, description: '이메일 또는 비밀번호 오류' })
  async login(
    @Body() input: LoginUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const {
      data: { accessToken, refreshToken },
    } = await this.authService.login(input.email, input.password);
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 1000, // 1시간
      // secure: true, // HTTPS 환경에서 사용
    });
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
      // secure: true, // HTTPS 환경에서 사용
    });
    return {
      accessToken,
      refreshToken,
    };
  }
}
