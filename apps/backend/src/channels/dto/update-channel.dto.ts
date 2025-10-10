import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class UpdateChannelDto {
  @IsOptional()
  @IsString()
  @Length(1, 50)
  name?: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean;

  @IsOptional()
  @IsBoolean()
  archived?: boolean; // maps to archivedAt set/clear
}
