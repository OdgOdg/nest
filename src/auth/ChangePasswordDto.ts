import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({
    description: '현재 비밀번호',
  })
  @IsString()
  currentPassword: string;

  @ApiProperty({
    description: '새로운 비밀번호',
  })
  @IsString()
  @MinLength(4, {
    message: '비밀번호는 최소 4자 이상이어야 합니다.',
  })
  newPassword: string;
}
