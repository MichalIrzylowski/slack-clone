import { Test } from '@nestjs/testing';
import { ChatGateway } from './chat.gateway';
import { MessageService } from '../messages/messages.service';
import { WsJwtGuard } from './ws-jwt.guard';
import { WsChannelMemberGuard } from './ws-channel-member.guard';
import { PrismaService } from '../prisma/prisma.service';

describe('ChatGateway', () => {
  let gateway: ChatGateway;
  let messageService: { createMessage: jest.Mock };

  beforeEach(async () => {
    messageService = {
      createMessage: jest.fn().mockImplementation(async (dto) => ({
        id: 'msg_cuid123',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: null,
        isSilentDeleted: false,
        authorId: dto.authorId,
        channelId: dto.channelId ?? null,
        recipientUserId: dto.recipientUserId ?? null,
        serializedMessage: dto.serializedMessage,
        plainTextMessage: dto.plainTextMessage,
        htmlMessage: dto.htmlMessage,
      })),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ChatGateway,
        { provide: MessageService, useValue: messageService },
        {
          provide: WsJwtGuard,
          useValue: { canActivate: jest.fn().mockResolvedValue(true) },
        },
        {
          provide: WsChannelMemberGuard,
          useValue: { canActivate: jest.fn().mockResolvedValue(true) },
        },
        {
          provide: PrismaService,
          useValue: {
            channelMembership: {
              findUnique: jest.fn().mockResolvedValue({ id: 'membership_1' }),
            },
          },
        },
      ],
    }).compile();

    gateway = moduleRef.get(ChatGateway);

    // Mock socket.io server API used by gateway
    const roomEmitter = { emit: jest.fn() };
    const toFn = jest.fn().mockReturnValue(roomEmitter);
    // @ts-expect-error overriding internal property for test
    gateway.server = { to: toFn };
  });

  it('persists and emits a channel message', async () => {
    const client: any = { user: { userId: 'cuid_user_1' } };
    const data = {
      channelId: 'cuid_channel_1',
      serializedMessage: JSON.stringify({ text: 'Direct hello' }),
      plainTextMessage: 'Direct hello',
      htmlMessage: '<p>Direct hello</p>',
    };

    const result = await gateway.handleChatMessage(data as any, client);

    expect(result).toEqual({ status: 'sent' });
    expect(messageService.createMessage).toHaveBeenCalledWith({
      authorId: 'cuid_user_1',
      channelId: 'cuid_channel_1',
      serializedMessage: JSON.stringify({ text: 'Direct hello' }),
      plainTextMessage: 'Direct hello',
      htmlMessage: '<p>Direct hello</p>',
    });
    const toMock = (gateway as any).server.to as jest.Mock;
    expect(toMock).toHaveBeenCalledWith('cuid_channel_1');
    const roomEmitter = toMock.mock.results[0].value;
    expect(roomEmitter.emit).toHaveBeenCalledWith(
      'chat-message',
      expect.objectContaining({
        id: 'msg_cuid123',
        channelId: 'cuid_channel_1',
        authorId: 'cuid_user_1',
      }),
    );
  });

  it('returns status sent even if channelId is undefined (current behavior)', async () => {
    // NOTE: Current implementation calls server.to(data.channelId) even when undefined.
    // This test documents the existing behavior. Consider improving by handling direct messages separately.
    const client: any = { user: { userId: 'cuid_user_2' } };
    const data = {
      recipientUserId: 'cuid_user_3',
      serializedMessage: JSON.stringify({ text: 'Direct hello' }),
      plainTextMessage: 'Direct hello',
      htmlMessage: '<p>Direct hello</p>',
    };

    const result = await gateway.handleChatMessage(data as any, client);
    expect(result).toEqual({ status: 'sent' });
    expect(messageService.createMessage).toHaveBeenCalledWith({
      authorId: 'cuid_user_2',
      recipientUserId: 'cuid_user_3',
      serializedMessage: JSON.stringify({ text: 'Direct hello' }),
      plainTextMessage: expect.any(String),
      htmlMessage: expect.any(String),
    });
    const toMock = (gateway as any).server.to as jest.Mock;
    expect(toMock).toHaveBeenCalledWith(undefined); // documents current state
  });
});
