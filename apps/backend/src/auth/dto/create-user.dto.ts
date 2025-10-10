import { IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'Unique username', minLength: 3, maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @ApiProperty({
    description: 'Password (will be hashed)',
    minLength: 6,
    maxLength: 200,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password!: string;
}
