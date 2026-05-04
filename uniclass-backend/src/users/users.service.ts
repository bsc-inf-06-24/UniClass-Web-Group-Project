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
    return this.usersRepository.findOne({
      where: { id },
    });
  }

  async findByGoogleId(
    googleId: string,
  ): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { googleId },
    });
  }

  async findOrCreate(
    googleId: string,
    email: string,
    name: string,
    photo?: string,
    googleAccessToken?: string,
  ): Promise<User> {
    const existing = await this.findByGoogleId(
      googleId,
    );

    if (!existing) {
      const user = this.usersRepository.create({
        googleId,
        email,
        name,
        photo,
        googleAccessToken,
      });

      await this.usersRepository.save(user);
      return user;
    }

    if (googleAccessToken) {
      existing.googleAccessToken =
        googleAccessToken;

      await this.usersRepository.save(
        existing,
      );
    }

    return existing;
  }
}