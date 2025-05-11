import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { FriendsService } from './friends.service';
import { AddFriendDto } from './dto/request/add-friend.dto';
import { FriendDto } from './dto/response/friends-list-dto';
import { FindFriendByEmailDto } from './dto/request/find-friend-by-email.dto';

import { User } from 'src/module/user/entities/user.entity';
import { GetUser } from 'src/module/auth/get-user.decorator';
import { JwtAuthGuard } from '../auth/jwt.JwtAuthGuard';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  // 이메일로 친구 조회
  @Get('email')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '단일 친구 조회',
    description: '친구를 조회하여 반환합니다.',
  })
  async findFriendByEmail(
    @Query() friendDto: FindFriendByEmailDto,
  ): Promise<FriendDto> {
    return this.friendsService.findFriendByEmail(friendDto.email);
  }

  // 나의 모든 친구 조회
  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '나의 모든 친구 조회',
    description: '나의 모든 친구를 조회하여 반환합니다.',
  })
  async getFriends(@GetUser() req: User): Promise<FriendDto[]> {
    return this.friendsService.getFriends(req.id);
  }

  // 친구 추가
  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '친구 추가',
    description: '친구를 추가합니다.',
  })
  async addFriend(
    @GetUser() req: User,
    @Body() addFriendDto: AddFriendDto,
  ): Promise<{ message: string }> {
    await this.friendsService.addFriend(req.id, addFriendDto.friendEmail);
    return {
      message: '친구 추가 하였습니다.',
    };
  }

  // 친구 삭제
  @Delete('delete')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '친구 삭제',
    description: '친구를 삭제합니다.',
  })
  async deleteFriend(
    @GetUser() req: User,
    @Body() addFriendDto: AddFriendDto,
  ): Promise<{ message: string }> {
    await this.friendsService.deleteFriend(req.id, addFriendDto.friendEmail);
    return {
      message: '친구 삭제 하였습니다.',
    };
  }
}
