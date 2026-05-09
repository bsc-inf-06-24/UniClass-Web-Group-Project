import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn
} from 'typeorm';

@Entity('UC_USERS')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true, nullable: true })
  googleId?: string;

  @Column({ unique: true })
  regNumber!: string;

  @Column()
  email!: string;

  @Column()
  name!: string;

  @Column({ nullable: true })
  cohort?: string;

  @Column({ nullable: true })
  photo!: string;

  @Column({ default: 'student' })
  role!: 'lecturer' | 'student';

  @Column({ type: 'varchar2', length: 1000, nullable: true })
  googleAccessToken?: string;

  @CreateDateColumn()
  createdAt!: Date;

}