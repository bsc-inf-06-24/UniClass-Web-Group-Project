import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './entities/course.entity';
import { UsersService } from '../users/users.service';
import { LinkCourseDto } from './dto/link-course.dto';
import axios from 'axios';

@Injectable()
export class CoursesService {
  constructor(
    @InjectRepository(Course) private repo: Repository<Course>,
    private usersService: UsersService,
  ) {}
  async linkCourse(lecturerId: number, dto: LinkCourseDto, accessToken: string) {
    const { data } = await axios.get(
      `https://classroom.googleapis.com/v1/courses/${dto.classroomCourseId}`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
  const lecturer = await this.usersService.findById(lecturerId);
  if (!lecturer) throw new NotFoundException('Lecturer not found');
  const course = this.repo.create({
    classroomCourseId: dto.classroomCourseId,
    name: data.name,
    section: data.section,
    lecturer,
  });
  return this.repo.save(course);
  }

  async findAllByLecturer(lecturerId: number) {
    return this.repo.find({ where: { lecturer: { id: lecturerId } } });
  }
  
  async findOne(id: number) {
    const course = await this.repo.findOne({ where: { id } });
    if (!course) throw new NotFoundException('Course not found');
    return course;
  }
  
  async unlink(id: number) {
    const course = await this.findOne(id);
    return this.repo.remove(course);
  }
  
  async syncStudents(courseId: number, accessToken: string) {
    const course = await this.findOne(courseId);
    const { data } = await axios.get(
      `https://classroom.googleapis.com/v1/courses/${course.classroomCourseId}/students`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    const students = data.students || [];
    const users = await Promise.all(students.map((s: any) =>
      this.usersService.findOrCreate(
        s.userId, s.profile.emailAddress, s.profile.name.fullName, s.profile.photoUrl
      )
    ));
    return { synced: users.length, students: users };
  }
}