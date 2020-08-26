import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import Post from './Post';
import User from './User';

@Entity('notification', {
  synchronize: true,
})
@Index(['user_id'], { unique: true })
export default class Notification {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @Column('text')
  body!: string;

  @Column({ default: false })
  status!: boolean;

  @Index()
  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
