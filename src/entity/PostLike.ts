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

@Entity('post_likes', {
  synchronize: true,
})
@Index(['post_id', 'user_id'], { unique: true })
export default class PostLike {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @Column('uuid')
  post_id!: string;

  @Index()
  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  @ManyToOne((type) => Post, { cascade: true, eager: true })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'user_id' })
  user!: User;
}
