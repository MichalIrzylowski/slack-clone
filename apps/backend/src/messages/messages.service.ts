import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import z from 'zod';

const messageValidationSchema = z
  .object({
    authorId: z.cuid(),
    serializedMessage: z.string().min(1),
    plainTextMessage: z.string().min(1),
    htmlMessage: z.string().min(1),
    channelId: z.cuid().nullable().optional(),
    recipientUserId: z.cuid().nullable().optional(),
  })
  .refine(
    (data) => {
      const isChannelOrRecipientProvided =
        data.channelId || data.recipientUserId;
      const isBothProvided = data.channelId && data.recipientUserId;
      if (isBothProvided) return false;
      if (!isChannelOrRecipientProvided) return false;
      return true;
    },
    {
      error:
        'Either channelId or recipientUserId must be provided, but not both.',
    },
  );

@Injectable()
export class MessageService {
  private readonly logger = new Logger(MessageService.name);

  constructor(private prisma: PrismaService) {}
  async listMessagesByChannel(channelId: string) {
    const messages = await this.prisma.message.findMany({
      where: { channelId, deletedAt: null },
      orderBy: { createdAt: 'asc' },
      include: {
        author: { select: { id: true, username: true, email: true } },
      },
    });
    return messages;
  }

  async createMessage(messageData: CreateMessageDto) {
    const validatedMessage = messageValidationSchema.parse(messageData);

    const message = await this.prisma.message.create({
      data: validatedMessage,
    });

    return message;
  }
}
