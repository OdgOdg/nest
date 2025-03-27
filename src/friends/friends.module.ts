import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friends.entity';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserModule } from 'src/user/user.module';
import { JwtAuthGuard } from 'src/auth/jwt.JwtAuthGuard';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '60m' }, // 액세스 토큰 만료 시간
    }),
    TypeOrmModule.forFeature([Friend]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [FriendsController],
  providers: [FriendsService, JwtAuthGuard],
})
export class FriendsModule {}
