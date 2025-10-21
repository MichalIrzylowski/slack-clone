import { ApiProperty } from '@nestjs/swagger';
import { ChannelEntity } from '../entities/channel.entity';

export class ChannelResponseDto
  implements
    Pick<
      ChannelEntity,
      | 'id'
      | 'name'
      | 'isPrivate'
      | 'archivedAt'
      | 'deletedAt'
      | 'createdAt'
      | 'updatedAt'
    >
{
  @ApiProperty()
  id!: string;
  @ApiProperty()
  name!: string;
  @ApiProperty()
  isPrivate!: boolean;
  @ApiProperty({ nullable: true })
  archivedAt!: Date | null;
  @ApiProperty({ nullable: true })
  deletedAt!: Date | null;
  @ApiProperty()
  createdAt!: Date;
  @ApiProperty()
  updatedAt!: Date;
}

export class ChannelListResponseDto {
  @ApiProperty({ type: [ChannelResponseDto] })
  items!: ChannelResponseDto[];
  @ApiProperty({ description: 'Cursor for next page or null', nullable: true })
  nextCursor!: string | null;
}
