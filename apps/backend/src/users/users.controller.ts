import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UsersService } from './users.service';
import { CreateManagedUserDto } from './dto/create-managed-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private users: UsersService) {}
  @Get()
  @ApiOperation({ summary: 'Get all users (auth required)' })
  @ApiResponse({ status: 200, description: 'List of users' })
  @ApiBearerAuth('jwt-auth')
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    const users = await this.users.getAllUsers();
    return users.map((u) => ({
      id: u.id,
      name: u.username, // display name mirrors username for now
      email: u.email,
      role: u.role,
    }));
  }

  @Post()
  @ApiOperation({ summary: 'Create a new user (ADMIN only)' })
  @ApiResponse({ status: 201, description: 'User created' })
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
    };
  }
}
