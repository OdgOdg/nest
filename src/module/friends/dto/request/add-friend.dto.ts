import { ApiProperty } from '@nestjs/swagger';

export class AddFriendDto {
  @ApiProperty({
    example: 'string@gmail.com',
    description: '추가할 친구의 이메일',
  })
  friendEmail: string;
}
