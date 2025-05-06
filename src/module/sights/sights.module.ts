import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SightsController } from './sights.controller';
import { SightsService } from './sights.service';
import { SightsData } from './entities/sights-data.entity';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SightsData]),
    forwardRef(() => LikeModule),
  ],
  controllers: [SightsController],
  providers: [SightsService],
  exports: [TypeOrmModule],
})
export class SightsModule {}
