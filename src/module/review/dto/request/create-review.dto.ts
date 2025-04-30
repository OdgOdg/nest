import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({ example: '100', description: 'Review Sight Id' })
  @IsNotEmpty()
  sightId: number;

  @ApiProperty({ example: '내용', description: 'Review content' })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiProperty({ example: '[1, 3, 5]', description: '선택된 장점 ID 목록' })
  @IsArray()
  @IsNumber({}, { each: true })
  advantages: number[];
}
