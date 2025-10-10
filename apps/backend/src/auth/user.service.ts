import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface PublicUser {
  id: string;
  name: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async countUsers() {
    return this.prisma.user.count();
  }

  async createInitialAdmin(name: string, password: string) {
    const existingCount = await this.countUsers();
    if (existingCount > 0) {
      throw new BadRequestException(
        'Initial admin can only be created when no users exist',
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await this.prisma.user.create({
      data: { name: name.trim().toLowerCase(), passwordHash, role: 'ADMIN' },
    });
    return this.toPublic(user);
  }

  async findByName(name: string) {
    return this.prisma.user.findUnique({
      where: { name: name.trim().toLowerCase() },
    });
  }

  async validateUser(name: string, password: string) {
    const user = await this.findByName(name);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  toPublic(user: any): PublicUser {
    const { id, name, role, createdAt, updatedAt } = user;
    return { id, name, role, createdAt, updatedAt };
  }

  async getPublicById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.toPublic(user);
  }
}
