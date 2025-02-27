import { Controller, Post, Body, Get, Request } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
  ) {}

  @Post('register')
  async register(
    @Body() createUserDto: { username: string; password: string },
  ) {
    return this.userService.create(
      createUserDto.username,
      createUserDto.password,
    );
  }

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