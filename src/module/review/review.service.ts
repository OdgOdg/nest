import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/request/create-review.dto';
import { REVIEW_ADVANTAGES } from './config/review.config';
import { ReviewResponseDto } from './dto/response/review-response.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(userId: number, dto: CreateReviewDto): Promise<Review> {
    const review = this.reviewRepository.create({
      userId: userId,
      ...dto,
    });

    return this.reviewRepository.save(review);
  }

  async getReviews(sightId: number): Promise<ReviewResponseDto[]> {
    const reviews = await this.reviewRepository.find({
      where: { sightId },
      order: { date: 'DESC' },
    });

    return Promise.all(
      reviews.map(async (review) => {
        const user = await this.userRepository.findOne({
          where: { id: review.userId },
        });
        return {
          id: review.id,
          userId: review.userId,
          userName: user.name,
          sightId: review.sightId,
          content: review.content,
          date: review.date.toISOString().split('T')[0], // 'YYYY-MM-DD' 형식
          advantages: review.advantages.map((id) => REVIEW_ADVANTAGES[id]),
        };
      }),
    );
  }
}
