import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Course } from '../courses/entities/course.entity';
import { SEED_COURSES, SEED_STUDENTS } from './seed-data';

@Injectable()
export class SeederService implements OnModuleInit {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  private async clearExistingData() {
    await this.dataSource.query('DELETE FROM "UC_GROUP_MEMBERS"');
    await this.dataSource.query('DELETE FROM "UC_GROUPS"');
    await this.dataSource.query('DELETE FROM "UC_COURSE_STUDENTS"');
    await this.dataSource.query('DELETE FROM "UC_COURSES"');
    await this.dataSource.query('DELETE FROM "UC_USERS"');
  }

  private async seedDatabase() {
    await this.clearExistingData();

    const students = await this.usersRepository.save(
      SEED_STUDENTS.map((student) =>
        this.usersRepository.create({
          regNumber: student.regNumber,
          name: student.name,
          cohort: student.cohort,
          role: 'student',
        }),
      ),
    );

    for (const courseSeed of SEED_COURSES) {
      const course = this.coursesRepository.create({
        courseCode: courseSeed.courseCode,
        name: courseSeed.name,
        credits: courseSeed.credits,
        courseType: courseSeed.courseType,
        students,
      });

      await this.coursesRepository.save(course);
    }
  }
}
