import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  // 유저 회원가입
  async create(input: CreateUserDto): Promise<User> {
    const { password, email, name } = input;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new ConflictException('이미 등록된 이메일입니다.');
    }
    const isVerified = await this.authService.checkIfVerified(email);
    if (!isVerified) {
      throw new ConflictException('이메일 인증이 필요합니다.');
    }
    // 비밀번호 해싱
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const signUser = new User();
    signUser.email = email;
    signUser.name = name;
    signUser.password = hashedPassword;

    // 새로운 사용자 저장
    await this.userRepository.save(signUser);
    return signUser;
  }
  // 이메일 조회
  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }
  // id 조회
  async findById(id: number): Promise<User | null> {
    return await this.userRepository.findOne({ where: { id } });
  }
  // 회원 탈퇴
  async deleteUser(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
  // 비밀번호 재설정
  async updatePassword(id: number, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }
    user.password = newPassword;
    await this.userRepository.save(user);
  }

  async updateIntroduce(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new Error('User not found');
    }
    user.profileImage = updateUserDto.profileImage;
    user.name = updateUserDto.name;
    user.introduce = updateUserDto.introduce;

    return this.userRepository.save(user);
  }
}
