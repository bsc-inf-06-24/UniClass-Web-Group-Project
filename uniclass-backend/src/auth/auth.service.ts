import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
@Injectable()
export class AuthService {
constructor(private usersService: UsersService, private jwtService: JwtService)
{}async googleLogin(profile: any) {
const user = await this.usersService.findOrCreate(
profile.googleId, profile.email, profile.name, profile.photo
);
const payload = { sub: user.id, email: user.email, role: user.role };
return { access_token: this.jwtService.sign(payload), user };
}
}