import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateIntroduceDto {
  @ApiProperty({ description: 'User introduction', required: false })
  @IsOptional()
  @IsString()
  introduce?: string;
}
