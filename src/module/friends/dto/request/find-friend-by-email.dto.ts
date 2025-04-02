import { ApiProperty } from '@nestjs/swagger';

export class FindFriendByEmailDto {
  @ApiProperty({
    example: 'string@gmail.com',
    description: '조회할 친구의 이메일',
  })
  email: string;
}
