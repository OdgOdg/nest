import {
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import * as multer from 'multer';
import { SightsService } from './sights.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery } from '@nestjs/swagger';

@Controller('sights')
export class SightsController {
  constructor(private readonly sightsService: SightsService) {}

  // 데이터 파일 업로드 (dev)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file', { storage: multer.memoryStorage() }))
  @ApiOperation({ summary: 'CSV 파일 업로드 (dev)' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'CSV 파일을 업로드합니다.',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadCsv(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      return { message: '파일이 없습니다. CSV 파일을 업로드하세요.' };
    }
    return this.sightsService.processCsv(file);
  }

  //커서 기반 무한스크롤 관광지 및 행사 조회
  @Get('pagination')
  @ApiOperation({ summary: '커서 기반 무한스크롤 관광지 및 행사 조회' })
  @ApiQuery({
    name: 'cursor',
    required: false,
    description: '이전 페이지의 마지막 ID',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: '한 번에 불러올 개수 (기본값 10)',
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: '카테고리 번호 (1 또는 2)',
  })
  async getPaginatedCsvData(
    @Query('cursor') cursor?: string,
    @Query('limit') limit?: string,
    @Query('category') category?: string,
  ) {
    const cursorNumber = cursor ? parseInt(cursor, 10) : undefined;
    const limitNumber = limit ? parseInt(limit, 10) : 10;
    const categoryNumber = category ? parseInt(category, 10) : undefined;

    const { data, hasNext } = await this.sightsService.getPaginatedCsvData(
      cursorNumber,
      limitNumber,
      categoryNumber,
    );

    return {
      data,
      hasNext,
    };
  }

  // 특정 관광지 및 행사 정보들 조회
  @Get('title/:title')
  @ApiOperation({ summary: '검색을 통한 관광지 및 행사 조회' })
  async getSightsDataByTitle(@Param('title') title: string) {
    return this.sightsService.getSightsDataByTitle(title);
  }

  // 특정 관광지 및 행사 정보들 조회 (지도)
  @Get('map')
  @ApiQuery({ name: 'minLat', type: 'number', example: 37.3573 })
  @ApiQuery({ name: 'maxLat', type: 'number', example: 37.3933 })
  @ApiQuery({ name: 'minLng', type: 'number', example: 126.6098 })
  @ApiQuery({ name: 'maxLng', type: 'number', example: 126.6558 })
  @ApiQuery({
    name: 'keyword',
    type: 'string',
    required: false,
    example: '송도',
  })
  @ApiOperation({
    summary: '현재 영역에서 관광지 및 행사 조회 (최대 50개)',
  })
  async getSightsByMapBounds(
    @Query('minLat') minLat: string,
    @Query('maxLat') maxLat: string,
    @Query('minLng') minLng: string,
    @Query('maxLng') maxLng: string,
    @Query('keyword') keyword?: string,
  ) {
    const minLatitude = parseFloat(minLat);
    const maxLatitude = parseFloat(maxLat);
    const minLongitude = parseFloat(minLng);
    const maxLongitude = parseFloat(maxLng);

    return this.sightsService.getSightsByMapBounds(
      minLatitude,
      maxLatitude,
      minLongitude,
      maxLongitude,
      keyword,
    );
  }

  // 특정 관광지 및 행사 정보들 조회 (지도)
  @Get('/:id')
  @ApiOperation({ summary: '특정 관광지 및 행사 상세 조회' })
  async getSightsDateById(@Param('id') id: string) {
    return this.sightsService.getSightsDateById(Number(id));
  }
}
