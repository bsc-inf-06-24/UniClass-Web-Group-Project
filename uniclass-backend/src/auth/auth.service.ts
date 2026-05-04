import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(googleId: string, email: string, name: string, photo?: string, googleAccessToken?: string) {
    const user = await this.usersService.findOrCreate(googleId, email, name, photo, googleAccessToken);
    return user;
  }

  async generateJwt(user: any) {
    const payload = { 
      sub: user.id, 
      email: user.email, 
      role: user.role 
    };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
