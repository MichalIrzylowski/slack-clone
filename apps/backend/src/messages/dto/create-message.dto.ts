import { ApiProperty } from '@nestjs/swagger';

export class CreateMessageDto {
  @ApiProperty({
    description: 'ID of the user who is the author',
  })
  authorId: string;

  @ApiProperty({
    description: 'Serialized message content in Lexical JSON format',
  })
  serializedMessage: string;

  @ApiProperty({
    description: 'Plain text representation of the message content',
  })
  plainTextMessage: string;

  @ApiProperty({ description: 'HTML representation of the message content' })
  htmlMessage: string;

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
