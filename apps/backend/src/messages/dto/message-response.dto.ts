import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from '../entities/message.entity';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class MessageResponseDto
  implements
    Pick<
      MessageEntity,
      | 'id'
      | 'senderId'
      | 'channelId'
      | 'recipientUserId'
      | 'content'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'isSilentDeleted'
      | 'sender'
    >
{
  @ApiProperty()
  id!: string;

  @ApiProperty()
  senderId: string;

  @ApiProperty({ nullable: true })
  channelId: string | null;

  @ApiProperty({ nullable: true })
  recipientUserId: string | null;

  @ApiProperty({
    description: 'Content of the message as Lexical JSON',
    example: { text: 'Hello, world!' },
  })
  content: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;

  @ApiProperty()
  isSilentDeleted!: boolean;

  @ApiProperty({ type: UserResponseDto })
  sender: UserResponseDto;
}
