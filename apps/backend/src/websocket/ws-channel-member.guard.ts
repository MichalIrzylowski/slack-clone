import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PrismaService } from '../prisma/prisma.service';

/**
 * WebSocket guard ensuring that if a message targets a channel (has channelId),
 * the authenticated user is a member of that channel. Direct user-to-user
 * messages (recipientUserId present, channelId absent) are always allowed.
 *
 * Expected data shape (runtime): { channelId?: string; recipientUserId?: string; ... }
 * Assumptions:
 *  - WsJwtGuard already ran and populated client.user.userId
 *  - Validation layer ensures NOT both channelId & recipientUserId simultaneously.
 */
@Injectable()
export class WsChannelMemberGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: any = context.switchToWs().getClient();
    const data: any = context.switchToWs().getData();

    const userId: string | undefined = client?.user?.userId;
    if (!userId) throw new WsException('Unauthenticated socket');

    const channelId: string | undefined = data?.channelId || undefined;
    const recipientUserId: string | undefined =
      data?.recipientUserId || undefined;

    // Direct message path: allow (no channelId)
    if (!channelId) return true;

    // Defensive: if BOTH provided (should be prevented by DTO/zod) reject.
    if (channelId && recipientUserId) {
      throw new WsException(
        'Invalid payload: both channelId and recipientUserId provided',
      );
    }

    // Check membership via composite unique (channelId, userId)
    const membership = await this.prisma.channelMembership.findUnique({
      where: { channelId_userId: { channelId, userId } },
      select: { id: true },
    });

    if (!membership) {
      // Emit optional structured error for clients that listen globally
      client.emit?.('error', { code: 'NOT_IN_CHANNEL', channelId });
      throw new WsException('User is not a member of the channel');
    }

    // Optionally join socket.io room for channel (idempotent)
    if (client.join) {
      try {
        client.join(channelId);
      } catch {
        // ignore room join errors, not critical for auth
      }
    }

    return true;
  }
}
