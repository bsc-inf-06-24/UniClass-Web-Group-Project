import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
@Injectable()
export class UsersService {
constructor(@InjectRepository(User) private repo: Repository<User>) {}
async findOrCreate(googleId: string, email: string, name: string, photo:
string): Promise<User> {
let user = await this.repo.findOne({ where: { googleId } });
if (!user) {
user = this.repo.create({ googleId, email, name, photo });
await this.repo.save(user);
}
return user;
}
async findById(id: number): Promise<User | null> {
return this.repo.findOne({ where: { id } });
}
}