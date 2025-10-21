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

  async list(params?: { search?: string; includeArchived?: boolean }) {
    const { search, includeArchived = false } = params || {};
    const where: any = { deletedAt: null };
    if (!includeArchived) where.archivedAt = null;
    if (search) {
      // Names are stored normalized (lowercase), so simple contains works case-insensitively
      where.name = { contains: search.toLowerCase() };
    }
    const items = await this.prisma.channel.findMany({
      where,
      orderBy: { createdAt: 'asc' },
    });
    return items.map((c) => new ChannelEntity(c));
  }

  async create(dto: CreateChannelDto) {
    const raw = dto.name?.trim() || '';
    if (!raw) throw new BadRequestException('Name required');
    const normalized = raw.toLowerCase();
    return new ChannelEntity(
      await this.prisma.channel.create({
        data: { name: normalized, isPrivate: dto.isPrivate ?? false },
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

  /**
   * Join a channel by id for the given user.
   * - Validates channel exists and is not deleted/archived (allow archived join? For now disallow)
   * - Prevents duplicate membership (Prisma unique constraint or manual check)
   * - Private channels: future enhancement to require invite; currently treated same as public
   */
  async join(channelId: string, userId: string) {
    const channel = await this.prisma.channel.findUnique({
      where: { id: channelId },
    });
    if (!channel || channel.deletedAt) {
      throw new NotFoundException('Channel not found');
    }
    if (channel.archivedAt) {
      throw new BadRequestException('Cannot join an archived channel');
    }
    // Check existing membership first to return consistent error
    const existing = await this.prisma.channelMembership.findUnique({
      where: { channelId_userId: { channelId, userId } },
    });
    if (existing) {
      throw new BadRequestException('Already a member');
    }
    try {
      const membership = await this.prisma.channelMembership.create({
        data: {
          channelId,
          userId,
          role: 'MEMBER',
        },
      });
      // Return raw membership entity (no wrapper class yet)
      return membership;
    } catch (e: any) {
      if (e?.code === 'P2002') {
        // Unique constraint race condition
        throw new BadRequestException('Already a member');
      }
      throw e;
    }
  }
}
