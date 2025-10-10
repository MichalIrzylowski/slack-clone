import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateChannelDto {
  @ApiProperty({
    description: 'Channel display name',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  @Length(1, 50)
  name!: string;

  @ApiProperty({
    description: 'Whether the channel is private',
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean = false;
}
