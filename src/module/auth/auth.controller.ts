import {
  Body,
  Controller,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginUserDto } from './LoginUserDto';
import { ChangePasswordDto } from './ChangePasswordDto';
import { JwtAuthGuard } from './jwt.JwtAuthGuard';

interface UserProps {
  id: number;
}

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
  @Post('logout')
  @ApiOperation({
    summary: '로그아웃 API',
    description:
      '로그아웃 시, access token과 refresh token을 쿠키에서 삭제합니다.',
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 401, description: '로그아웃 실패' })
  logout(@Res({ passthrough: true }) response: Response) {
    // 쿠키에서 access_token과 refresh_token 제거
    response.clearCookie('access_token', {
      httpOnly: true,
      path: '/',
    });
    response.clearCookie('refresh_token', {
      httpOnly: true,
      path: '/',
    });

    return {
      message: '로그아웃 성공',
    };
  }
  @Patch('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '비밀번호 변경 API',
    description:
      '현재 비밀번호와 새로운 비밀번호를 입력하면 비밀번호를 변경합니다.',
  })
  @ApiResponse({ status: 200, description: '성공' })
  @ApiResponse({ status: 400, description: '비밀번호 변경 실패' })
  async changePassword(
    @Req() req: Request,
    @Body() ChangePasswordDto: ChangePasswordDto,
  ) {
    const { currentPassword, newPassword } = ChangePasswordDto;
    // console.log('asas:  ', req.user);
    const userId = (req.user as UserProps)?.id;
    console.log(userId);

    await this.authService.changePassword(userId, currentPassword, newPassword);
    return { message: '비밀번호가 성공적으로 변경되었습니다.' };
  }
}
