import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  ParseIntPipe,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import { User } from './user.entity';
import { omit } from 'lodash';
import { ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/module/auth/jwt.JwtAuthGuard';
import { GetUser } from 'src/module/auth/get-user.decorator';

@Controller('user')
export class UserController {
  PASSWORD_SALT = 10;
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({
    summary: '회원가입',
    description: '이름, 이메일, 비밀번호를 입력하면 계정이 생성됩니다.',
  })
  async createUser(@Body() input: CreateUserDto): Promise<User> {
    return this.userService.create(input);
  }

  @Get(':id')
  @ApiOperation({
    summary: '개별 유저 조희',
    description: '사용자 ID를 입력하면 해당 사용자 정보를 반환합니다.',
  })
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }
    // 비밀번호를 제외한 객체 반환
    return omit(user, ['password']);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '회원탈퇴',
    description: '해당 사용자 정보를 반환합니다.',
  })
  async deleteUser(@GetUser() req: User) {
    const user = await this.userService.findById(req.id);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    await this.userService.deleteUser(req.id);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
