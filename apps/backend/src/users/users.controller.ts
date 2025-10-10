import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserService } from '../auth/user.service';
import { CreateManagedUserDto } from './dto/create-managed-user.dto';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private users: UserService) {}

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
    // Frontend expects { id, name, email, role }
    return {
      id: created.id,
      name: dto.name || created.username, // name not persisted yet
      email: created.email,
      role: created.role,
    };
  }
}
