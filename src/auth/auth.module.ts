import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    JwtModule.register({}), //
    TypeOrmModule.forFeature([User]), //유저 관련 DB 엑세스에 필요
  ],
  controllers: [AuthController],
  providers: [AuthService, UserService],
})
export class AuthModule {}
