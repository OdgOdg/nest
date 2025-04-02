import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/module/user/user.entity';
import { AuthService } from './auth.service';
import { UserService } from 'src/module/user/user.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.JwtAuthGuard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '60m' }, // 액세스 토큰 만료 시간
    }),
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService, JwtAuthGuard],
})
export class AuthModule {}
