import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable, CreateDateColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('UC_COURSES')
export class Course {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  courseCode!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  section?: string;

  @Column({ type: 'number', nullable: true })
  credits?: number;

  @Column({ default: 'Regular Course' })
  courseType!: string;

  @ManyToMany(() => User)
  @JoinTable({ name: 'UC_COURSE_STUDENTS' })
  students!: User[];

  @CreateDateColumn()
  createdAt!: Date;
}
