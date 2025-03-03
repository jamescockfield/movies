import { Controller, Post, Body, UnauthorizedException, Inject, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(@Inject(AuthService) private readonly authService: AuthService) {}

  @Post('login')
  async login(
    @Body() body: { username: string; password: string },
    @Res({ passthrough: true }) response: Response
  ) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const tokens = await this.authService.login(user);
    
    // Set HTTP-only cookies
    response.cookie('access_token', tokens.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });
    
    response.cookie('refresh_token', tokens.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    return { success: true };
  }

  @Post('register')
  async register(@Body() body: { username: string; password: string }) {
    const newUser = await this.authService.register(body.username, body.password);
    return newUser;
  }

  @Post('refresh')
  async refresh(@Res({ passthrough: true }) response: Response) {
    try {
      const refreshToken = response.req.cookies.refresh_token;
      
      if (!refreshToken) {
        throw new UnauthorizedException('Refresh token not found');
      }
      
      const result = await this.authService.refreshToken(refreshToken);
      
      // Set new access token cookie
      response.cookie('access_token', result.access, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      });
      
      return { success: true };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
  
  @Post('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    // Clear cookies
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return { success: true };
  }
} 