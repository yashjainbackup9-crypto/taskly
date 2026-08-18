import { Controller, Put, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Put('profile')
  async updateProfile(@Request() req, @Body() data: any) {
    return this.usersService.updateProfile(req.user._id.toString(), data);
  }

  @Put('theme')
  async updateTheme(@Request() req, @Body('theme') theme: string) {
    return this.usersService.updateTheme(req.user._id.toString(), theme);
  }

  @Put('color-mode')
  async updateColorMode(@Request() req, @Body('colorMode') colorMode: string) {
    return this.usersService.updateColorMode(req.user._id.toString(), colorMode);
  }
}
