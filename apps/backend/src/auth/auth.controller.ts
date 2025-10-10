import {
  Body,
  Controller,
  Post,
  Get,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Roles } from './roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from './roles.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private users: UserService,
  ) {}

  @Post('init-admin')
  @ApiOperation({
    summary: 'Initialize the first admin user (only when no users exist)',
  })
  @ApiResponse({ status: 201, description: 'Admin user created' })
  async initAdmin(@Body() dto: CreateUserDto) {
    return this.users.createInitialAdmin(dto.name, dto.password);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login and obtain a JWT access token' })
  async login(@Body() dto: LoginDto) {
    return this.auth.login(dto.name, dto.password);
  }

  @Get('me')
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Get current authenticated user profile' })
  @UseGuards(AuthGuard('jwt'))
  async me(@Request() req: any) {
    return this.users.getPublicById(req.user.userId);
  }

  @Get('admin-check')
  @ApiBearerAuth('jwt-auth')
  @ApiOperation({ summary: 'Verify current user has ADMIN role' })
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN')
  async adminCheck() {
    return { ok: true };
  }
}
