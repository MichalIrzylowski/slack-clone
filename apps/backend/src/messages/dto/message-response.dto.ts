import { ApiProperty } from '@nestjs/swagger';
import { MessageEntity } from '../entities/message.entity';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class MessageResponseDto
  implements
    Pick<
      MessageEntity,
      | 'id'
      | 'authorId'
      | 'channelId'
      | 'recipientUserId'
      | 'serializedMessage'
      | 'plainTextMessage'
      | 'htmlMessage'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'isSilentDeleted'
      | 'author'
    >
{
  @ApiProperty()
  id!: string;

  @ApiProperty()
  authorId: string;

  @ApiProperty({ nullable: true })
  channelId: string | null;

  @ApiProperty({ nullable: true })
  recipientUserId: string | null;

  @ApiProperty()
  serializedMessage: string;

  @ApiProperty()
  plainTextMessage: string;

  @ApiProperty()
  htmlMessage: string;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ nullable: true })
  deletedAt: Date | null;

  @ApiProperty()
  isSilentDeleted!: boolean;

  @ApiProperty({ type: UserResponseDto })
  author: UserResponseDto;
}
