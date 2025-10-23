import { ApiProperty } from '@nestjs/swagger';
import { Message } from '@prisma/client';
import { UserResponseDto } from 'src/users/dto/user-response.dto';

export class MessageEntity implements Message {
  @ApiProperty({ description: 'Unique message identifier' })
  id: string;

  @ApiProperty({
    description: 'ID of the user who is the sender',
  })
  senderId: string;

  @ApiProperty({
    description: 'ID of the channel this message belongs to',
    nullable: true,
  })
  channelId: string | null;

  @ApiProperty({
    description: 'ID of the recipient this message belongs to',
    nullable: true,
  })
  recipientUserId: string | null;

  @ApiProperty({
    description: 'Content of the message as Stringified Lexical JSON',
    example: "{ text: 'Hello, world!' }",
  })
  content: string;

  @ApiProperty({ description: 'When the message was created' })
  createdAt: Date;

  @ApiProperty({ description: 'When the message was last updated' })
  updatedAt: Date;

  @ApiProperty({
    description: 'When the message was deleted (soft delete)',
    nullable: true,
  })
  deletedAt: Date | null;

  @ApiProperty({
    description:
      'If true, the message is silently deleted (hidden from regular queries)',
  })
  isSilentDeleted: boolean;

  @ApiProperty({ type: UserResponseDto, description: 'Sender user details' })
  sender: UserResponseDto;

  constructor(partial: Message) {
    Object.assign(this, partial);
  }
}
