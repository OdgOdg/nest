import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LikeDto {
  userId: number;

  @ApiProperty({ example: 1, description: 'Sight ID' })
  @IsNotEmpty()
  sightId: number;

  @ApiProperty({ example: true, description: 'Is Liked' })
  @IsNotEmpty()
  isLiked: boolean;
}
