import { ApiProperty } from '@nestjs/swagger';
import { ChannelMemberRole, NotificationLevel } from '@prisma/client';
import { ChannelMembershipEntity } from '../entities/channel-membership.entity';

export class ChannelMembershipResponseDto
  implements
    Pick<
      ChannelMembershipEntity,
      | 'id'
      | 'channelId'
      | 'userId'
      | 'role'
      | 'joinedAt'
      | 'lastReadAt'
      | 'isMuted'
      | 'isStarred'
      | 'notificationsLevel'
    >
{
  @ApiProperty()
  id!: string;
  @ApiProperty()
  channelId!: string;
  @ApiProperty()
  userId!: string;
  @ApiProperty({ enum: ChannelMemberRole })
  role!: ChannelMemberRole;
  @ApiProperty()
  joinedAt!: Date;
  @ApiProperty({ nullable: true })
  lastReadAt!: Date | null;
  @ApiProperty()
  isMuted!: boolean;
  @ApiProperty()
  isStarred!: boolean;
  @ApiProperty({ enum: NotificationLevel })
  notificationsLevel!: NotificationLevel;
}
