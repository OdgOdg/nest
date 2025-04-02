import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from './LoginResponse';
import { UserService } from 'src/module/user/user.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/module/user/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // // 이메일 인증 코드 생성 및 캐싱 + 이메일 전송
  // async sendVerificationEmail(email: string): Promise<void> {
  //   // const { isTecheer } = await this.getProfileImageUrl(email);
  //   // if (!isTecheer) {
  //   //   this.logger.error('테커 회원이 아닙니다.', AuthService.name);
  //   //   throw new NotFoundTecheerException();
  //   // }

  //   const verificationCode = Math.floor(
  //     100000 + Math.random() * 900000,
  //   ).toString(); // 6자리 인증 코드 생성
  //   console.log('인증 코드:', verificationCode);

  //   // Redis에 이메일-코드 매핑 저장, TTL 5분 (300초)
  //   try {
  //     await this.redisClient.set(email, verificationCode, 'EX', 300);
  //   } catch (error) {
  //     this.logger.error('Redis 저장 실패', AuthService.name);
  //     throw new InternalServerErrorException();
  //   }

  //   const subject = '이메일 인증 코드';
  //   const htmlContent = `
  //         <!DOCTYPE html>
  //         <html lang="ko">
  //         <head>
  //             <meta charset="UTF-8">
  //             <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //             <style>
  //                 body {
  //                     font-family: 'Arial', sans-serif;
  //                     background-color: #FE9142;
  //                     padding: 20px;
  //                 }
  //                 .email-container {
  //                     max-width: 600px;
  //                     background-color: #ffffff;
  //                     border-radius: 8px;
  //                     margin: 0 auto;
  //                     padding: 20px;
  //                     box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  //                     text-align: center;
  //                 }
  //                 .email-header {
  //                     font-size: 24px;
  //                     font-weight: bold;
  //                     color: #333333;
  //                     margin-bottom: 20px;
  //                 }
  //                 .email-body {
  //                     font-size: 16px;
  //                     color: #555555;
  //                     line-height: 1.6;
  //                 }
  //                 .verification-code-container {
  //                     background-color: #FE9142;
  //                     color: #ffffff;
  //                     font-size: 24px;
  //                     font-weight: bold;
  //                     padding: 15px 0;
  //                     border-radius: 8px;
  //                     margin: 20px 0;
  //                     width: 50%;
  //                     margin-left: auto;
  //                     margin-right: auto;
  //                 }
  //                 .footer {
  //                     font-size: 12px;
  //                     color: #888888;
  //                     margin-top: 20px;
  //                 }
  //             </style>
  //         </head>
  //         <body>
  //             <div class="email-container">
  //                 <div class="email-header">테커집 인증 코드</div>
  //                 <div class="email-body">
  //                     아래의 인증 코드를 사용하여 이메일 인증을 완료하세요.<br>
  //                     <div class="verification-code-container">
  //                         ${verificationCode}
  //                     </div>
  //                     인증 코드는 <strong>5분간 유효</strong>합니다.
  //                 </div>
  //                 <div class="footer">
  //                     본 메일은 테커 회원 인증을 위해 발송된 이메일입니다.<br>
  //                     이메일 인증에 문제가 있다면, 관리자에게 문의주세요.
  //                 </div>
  //             </div>
  //         </body>
  //         </html>
  //     `;
  //   // 이메일 전송
  //   try {
  //     await this.transporter.sendMail({
  //       from: this.configService.get<string>('EMAIL_FROM_EMAIL'),
  //       to: email,
  //       subject: subject,
  //       html: htmlContent,
  //     });
  //     this.logger.debug('이메일 전송 완료', AuthService.name);
  //   } catch (error) {
  //     this.logger.error('이메일 전송 실패', AuthService.name);
  //     throw new InternalServerErrorException();
  //   }
  // }

  // 로그인
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new UnprocessableEntityException('사용자를 찾을 수 없습니다.');
    }

    // 액세스 토큰과 리프레시 토큰 생성
    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
        expiresIn: '60m',
      },
    );
    const refreshToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: process.env.REFRESH_TOKEN_SECRET_KEY,
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

  // 로그인 유저 확인(이메일, 비밀번호)
  async validateUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnprocessableEntityException('이메일이 없습니다.');
    }
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) {
      throw new UnprocessableEntityException('비밀번호가 일치하지 않습니다.');
    }
    return user;
  }

  // 비밀번호 변경
  async changePassword(
    userId: number,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    // 사용자 조회
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnprocessableEntityException('사용자를 찾을 수 없습니다.');
    }

    // 현재 비밀번호와 입력한 비밀번호 비교 확인
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new UnprocessableEntityException(
        '현재 비밀번호가 일치하지 않습니다.',
      );
    }

    // 새로운 비밀번호 해시화
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 비밀번호 업데이트
    user.password = hashedNewPassword;
    await this.userService.updatePassword(user.id, hashedNewPassword);
  }
}
