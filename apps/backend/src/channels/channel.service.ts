import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { ChannelEntity } from './entities/channel.entity';

@Injectable()
export class ChannelService {
  private readonly logger = new Logger(ChannelService.name);
  constructor(private prisma: PrismaService) {}

  async list(params?: {
    search?: string;
    limit?: number;
    cursor?: string;
    includeArchived?: boolean;
  }) {
    const {
      search,
      limit = 50,
      cursor,
      includeArchived = false,
    } = params || {};
    const take = Math.min(Math.max(limit, 1), 100);
    const where: any = { deletedAt: null };
    if (!includeArchived) where.archivedAt = null;
    if (search) {
      where.name = { contains: search.toLowerCase(), mode: 'insensitive' };
    }
    const items = await this.prisma.channel.findMany({
      where,
      orderBy: { createdAt: 'asc' },
      take: take + 1,
      ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
    });
    const hasMore = items.length > take;
    if (hasMore) items.pop();
    return {
      items: items.map((c) => new ChannelEntity(c)),
      nextCursor: hasMore ? items[items.length - 1]?.id : null,
    };
  }

  async create(dto: CreateChannelDto) {
    if (!dto.name) throw new BadRequestException('Name required');

    return new ChannelEntity(
      await this.prisma.channel.create({
        data: { name: dto.name.trim().toLowerCase(), isPrivate: dto.isPrivate },
      }),
    );
  }

  async update(id: string, dto: UpdateChannelDto) {
    const existing = await this.prisma.channel.findUnique({
      where: { id, deletedAt: null } as any,
    });
    if (!existing) throw new NotFoundException('Channel not found');
    const data: any = {};
    if (dto.name !== undefined) {
      const normalized = dto.name.trim().toLowerCase();
      if (!normalized) throw new BadRequestException('Name cannot be empty');
      data.name = normalized;
    }
    if (dto.isPrivate !== undefined) data.isPrivate = dto.isPrivate;
    if (dto.archived !== undefined) {
      data.archivedAt = dto.archived ? new Date() : null;
    }
    return new ChannelEntity(
      await this.prisma.channel.update({ where: { id }, data }),
    );
  }

  async remove(id: string) {
    const existing = await this.prisma.channel.findUnique({ where: { id } });
    if (!existing || existing.deletedAt)
      throw new NotFoundException('Channel not found');
    return new ChannelEntity(
      await this.prisma.channel.update({
        where: { id },
        data: { deletedAt: new Date() },
      }),
    );
  }
}
