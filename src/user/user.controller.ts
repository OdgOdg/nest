import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  ParseIntPipe,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';

@Controller('user')
export class UserController {
  PASSWORD_SALT = 10;
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() input: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(
      input.password,
      this.PASSWORD_SALT,
    );
    const user = {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    };
    return this.userService.create(user);
  }

  @Get(':id')
  async getUserById(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    // 비밀번호를 제외한 객체 반환
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
  @Delete(':id')
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException('유저를 찾을 수 없습니다.');
    }

    await this.userService.deleteUser(id);
    return { message: '회원 탈퇴가 완료되었습니다.' };
  }
}
