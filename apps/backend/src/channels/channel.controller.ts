import {
  Body,
  Controller,
  Get,
  Post,
  BadRequestException,
  Query,
  Patch,
  Param,
  Delete,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiQuery,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
} from '@nestjs/swagger';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';
import { AuthGuard } from '@nestjs/passport';
import {
  ChannelListResponseDto,
  ChannelResponseDto,
} from './dto/channel-response.dto';

@ApiTags('channels')
@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
  @ApiOperation({
    summary: 'List channels with optional search and pagination',
  })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'includeArchived', required: false })
  @ApiOkResponse({ type: ChannelListResponseDto })
  async list(
    @Query('search') search?: string,
    @Query('limit') limit?: string,
    @Query('cursor') cursor?: string,
    @Query('includeArchived') includeArchived?: string,
  ) {
    return this.channelService.list({
      search,
      limit: limit ? parseInt(limit, 10) : undefined,
      cursor: cursor || undefined,
      includeArchived: includeArchived === 'true',
    });
  }

  @Post()
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Create a new channel' })
  @ApiCreatedResponse({
    description: 'Channel created',
    type: ChannelResponseDto,
  })
  @ApiBadRequestResponse({ description: 'Validation failed or duplicate name' })
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() dto: CreateChannelDto) {
    try {
      return await this.channelService.create(dto);
    } catch (e: any) {
      // Simple unique constraint handling; in future map Prisma error codes
      if (e?.code === 'P2002') {
        throw new BadRequestException('Channel name already exists');
      }
      throw e;
    }
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a channel' })
  @ApiOkResponse({ description: 'Updated channel', type: ChannelResponseDto })
  @ApiBadRequestResponse({ description: 'Validation failed or duplicate name' })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  async update(@Param('id') id: string, @Body() dto: UpdateChannelDto) {
    try {
      return await this.channelService.update(id, dto);
    } catch (e: any) {
      if (e?.code === 'P2002') {
        throw new BadRequestException('Channel name already exists');
      }
      throw e;
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a channel' })
  @HttpCode(204)
  @ApiNoContentResponse({ description: 'Channel soft-deleted' })
  @ApiNotFoundResponse({ description: 'Channel not found' })
  async remove(@Param('id') id: string) {
    await this.channelService.remove(id);
  }
}
