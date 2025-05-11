import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { SightsModule } from '../sights/sights.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt.JwtAuthGuard';

@Module({
  imports: [
    UserModule,
    forwardRef(() => SightsModule),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: { expiresIn: '60m' }, // 액세스 토큰 만료 시간
    }),
    TypeOrmModule.forFeature([Review]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
  ],
  controllers: [ReviewController],
  providers: [ReviewService, JwtAuthGuard],
  exports: [TypeOrmModule, ReviewService],
})
export class ReviewModule {}
