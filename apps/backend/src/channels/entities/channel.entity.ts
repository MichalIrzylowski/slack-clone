import { Channel } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

// Thin entity wrapper (future: class-transformer @Expose / @Exclude)
export class ChannelEntity implements Channel {
  @ApiProperty({ description: 'Unique channel identifier' })
  id: string;

  @ApiProperty({ description: 'Normalized (lowercase) channel name' })
  name: string;

  @ApiProperty({ description: 'When the channel was created' })
  createdAt: Date;

  @ApiProperty({ description: 'When the channel was last updated' })
  updatedAt: Date;

  @ApiProperty({ description: 'If true channel is private' })
  isPrivate: boolean;

  @ApiProperty({ description: 'Soft delete timestamp', nullable: true })
  deletedAt: Date | null;

  @ApiProperty({ description: 'Archive timestamp', nullable: true })
  archivedAt: Date | null;

  @ApiProperty({ description: 'User who created the channel', nullable: true })
  createdByUserId: string | null;

  constructor(partial: Channel) {
    Object.assign(this, partial);
  }
}
