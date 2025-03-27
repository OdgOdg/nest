import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({ description: 'User email address', example: 'aaaa@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User password', example: 'aaaa' })
  @IsString()
  password: string;
}
