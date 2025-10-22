import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ChannelService } from './channels/channel.service';
import { ChannelController } from './channels/channel.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { UsersService } from './users/users.service';
import { RolesGuard } from './auth/roles.guard';
import { ChatGateway } from './websocket/chat.gateway';
import { WsJwtGuard } from './websocket/ws-jwt.guard';
import { WsChannelMemberGuard } from './websocket/ws-channel-member.guard';
import { MessageController } from './messages/message.controller';
import { MessageService } from './messages/messages.service';
import { ChannelMemberGuard } from './messages/channel-member.guard';

@Module({
  imports: [AuthModule],
  controllers: [
    AppController,
    ChannelController,
    UsersController,
    MessageController,
  ],
  providers: [
    AppService,
    PrismaService,
    ChannelService,
    RolesGuard,
    UsersService,
    ChatGateway,
    WsJwtGuard,
    MessageService,
    ChannelMemberGuard, // HTTP guard (query param based)
    WsChannelMemberGuard, // WebSocket guard (payload based)
  ],
})
export class AppModule {}
