import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

/**
 * WsJwtGuard validates JWT sent via connection params or auth header in handshake.
 * Accepted locations:
 *  - query token param (?token=Bearer <jwt> or ?token=<jwt>)
 *  - auth header: Authorization: Bearer <jwt>
 */
@Injectable()
export class WsJwtGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client: any = context.switchToWs().getClient();
    // Socket.IO: handshake contains headers & query
    const { handshake } = client;
    const headerAuth: string | undefined = handshake?.headers?.authorization;
    const queryToken: string | undefined = handshake?.query?.token as
      | string
      | undefined;

    const rawToken = this.extractToken(headerAuth, queryToken);
    if (!rawToken) throw new UnauthorizedException('Missing auth token');

    try {
      const payload: any = jwt.verify(
        rawToken,
        process.env.JWT_SECRET || 'dev-secret-change-me',
      );
      // attach user to socket for downstream handlers
      client.user = { userId: payload.sub, role: payload.role };
      return true;
    } catch (e) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractToken(
    headerAuth?: string,
    queryToken?: string,
  ): string | null {
    if (headerAuth && headerAuth.startsWith('Bearer ')) {
      return headerAuth.substring(7);
    }
    if (queryToken) {
      if (queryToken.startsWith('Bearer ')) return queryToken.substring(7);
      return queryToken;
    }
    return null;
  }
}
