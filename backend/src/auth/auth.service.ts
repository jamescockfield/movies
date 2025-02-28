import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { User } from '../user/user.schema';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
    @Inject(JwtService) private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.validateUser(username, password);
    if (user) {
      const { password: _, ...result } = user.toObject();
      return result;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, id: user._id };
    return {
      access: this.jwtService.sign(payload),
      refresh: this.jwtService.sign(payload, { expiresIn: '7d' }),
    };
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const payload = { username: decoded.username, sub: decoded.sub };
      return {
        access: this.jwtService.sign(payload),
      };
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async register(username: string, password: string): Promise<User> {
    const newUser = await this.userService.create(username, password);
    return newUser;
  }
} 