import { Controller, Post, Body, Get, UseGuards, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  async register(
    @Body() createUserDto: { username: string; password: string },
  ) {
    return this.userService.create(
      createUserDto.username,
      createUserDto.password,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req: any) { // TODO: Replace any with a proper type
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }
}