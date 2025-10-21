import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty()
  id!: string;
  @ApiProperty({
    description: 'Display name (for now mirrors username or provided name)',
  })
  name!: string;
  @ApiProperty({ description: 'Email address' })
  email!: string;
  @ApiProperty({ description: 'User role' })
  role!: string;
}

export class UserListResponseDto {
  @ApiProperty({ type: [UserResponseDto] })
  items!: UserResponseDto[];
}
