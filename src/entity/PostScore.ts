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
import User from './User';
import Post from './Post';

@Entity('post_scores', {
  synchronize: true,
})
export default class PostScore {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ length: 255 })
  type!: string;

  @Index()
  @Column('uuid')
  user_id!: string;

  @Index()
  @Column('uuid')
  post_id!: string;

  @Index()
  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @Column('float8', {
    default: 0,
  })
  score!: number;

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne((type) => Post)
  @JoinColumn({ name: 'post_id' })
  post!: User;
}
