import { Controller, Get, Post, UseGuards, Req, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth(@Req() req) {
    // This route redirects to Google OAuth
  }

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
    const { googleId, email, name, photo, accessToken } = req.user;

    const user = await this.authService.validateUser(googleId, email, name, photo, accessToken);
    const jwt = await this.authService.generateJwt(user);
    
    // Redirect to frontend with JWT token
    res.redirect(`http://localhost:3000/auth/success?token=${jwt.access_token}`);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout() {
    // Clear session/token logic here
    return { message: 'Logged out successfully' };
  }
}
