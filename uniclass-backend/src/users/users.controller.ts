import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller()
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('auth/me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req) {
    const user = await this.usersService.findById(req.user.userId);
    return user;
  }
}
