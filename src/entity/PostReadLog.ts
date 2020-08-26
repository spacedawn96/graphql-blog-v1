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

@Entity('post_read', {
  synchronize: true,
})
export default class PostReadLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid', {
    nullable: true,
  })
  user_id!: string | null;

  @Column('uuid')
  post_id!: string;

  @Index()
  @Column({ length: 255 })
  ip!: string;

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
