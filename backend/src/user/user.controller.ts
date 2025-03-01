import { Controller, Get, Request, Inject, Param, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(
    @Inject(UserService) private readonly userService: UserService,
  ) {}

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  async getProfile(@Request() req: any) { // TODO: Replace any with a proper type
    const user = await this.userService.findById(req.user.id);
    if (!user) {
      throw new Error('User not found');
    }
    return {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    const user = await this.userService.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return {
      _id: user._id,
      username: user.username,
      isAdmin: user.isAdmin,
    };
  }
}