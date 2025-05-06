import { Controller, Post, Get, Body, UseGuards } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeDto } from './dto/request/like.dto';
import { ApiOperation } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { JwtAuthGuard } from '../auth/jwt.JwtAuthGuard';
import { GetUser } from '../auth/get-user.decorator';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post()
  @ApiOperation({
    summary: '좋아요 처리',
    description: '좋아요를 추가하거나 제거합니다.',
  })
  @UseGuards(JwtAuthGuard)
  async like(@GetUser() req: User, @Body() likeDto: LikeDto) {
    const message = await this.likeService.toggleLike(likeDto, req.id);
    return { message };
  }

  @Get()
  @ApiOperation({
    summary: '좋아요한 관광지 및 행사 ID 목록 조회',
    description: '특정 사용자가 좋아요한 관광지 및 행사 ID 목록을 조회합니다.',
  })
  @UseGuards(JwtAuthGuard)
  async getLikedSightIds(@GetUser() req: User) {
    const likedSightIds = await this.likeService.getLikedSightIds(req.id);
    return likedSightIds;
  }
}
