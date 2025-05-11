import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { ReviewResponseDto } from './dto/response/review-response.dto';
import { JwtAuthGuard } from '../auth/jwt.JwtAuthGuard';
import { User } from '../user/entities/user.entity';
import { GetUser } from '../auth/get-user.decorator';

@Controller('review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @ApiOperation({
    summary: '리뷰 생성',
    description: '이벤트의 내용을 입력하여 새로운 리뷰를 생성합니다.',
  })
  @UseGuards(JwtAuthGuard)
  async createReview(
    @GetUser() req: User,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    await this.reviewService.create(req.id, createReviewDto);
    return { message: '리뷰 생성 성공' };
  }

  @Get(':sightId')
  @ApiOperation({
    summary: 'Sight 리뷰 조회',
    description: '해당 Sight의 리뷰를 조회합니다.',
  })
  @UseGuards(JwtAuthGuard)
  async getReviews(
    @Param('sightId') sightId: number,
  ): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewService.getReviews(sightId);
    return reviews;
  }
}
