import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDateString, IsOptional, IsBoolean } from 'class-validator';

export class CreateEventDto {
  @ApiProperty({ example: '썬더치킨 정모', description: 'Event title' })
  @IsString()
  title: string;

  @ApiProperty({
    example: '2025-03-09T09:00:00Z',
    description: 'Event startDate',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2025-03-10T09:00:00Z',
    description: 'Event endDate',
  })
  @IsDateString()
  endDate: string;

  @ApiProperty({ example: '메모', description: 'Event memo' })
  @IsOptional() // 필수X
  @IsString()
  memo?: string;

  @ApiProperty({
    example: false,
    description: 'Is the event all-day (true) or specific time (false)',
  })
  @IsBoolean()
  isAllday: boolean;

  @ApiProperty({
    example: false,
    description: 'Is the event from user data (false) or public data (true)',
  })
  @IsBoolean()
  isOrigin: boolean;
}
