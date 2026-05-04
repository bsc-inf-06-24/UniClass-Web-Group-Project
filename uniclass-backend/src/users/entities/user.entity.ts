import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('UC_USERS')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  googleId: string;

  @Column()
  email: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ default: 'student' })
  role: 'lecturer' | 'student';

  @Column({ nullable: true })
  googleAccessToken: string;

  @CreateDateColumn()
  createdAt: Date;

  // Relations will be added after Joshua & Mirriam define their entities
}
