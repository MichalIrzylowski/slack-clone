import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { UseGuards, Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { WsJwtGuard } from './ws-jwt.guard';
import { WsChannelMemberGuard } from './ws-channel-member.guard';
import { MessageService } from '../messages/messages.service';
import { CreateMessageDto } from '../messages/dto/create-message.dto';

@WebSocketGateway({
  cors: {
    origin: '*', // adjust as needed
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(ChatGateway.name);
  @WebSocketServer() private server: Server;

  constructor(private readonly messageService: MessageService) {}

  afterInit() {
    this.logger.log('ChatGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard, WsChannelMemberGuard)
  @SubscribeMessage('chat-message')
  async handleChatMessage(
    @MessageBody() data: Omit<CreateMessageDto, 'senderId'>,
    @ConnectedSocket() client: Socket & { user?: any },
  ) {
    const message = await this.messageService.createMessage({
      senderId: client.user?.userId,
      ...data,
    });

    this.server.to(data.channelId).emit('chat-message', message);

    return { status: 'sent' };
  }
}
