import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './auth.service';
@Controller('api/v1/auth')
export class AuthController {
constructor(private authService: AuthService) {}
@Get('google')
@UseGuards(GoogleAuthGuard)
googleLogin() {}
@Get('google/callback')
@UseGuards(GoogleAuthGuard)
async googleCallback(@Req() req) {
return this.authService.googleLogin(req.user);
}
@Post('logout')
@UseGuards(JwtAuthGuard)
logout() { return { message: 'Logged out' }; }
@Get('me')
@UseGuards(JwtAuthGuard)
getMe(@Req() req) { return req.user; }
}