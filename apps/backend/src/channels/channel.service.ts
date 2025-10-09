import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);
  constructor(private prisma: PrismaService) {}

  async list() {
    return this.prisma.channel.findMany({ orderBy: { createdAt: 'asc' } });
  }
}
