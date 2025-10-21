import { ChannelMembership } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class ChannelMembershipEntity implements ChannelMembership {
  @ApiProperty()
  id: string;
  @ApiProperty({ description: 'Channel id this membership belongs to' })
  channelId: string;
  @ApiProperty({ description: 'User id of the member' })
  userId: string;
  @ApiProperty({ description: 'Role in the channel (OWNER | ADMIN | MEMBER)' })
  role: string;
  @ApiProperty({ description: 'Timestamp user joined the channel' })
  joinedAt: Date;
  @ApiProperty({ description: 'Last read marker timestamp', nullable: true })
  lastReadAt: Date | null;
  @ApiProperty({ description: 'Whether the channel is muted for this user' })
  isMuted: boolean;
  @ApiProperty({ description: 'Whether the channel is starred by this user' })
  isStarred: boolean;
  @ApiProperty({
    description: 'Notification preference (ALL | MENTIONS | NONE)',
  })
  notificationsLevel: string;

  constructor(partial: ChannelMembership) {
    Object.assign(this, partial);
  }
}
