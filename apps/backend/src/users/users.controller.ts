import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { CreateManagedUserDto } from './dto/create-managed-user.dto';
import { UserListResponseDto, UserResponseDto } from './dto/user-response.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users (auth required)' })
  @ApiOkResponse({ description: 'List of users', type: UserListResponseDto })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiBearerAuth('jwt-auth')
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    const users = await this.users.getAllUsers();
    return {
      items: users.map((u) => ({
        id: u.id,
        name: u.username, // display name mirrors username for now
        email: u.email,
        role: u.role,
      })),
    } satisfies UserListResponseDto;
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user (ADMIN only)' })
  @ApiCreatedResponse({ description: 'User created', type: UserResponseDto })
  @ApiBadRequestResponse({
    description: 'Validation failed or duplicate email/username',
  })
  @ApiUnauthorizedResponse({ description: 'Missing or invalid JWT' })
  @ApiForbiddenResponse({ description: 'Insufficient role (requires ADMIN)' })
  @ApiBearerAuth('jwt-auth')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async create(@Body() dto: CreateManagedUserDto) {
    const role = /admin/i.test(dto.role) ? 'ADMIN' : 'USER';
    const created = await this.users.createUserWithRole(
      dto.email,
      dto.password,
      role,
      dto.name,
    );
    return {
      id: created.id,
      name: dto.name || created.username,
      email: created.email,
      role: created.role,
    } satisfies UserResponseDto;
  }
}
