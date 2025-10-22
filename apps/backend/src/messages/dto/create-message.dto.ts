import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'ID of the user who is the sender',
  })
  senderId: string;

  @ApiProperty({
    description: 'Content of the message as Lexical JSON',
    example: { text: 'Hello, world!' },
  })
  content: object;

  @ApiProperty({
    description: 'ID of the channel this message belongs to',
    nullable: true,
  })
  channelId?: string | null;

  @ApiProperty({
    description: 'ID of the recipient this message belongs to',
    nullable: true,
  })
  recipientUserId?: string | null;
}
