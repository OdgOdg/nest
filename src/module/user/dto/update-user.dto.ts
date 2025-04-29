import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'User Name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'User introduction', required: false })
  @IsOptional()
  @IsString()
  introduce?: string;

  @ApiProperty({ description: 'User profileImage', required: false })
  @IsOptional()
  @IsString()
  profileImage?: string;
}
