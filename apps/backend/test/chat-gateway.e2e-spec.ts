import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { io, Socket } from 'socket.io-client';

/**
 * E2E tests for ChatGateway channel message flow & membership guard.
 * Scenarios:
 * 1. Channel member can send a message; it is persisted and ack returned.
 * 2. Non-member cannot send; ack not invoked and error event received.
 */
describe('ChatGateway (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let jwt: JwtService;
  let baseUrl: string;

  // Test fixtures
  let userMemberId: string;
  let userNonMemberId: string;
  let channelId: string;
  let memberToken: string;
  let nonMemberToken: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
    await app.listen(0);
    baseUrl = `http://127.0.0.1:${(app.getHttpServer() as any).address().port}`;

    prisma = moduleRef.get(PrismaService);
    jwt = moduleRef.get(JwtService);

    const suffix = Date.now().toString();
    // Create users directly via Prisma (bypass HTTP admin flow for test simplicity) with unique identifiers
    const userMember = await prisma.user.create({
      data: {
        email: `member+${suffix}@example.com`,
        username: `memberUser_${suffix}`,
        passwordHash: 'hash',
      },
    });
    userMemberId = userMember.id;

    const userNonMember = await prisma.user.create({
      data: {
        email: `nonmember+${suffix}@example.com`,
        username: `nonMemberUser_${suffix}`,
        passwordHash: 'hash',
      },
    });
    userNonMemberId = userNonMember.id;

    // Create channel & membership for member user
    const channel = await prisma.channel.create({
      data: { name: `e2e-channel-${suffix}`, createdByUserId: userMemberId },
    });
    channelId = channel.id;

    await prisma.channelMembership.create({
      data: { channelId, userId: userMemberId },
    });

    // Sign tokens using same secret as guard
    memberToken = await jwt.signAsync({ sub: userMemberId, role: 'USER' });
    nonMemberToken = await jwt.signAsync({
      sub: userNonMemberId,
      role: 'USER',
    });
  });

  afterAll(async () => {
    await app.close();
  });

  it('allows channel member to send and persists message', (done) => {
    const client: Socket = io(baseUrl, {
      query: { token: `Bearer ${memberToken}` },
      autoConnect: true,
      reconnection: false,
    });

    client.on('connect', () => {
      // Using minimal empty object content to align with current z.object({}) schema behavior
      const payload = { channelId, content: {} };
      client.emit('chat-message', payload, async (ack: any) => {
        try {
          expect(ack).toEqual({ status: 'sent' });
          const messages = await prisma.message.findMany({
            where: { channelId },
          });
          expect(messages.length).toBeGreaterThan(0);
          const latest = messages[messages.length - 1];
          expect(typeof latest.content).toBe('object');
          expect(latest.senderId).toBe(userMemberId);
          client.close();
          done();
        } catch (e) {
          client.close();
          done(e);
        }
      });
    });
  });

  it('rejects non-member channel message (no ack, error event)', (done) => {
    const client: Socket = io(baseUrl, {
      query: { token: `Bearer ${nonMemberToken}` },
      autoConnect: true,
      reconnection: false,
    });

    let ackCalled = false;
    let errorEvent: any = null;

    client.on('error', (err: any) => {
      errorEvent = err;
    });

    client.on('connect', () => {
      client.emit(
        'chat-message',
        { channelId, content: { text: 'Should Fail' } },
        () => {
          ackCalled = true; // Should not be called if guard blocks
        },
      );
    });

    setTimeout(() => {
      try {
        expect(ackCalled).toBe(false);
        // Guard throws WsException -> socket.io may surface as generic error event
        expect(errorEvent).toBeTruthy();
        if (errorEvent?.code) {
          expect(errorEvent.code).toBe('NOT_IN_CHANNEL');
        }
        client.close();
        done();
      } catch (e) {
        client.close();
        done(e);
      }
    }, 700); // allow server processing
  });
});
