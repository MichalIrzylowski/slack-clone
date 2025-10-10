import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from './user.service';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private users: UserService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.users.validateUserByEmail(email, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const payload = { sub: user.id, role: user.role };
    return {
      accessToken: this.jwt.sign(payload),
      user: this.users.toPublic(user),
    };
  }
}
