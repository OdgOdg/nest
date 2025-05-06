import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Like } from './entities/like.entity';
import { LikeDto } from './dto/request/like.dto';
import { SightsData } from '../sights/entities/sights-data.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    @InjectRepository(SightsData)
    private readonly sightsRepository: Repository<SightsData>,
  ) {}
  private async sightsWithLikeCount(
    sights: SightsData[],
  ): Promise<SightsData[]> {
    return Promise.all(
      sights.map(async (sight) => {
        const likeCount = await this.likeRepository.count({
          where: { sightId: sight.id, isLiked: true },
        });
        return { ...sight, likeCount };
      }),
    );
  }
  async toggleLike(dto: LikeDto, userId: number): Promise<string> {
    const messageAdd = '좋아요가 등록되었습니다.';
    const messageRemove = '좋아요가 해제되었습니다.';
    const existing = await this.likeRepository.findOneBy({
      sightId: dto.sightId,
      userId: userId,
    });

    if (!existing) {
      if (dto.isLiked === false) {
        throw new BadRequestException('좋아요가 존재하지 않습니다.');
      }

      const newLike = this.likeRepository.create({
        sightId: dto.sightId,
        userId: userId,
        isLiked: true,
      });
      await this.likeRepository.save(newLike);
      return messageAdd;
    }

    if (existing.isLiked === dto.isLiked) {
      throw new BadRequestException('이미 처리된 좋아요입니다.');
    }

    if (existing.isLiked === false && dto.isLiked === true) {
      existing.isLiked = true;
      await this.likeRepository.save(existing);
      return messageAdd;
    } else if (existing.isLiked === true && dto.isLiked === false) {
      await this.likeRepository.delete(existing.id);
      return messageRemove;
    }
  }

  async getLikedSightIds(userId: number): Promise<SightsData[]> {
    const likes = await this.likeRepository.find({
      where: { userId, isLiked: true },
    });
    const sightIds = likes.map((like) => like.sightId);
    if (sightIds.length === 0) {
      return [];
    }
    const sights = await this.sightsRepository.find({
      where: {
        id: In(sightIds), // IN 조건으로 다건 조회
      },
    });
    return this.sightsWithLikeCount(sights);
  }
}
