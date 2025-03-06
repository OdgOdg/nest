import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  // 유저 회원가입
  async create(input: CreateUserDto): Promise<User> {
    const { password, email, name } = input;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    // 새 사용자 객체 생성
    const signUser = new User();
    signUser.email = email;
    signUser.name = name;
    signUser.password = hashedPassword;
    // 사용자 저장
    await this.userRepository.save(signUser);
    return signUser;
  }
  // 이메일 조회
  async findOne(email: string): Promise<User | null> {
    return await this.userRepository.findOne({ where: { email } });
  }
  // id 조회
  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
  // 회원 탈퇴
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
