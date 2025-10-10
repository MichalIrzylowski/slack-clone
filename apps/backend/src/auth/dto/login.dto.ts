import { IsString, MinLength, MaxLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  name!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(200)
  password!: string;
}
