import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { Review } from './entities/review.entity';
import { SightsModule } from '../sights/sights.module';

@Module({
  imports: [TypeOrmModule.forFeature([Review]), forwardRef(() => SightsModule)],
  controllers: [ReviewController],
  providers: [ReviewService],
  exports: [TypeOrmModule, ReviewService],
})
export class ReviewModule {}
