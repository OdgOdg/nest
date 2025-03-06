import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { JwtPayload } from './JwtPayload';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // JWT를 Authorization 헤더에서 추출
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    // payload에서 ID를 추출하여 사용자를 가져옵니다.
    const user = await this.userService.findById(payload.id);
    if (!user) {
      throw new Error('User not found');
    }
    return user; // 인증된 사용자 정보를 반환
  }
}
