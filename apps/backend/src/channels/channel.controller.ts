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
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Controller('channels')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Get()
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
  @HttpCode(204)
  async remove(@Param('id') id: string) {
    await this.channelService.remove(id);
  }
}
