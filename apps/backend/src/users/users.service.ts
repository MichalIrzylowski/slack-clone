import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

export interface BasicUser {
  id: string;
  email: string;
  username: string;
  role: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(): Promise<BasicUser[]> {
    const users = await this.prisma.user.findMany({
      select: { id: true, email: true, username: true, role: true },
      orderBy: { createdAt: 'asc' },
    });
    return users;
  }

  /**
   * Creates a user with a specific role (ADMIN or USER) used by managed endpoint.
   */
  async createUserWithRole(
    email: string,
    password: string,
    role: 'USER' | 'ADMIN',
    displayName?: string,
  ): Promise<BasicUser> {
    const normalizedEmail = email.trim().toLowerCase();
    let base = (displayName || normalizedEmail.split('@')[0])
      .trim()
      .toLowerCase();
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
        data: { email: normalizedEmail, username: base, passwordHash, role },
        select: { id: true, email: true, username: true, role: true },
      });
      return user;
    } catch (err: any) {
      if (err?.code === 'P2002') {
        throw new BadRequestException('Email or username already exists');
      }
      throw err;
    }
  }
}
