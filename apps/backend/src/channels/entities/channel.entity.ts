import { Channel } from '@prisma/client';

// Thin entity wrapper (future: class-transformer @Expose / @Exclude)
export class ChannelEntity implements Channel {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  isPrivate: boolean;
  deletedAt: Date | null;
  archivedAt: Date | null;
  createdByUserId: string | null;
  constructor(partial: Channel) {
    Object.assign(this, partial);
  }
}
