import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

// Create table with columns
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  createdAt: Date;
}