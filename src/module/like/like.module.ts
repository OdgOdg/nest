import { forwardRef, Module } from '@nestjs/common';
import { Like } from './entities/like.entity';
import { LikeService } from './like.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LikeController } from './like.controller';
import { JwtAuthGuard } from '../auth/jwt.JwtAuthGuard';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SightsModule } from '../sights/sights.module';
import { SightsData } from '../sights/entities/sights-data.entity';

@Module({
  imports: [
    UserModule,
    forwardRef(() => SightsModule),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '60m' }, // 액세스 토큰 만료 시간
    }),
    TypeOrmModule.forFeature([Like, SightsData]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [LikeController],
  providers: [LikeService, JwtAuthGuard],
  exports: [TypeOrmModule, LikeService],
})
export class LikeModule {}
