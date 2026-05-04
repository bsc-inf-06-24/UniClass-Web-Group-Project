import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('UC_COURSES')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  classroomCourseId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  section: string;

  @ManyToOne(() => User)
  lecturer: User;

  @ManyToMany(() => User)
  @JoinTable({ name: 'UC_COURSE_STUDENTS' })
  students: User[];

  @CreateDateColumn()
  createdAt: Date;
}
