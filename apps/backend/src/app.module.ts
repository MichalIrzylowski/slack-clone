import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ChannelService } from './channels/channel.service';
import { ChannelController } from './channels/channel.controller';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [AppController, ChannelController],
  providers: [AppService, PrismaService, ChannelService],
})
export class AppModule {}
