import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtPayload } from './JwtPayload';
import { JwtService } from '@nestjs/jwt';
import { AuthRequest } from './auth.interface';

@Injectable()
export class JwtAuthGuard {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthRequest>();

    const cookies = request.headers.cookie || '';
    const token = this.getCookieValue(cookies, 'access_token');

    if (!token) {
      throw new UnauthorizedException('Access token이 없습니다.');
    }

    try {
      const decoded: JwtPayload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      });

      request.user = decoded;
      console.log('aaaaaa  ', request.user);
      return Promise.resolve(true);
    } catch (error) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }
  }

  private getCookieValue(cookies: string, cookieName: string): string | null {
    const match = cookies
      .split('; ')
      .find((cookie) => cookie.startsWith(`${cookieName}=`));

    return match ? match.split('=')[1] : null;
  }
}
