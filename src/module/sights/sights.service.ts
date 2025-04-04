/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Like, Repository } from 'typeorm';
import * as csv from 'fast-csv';
import { SightsData } from './entities/sights-data.entity';

@Injectable()
export class SightsService {
  constructor(
    @InjectRepository(SightsData)
    private readonly sightsRepository: Repository<SightsData>,
  ) {}

  async processCsv(file: Express.Multer.File): Promise<{ message: string }> {
    return new Promise((resolve, reject) => {
      const records: SightsData[] = [];

      csv
        .parseString(file.buffer.toString(), { headers: true })
        .on('data', (row) => {
          records.push({
            id: parseInt(row.id, 10),
            addr1: row.addr1 || null,
            addr2: row.addr2 || null,
            dist: row.dist ? parseFloat(row.dist) : null,
            firstimage: row.firstimage || null,
            firstimage2: row.firstimage2 || null,
            mapx: row.mapx ? parseFloat(row.mapx) : null,
            mapy: row.mapy ? parseFloat(row.mapy) : null,
            tel: row.tel || null,
            title: row.title || null,
          });
        })
        .on('end', async () => {
          if (records.length === 0) {
            return reject(new Error('CSV 파일이 비어 있습니다.'));
          }
          try {
            await this.sightsRepository.save(records);
            resolve({ message: 'CSV data successfully saved!' });
          } catch (error) {
            reject(error as Error);
          }
        })
        .on('error', (error) => reject(error as Error));
    });
  }

  // 커서 기반 페이지네이션 관광지 조회
  async getPaginatedCsvData(cursor?: number, limit: number = 10) {
    const query = this.sightsRepository
      .createQueryBuilder('csv')
      .orderBy('csv.id', 'ASC') // 오름차순 정렬
      .limit(limit + 1); // 다음 페이지 확인

    if (cursor) {
      query.where('csv.id > :cursor', { cursor });
    }

    const results = await query.getMany();

    // 조회된 데이터 수가 limit + 1보다 작으면 다음 페이지 없음. (false)
    const hasNext = results.length > limit;

    return {
      data: hasNext ? results.slice(0, limit) : results,
      hasNext,
    };
  }

  // 모든 관광지 정보 조회
  async getAllSightsData(): Promise<SightsData[]> {
    return this.sightsRepository.find();
  }

  // 특정 관광지 정보들 조회
  async getSightsDataByTitle(title: string): Promise<SightsData[]> {
    return this.sightsRepository.find({
      where: { title: Like(`%${title}%`) },
    });
  }

  // 특정 관광지 정보들 조회 (지도 범위 + 키워드 검색 추가)
  async getSightsByMapBounds(
    minLat: number,
    maxLat: number,
    minLng: number,
    maxLng: number,
    keyword?: string,
  ): Promise<SightsData[]> {
    const whereCondition: any = {
      mapy: Between(minLat, maxLat),
      mapx: Between(minLng, maxLng),
    };

    if (keyword) {
      whereCondition.title = Like(`%${keyword}%`);
    }

    return this.sightsRepository.find({
      where: whereCondition,
      take: 50, // 최대 50개 제한
    });
  }
}
