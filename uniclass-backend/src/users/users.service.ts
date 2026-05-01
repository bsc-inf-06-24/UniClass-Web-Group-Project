import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async findOrCreate(googleId: string, email: string, name: string, photo?: string): Promise<User> {
    let user = await this.findByGoogleId(googleId);
    
    if (!user) {
      user = this.usersRepository.create({
        googleId,
        email,
        name,
        photo,
      });
      await this.usersRepository.save(user);
    }
    
    return user;
  }
}
