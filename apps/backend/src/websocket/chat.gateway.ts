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

  afterInit() {
    this.logger.log('ChatGateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsJwtGuard)
  @SubscribeMessage('dummy-event')
  handleDummy(
    @MessageBody() data: any,
    @ConnectedSocket() client: Socket & { user?: any },
  ) {
    console.log('Authenticated user:', client.user);
    // Build response (ack back to sender)
    const payload = { message: 'hello world', userId: client.user?.userId };
    // Broadcast to all OTHER connected clients (excluding sender)
    client.broadcast.emit('dummy-broadcast', payload);
    // Optionally also send to everyone including sender:
    // this.server.emit('dummy-broadcast', payload);
    // Return ack response to sender
    return payload;
  }
}
