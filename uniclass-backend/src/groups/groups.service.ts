import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from './entities/group.entity';
import { CoursesService } from '../courses/courses.service';
import { UsersService } from '../users/users.service';
import { GenerateGroupsDto } from './dto/generate-groups.dto';
import { MoveStudentDto } from './dto/move-student.dto';
@Injectable()
export class GroupsService {
  constructor(
    @InjectRepository(Group) private repo: Repository<Group>,
    private coursesService: CoursesService,
    private usersService: UsersService,
  ) {}
  // Fisher-Yates shuffle
  private shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  async generate(courseId: number, dto: GenerateGroupsDto) {
    const course = await this.coursesService.findOne(courseId);
    const { students } = await this.coursesService.syncStudents(courseId);
    const shuffled = this.shuffle([...students]);
    const size = dto.groupSize || Math.ceil(shuffled.length / (dto.groupCount || 
1));
    const chunks: any[][] = [];
    for (let i = 0; i < shuffled.length; i += size) {
      chunks.push(shuffled.slice(i, i + size));
    }
    // Delete old unpublished groups first
    await this.repo
      .createQueryBuilder()
      .delete()
      .where('course_id = :courseId AND published = 0', { courseId })
      .execute();
    const groups = chunks.map((members, i) =>
      this.repo.create({ name: `Group ${i + 1}`, course, members, published: false })
    );
    return this.repo.save(groups);
  }
  async findAllForCourse(courseId: number) {
    return this.repo.find({ where: { course: { id: courseId } } });
  }
  async findOne(id: number) {
    const g = await this.repo.findOne({ where: { id } });
    if (!g) throw new NotFoundException('Group not found');
    return g;
  }
  async publish(courseId: number) {
    const groups = await this.findAllForCourse(courseId);
    groups.forEach(g => { g.published = true; });
    return this.repo.save(groups);
  }
  async moveStudent(groupId: number, dto: MoveStudentDto) {
    const source = await this.findOne(groupId);
    const target = await this.findOne(dto.targetGroupId);
    const student = await this.usersService.findByRegNumber(dto.studentRegNumber);
    if (!student) throw new NotFoundException('Student not found');
    source.members = source.members.filter(m => m.regNumber !== dto.studentRegNumber);
    target.members.push(student);
    await this.repo.save(source);
    await this.repo.save(target);
    return { source, target };
  }
}
