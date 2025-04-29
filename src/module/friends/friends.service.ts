import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { FriendDto } from './dto/response/friends-list-dto';
import { UserService } from 'src/module/user/user.service';
import { Friend } from './entities/friends.entity';
import { User } from 'src/module/user/entities/user.entity';

@Injectable()
export class FriendsService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendsRepository: Repository<Friend>,
    private readonly userService: UserService,
  ) {}

  // 나의 모든 친구 조회
  async getFriends(userId: number): Promise<FriendDto[]> {
    const friendships = await this.friendsRepository.find({
      where: [{ user: { id: userId } }, { friend: { id: userId } }],
    });

    return friendships.map((friendship) => {
      const friendUser =
        friendship.user.id === userId ? friendship.friend : friendship.user;
      return {
        id: friendUser.id,
        name: friendUser.name,
        email: friendUser.email,
      };
    });
  }

  // 친구 추가
  async addFriend(userId: number, friendEmail: string): Promise<Friend> {
    const user = await this.userService.findById(userId);
    const friend = await this.userService.findByEmail(friendEmail);

    if (!friend) {
      throw new NotFoundException(
        '해당 이메일을 가진 사용자를 찾을 수 없습니다.',
      );
    }

    if (userId === friend.id) {
      throw new BadRequestException('자기 자신을 친구로 추가할 수 없습니다.');
    }

    const existingFriendship = await this.friendsRepository.findOne({
      where: [
        { user: { id: userId }, friend: { id: friend.id } },
        { user: { id: friend.id }, friend: { id: userId } },
      ],
    });

    if (existingFriendship) {
      throw new BadRequestException('이미 친구 관계가 존재합니다.');
    }

    const newFriendship = this.friendsRepository.create({
      user: user as DeepPartial<User>,
      friend: friend,
    });

    return this.friendsRepository.save(newFriendship);
  }

  // 이메일로 친구 조회
  async findFriendByEmail(email: string): Promise<FriendDto> {
    const friend = await this.userService.findByEmail(email);
    if (!friend) {
      throw new NotFoundException(
        '해당 이메일을 가진 사용자를 찾을 수 없습니다.',
      );
    }

    return {
      id: friend.id,
      name: friend.name,
      email: friend.email,
    };
  }

  // 친구 삭제
  async deleteFriend(userId: number, friendEmail: string): Promise<void> {
    const friend = await this.userService.findByEmail(friendEmail);
    if (!friend) {
      throw new NotFoundException(
        '해당 이메일을 가진 사용자를 찾을 수 없습니다.',
      );
    }

    await this.friendsRepository.delete({
      user: { id: userId },
      friend: { id: friend.id },
    });
    await this.friendsRepository.delete({
      user: { id: friend.id },
      friend: { id: userId },
    });
  }
}
