import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { REVIEW_ADVANTAGES } from './config/review.config';
import { ReviewResponseDto } from './dto/response/review-response.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) {}

  async create(dto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      ...dto,
      advantages: dto.advantages,
    });

    return this.reviewRepository.save(review);
  }

  async getReviews(sightId: number): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { sightId },
      order: { date: 'DESC' },
    });

    return reviews.map((review) => ({
      id: review.id,
      sightId: review.sightId,
      content: review.content,
      date: review.date.toISOString().split('T')[0], // 'YYYY-MM-DD' 형식
      advantages: review.advantages.map((id) => REVIEW_ADVANTAGES[id]),
    }));
  }
}
