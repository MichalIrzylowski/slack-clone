import { IsString, MinLength, MaxLength, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'Email address used for login',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Password', minLength: 6, maxLength: 200 })
  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password!: string;
}
