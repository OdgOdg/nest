import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'User name' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'User password' })
  @IsNotEmpty()
  @MinLength(4)
  password: string;
}
