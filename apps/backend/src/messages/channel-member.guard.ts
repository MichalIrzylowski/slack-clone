import {
  BadRequestException,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Request } from 'express';

/**
 * Guard ensuring the authenticated user is a member of the channel whose
 * messages are being requested (via `channelId` query param).
 *
 * Assumptions:
 * - Authentication (JWT) guard has already populated `req.user.userId`.
 * - `channelId` is provided as a query parameter on the request.
 * - Channel membership is represented by the unique composite key
 *   (channelId, userId) in `ChannelMembership`.
 */
@Injectable()
export class ChannelMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const userId = (req as any)?.user?.userId as string | undefined;
    if (!userId) throw new UnauthorizedException('Missing authenticated user');

    const channelId = (req.query?.channelId as string) || undefined;
    if (!channelId) {
      throw new BadRequestException('channelId query parameter is required');
    }

    const membership = await this.prisma.channelMembership.findUnique({
      where: { channelId_userId: { channelId, userId } },
      select: { id: true },
    });

    if (!membership) {
      throw new ForbiddenException('User is not a member of this channel');
    }

    return true;
  }
}
