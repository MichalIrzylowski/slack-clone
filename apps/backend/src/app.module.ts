import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { ChannelService } from './channels/channel.service';
import { ChannelController } from './channels/channel.controller';
import { AuthModule } from './auth/auth.module';
import { UsersController } from './users/users.controller';
import { RolesGuard } from './auth/roles.guard';

@Module({
  imports: [AuthModule],
  controllers: [AppController, ChannelController, UsersController],
  providers: [AppService, PrismaService, ChannelService, RolesGuard],
})
export class AppModule {}
