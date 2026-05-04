import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany,
         JoinTable, OneToMany, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Course } from '../../courses/entities/course.entity';
@Entity('UC_GROUPS')
export class Group {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ default: false })
  published: boolean;
  @ManyToOne(() => Course, { eager: true })
  @JoinColumn({ name: 'course_id' })
  course: Course;
  @ManyToMany(() => User, { eager: true })
  @JoinTable({ name: 'UC_GROUP_MEMBERS' })
  members: User[];
  @CreateDateColumn()
  createdAt: Date;
}