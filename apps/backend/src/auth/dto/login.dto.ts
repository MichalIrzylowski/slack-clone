import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Username', minLength: 3, maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @ApiProperty({ description: 'Password', minLength: 6, maxLength: 200 })
  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password!: string;
}
