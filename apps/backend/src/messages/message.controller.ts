import {
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { MessageService } from './messages.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { MessageResponseDto } from './dto/message-response.dto';
import { AuthGuard } from '@nestjs/passport';
import { ChannelMemberGuard } from './channel-member.guard';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('messages')
@Controller('messages')
export class MessageController {
  constructor(private readonly messagesService: MessageService) {}

  @Get()
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({
    summary: 'List messages by channel (auth + membership required)',
  })
  @ApiQuery({ name: 'channelId', required: true })
  @ApiOkResponse({
    description: 'List of messages',
    type: [MessageResponseDto],
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiForbiddenResponse({ description: 'User not a member of the channel' })
  @UseGuards(AuthGuard('jwt'), ChannelMemberGuard)
  getMessages(@Query('channelId') channelId: string) {
    return this.messagesService.listMessagesByChannel(channelId);
  }
}
