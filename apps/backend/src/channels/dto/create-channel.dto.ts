import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';

export class CreateChannelDto {
  @IsString()
  @Length(1, 50)
  name!: string;

  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean = false;
}
