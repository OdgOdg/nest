import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY, // 비밀 키 설정
      signOptions: { expiresIn: '60m' }, // 액세스 토큰 만료 시간 설정
    }),
    TypeOrmModule.forFeature([User]), // 유저 DB 엑세스
    PassportModule.register({ defaultStrategy: 'jwt' }), // 'jwt' 전략 기본으로 설정
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtStrategy], // JwtStrategy 추가
})
export class AuthModule {}
