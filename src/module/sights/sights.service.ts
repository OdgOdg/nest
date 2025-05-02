import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import * as csv from 'fast-csv';
import { SightsData } from './entities/sights-data.entity';
import { Like as LikeEntity } from '../like/entities/like.entity';

@Injectable()
export class SightsService {
  constructor(
    @InjectRepository(SightsData)
    private readonly sightsRepository: Repository<SightsData>,
    @InjectRepository(LikeEntity)
    private likeRepository: Repository<LikeEntity>,
  ) {}
  private async sightsWithLikeCount(sights: SightsData[]): Promise<any[]> {
    return Promise.all(
      sights.map(async (sight) => {
        const likeCount = await this.likeRepository.count({
          where: { sightId: sight.id, isLiked: true },
        });
        return { ...sight, likeCount };
      }),
    );
  }

  async processCsv(file: Express.Multer.File): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      const records: SightsData[] = [];

      csv
        .parseString(file.buffer.toString(), { headers: true })
        .on('data', (row: SightsData) => {
          records.push({
            id: row.id,
            title: row.title || null,
            addr1: row.addr1 || null,
            addr2: row.addr2 || null,
            dist: row.dist || null,
            firstimage: row.firstimage || null,
            firstimage2: row.firstimage2 || null,
            mapx: row.mapx || null,
            mapy: row.mapy || null,
            category: row.category || null,
            startDate: row.startDate || null,
            endDate: row.endDate || null,
          });
        })
        .on('end', () => {
          if (records.length === 0) {
            return reject(new Error('CSV 파일이 비어 있습니다.'));
          }
          this.sightsRepository
            .save(records)
            .then(() => resolve({ message: 'CSV data successfully saved!' }))
            .catch((error) => reject(error as Error));
        })
        .on('error', (error) => reject(error));
    });
  }

  // 커서 기반 페이지네이션 관광지 조회
  async getPaginatedCsvData(
    cursor?: number,
    limit: number = 10,
    category?: number,
  ) {
    const query = this.sightsRepository
      .createQueryBuilder('csv')
      .orderBy('csv.id', 'ASC')
      .limit(limit + 1);

    if (cursor !== undefined) {
      query.andWhere('csv.id > :cursor', { cursor });
    }

    if (category !== undefined) {
      query.andWhere('csv.category = :category', { category });
    }

    const results = await query.getMany();
    const hasNext = results.length > limit;
    const slicedResults = hasNext ? results.slice(0, limit) : results;
    const resultsWithLikeCount = await this.sightsWithLikeCount(slicedResults);
    return {
      data: resultsWithLikeCount,
      hasNext,
    };
  }

  // 모든 관광지 정보 조회
  async getAllSightsData(): Promise<SightsData[]> {
    return this.sightsRepository.find();
  }

  // 제목 기반 관광지 검색
  async getSightsDataByTitle(title: string): Promise<any[]> {
    const sights = await this.sightsRepository.find({
      where: { title: Like(`%${title}%`) },
    });
    return this.sightsWithLikeCount(sights);
  }

  // 지도 범위 + 키워드 기반 관광지 조회
  async getSightsByMapBounds(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
    keyword?: string,
  ): Promise<any[]> {
    const whereCondition: Record<string, any> = {
      mapy: Between(minLat, maxLat),
      mapx: Between(minLng, maxLng),
    };

    if (keyword) {
      whereCondition.title = Like(`%${keyword}%`);
    }

    const sights = await this.sightsRepository.find({
      where: whereCondition,
      take: 50,
    });

    return this.sightsWithLikeCount(sights);
  }

  // 특정 관광지 및 행사 정보 조회
  async getSightsDateById(
    id: number,
  ): Promise<SightsData & { likeCount: number }> {
    const sight = await this.sightsRepository.findOne({ where: { id } });

    if (!sight) return null;

    const likeCount = await this.likeRepository.count({
      where: { sightId: id, isLiked: true },
    });

    return {
      ...sight,
      likeCount,
    };
  }
}
