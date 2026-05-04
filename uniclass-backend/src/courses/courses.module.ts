import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Course]), UsersModule],
  providers: [CoursesService],
  controllers: [CoursesController],
  exports: [CoursesService], // <-- Mirriam needs this
  })
  
export class CoursesModule {}