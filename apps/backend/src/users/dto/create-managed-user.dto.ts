import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  Matches,
} from 'class-validator';

export class CreateManagedUserDto {
  @ApiProperty({
    description: 'Email of the new user',
    example: 'user@example.com',
  })
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Temporary password (will be hashed)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password!: string;

  @ApiProperty({ description: 'Optional display name', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @ApiProperty({
    description: 'Role to assign (admin|member)',
    example: 'member',
  })
  @IsString()
  @Matches(/^(admin|member)$/i, { message: 'role must be admin or member' })
  role!: string; // member | admin (mapped to USER | ADMIN)
}
