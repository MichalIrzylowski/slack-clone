import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface PublicUser {
  id: string;
  email: string;
  username: string;
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

  async createInitialAdmin(email: string, password: string, username?: string) {
    const existingCount = await this.countUsers();
    if (existingCount > 0) {
      throw new BadRequestException(
        'Initial admin can only be created when no users exist',
      );
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = (username || normalizedEmail.split('@')[0])
      .trim()
      .toLowerCase();
    const user = await this.prisma.user.create({
      data: {
        email: normalizedEmail,
        username: normalizedUsername,
        passwordHash,
        role: 'ADMIN',
      },
    });
    return this.toPublic(user);
  }

  async createUser(email: string, password: string, username?: string) {
    // Normalize inputs
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUsername = (username || normalizedEmail.split('@')[0])
      .trim()
      .toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          username: normalizedUsername,
          passwordHash,
          role: 'USER',
        },
      });
      return this.toPublic(user);
    } catch (err: any) {
      // Prisma unique constraint violation
      if (err?.code === 'P2002') {
        throw new BadRequestException('Email or username already exists');
      }
      throw err;
    }
  }

  async createUserWithRole(
    email: string,
    password: string,
    role: 'USER' | 'ADMIN',
    displayName?: string,
  ) {
    const normalizedEmail = email.trim().toLowerCase();
    // Derive username: prefer displayName slug, else email local part
    let base = (displayName || normalizedEmail.split('@')[0])
      .trim()
      .toLowerCase();
    // Basic slugify: replace spaces with '-', remove invalid chars
    base = base
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-_]/g, '')
      .replace(/-+/g, '-');
    if (base.length < 3) {
      base = normalizedEmail.split('@')[0];
    }
    const passwordHash = await bcrypt.hash(password, 12);
    if (!['USER', 'ADMIN'].includes(role)) {
      throw new BadRequestException('Invalid role');
    }
    try {
      const user = await this.prisma.user.create({
        data: {
          email: normalizedEmail,
          username: base,
          passwordHash,
          role,
        },
      });
      return this.toPublic(user);
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new BadRequestException('Email or username already exists');
      }
      throw err;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });
  }

  async validateUserByEmail(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.passwordHash);
    return valid ? user : null;
  }

  toPublic(user: any): PublicUser {
    const { id, email, username, role, createdAt, updatedAt } = user;
    return { id, email, username, role, createdAt, updatedAt };
  }

  async getPublicById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return this.toPublic(user);
  }
}
