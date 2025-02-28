import { Controller, Post, Body, UnauthorizedException, Inject } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const newUser = await this.authService.register(body.username, body.password);
    return newUser;
  }

  @Post('refresh')
  async refresh(@Body() body: { refresh: string }) {
    try {
      return await this.authService.refreshToken(body.refresh);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
} 