import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from
'typeorm';
@Entity('UC_USERS')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    googleId: string;
    @Column()
    email: string;
    @Column()
    name: string;
    
    @Column({ nullable: true })
    photo: string;
    @Column({ default: 'student' })
    role: string;
    // 'lecturer' or 'student'
    @CreateDateColumn()
    createdAt: Date;
}