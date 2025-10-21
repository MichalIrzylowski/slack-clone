import { ApiProperty } from '@nestjs/swagger';
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
  @ApiProperty()
  role!: string;
  @ApiProperty()
  joinedAt!: Date;
  @ApiProperty({ nullable: true })
  lastReadAt!: Date | null;
  @ApiProperty()
  isMuted!: boolean;
  @ApiProperty()
  isStarred!: boolean;
  @ApiProperty()
  notificationsLevel!: string;
}
