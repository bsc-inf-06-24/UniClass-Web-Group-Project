import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { UsersService } from '../users/users.service';
import { LinkCourseDto } from './dto/link-course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private repo: Repository<Course>,
    private usersService: UsersService,
  ) {}

  async linkCourse(dto: LinkCourseDto) {
    const course = await this.repo.findOne({
      where: { courseCode: dto.courseCode },
      relations: { students: true },
    });

    if (!course) throw new NotFoundException('Course not found');

    return course;
  }

  async findAll() {
    return this.repo.find({
      relations: { students: true },
      order: { courseCode: 'ASC' },
    });
  }
  
  async findOne(id: number) {
    const course = await this.repo.findOne({
      where: { id },
      relations: { students: true },
    });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
  
  async unlink(id: number) {
    const course = await this.findOne(id);
    return this.repo.remove(course);
  }
  
  async syncStudents(courseId: number) {
    const course = await this.findOne(courseId);
    return { synced: course.students.length, students: course.students };
  }
}