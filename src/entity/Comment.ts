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
  getRepository,
  getManager,
} from 'typeorm';
import User from './User';
import Post from './Post';

@Entity('comments', {
  synchronize: true,
})
export default class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('text')
  text!: string;

  @Column({ default: 0 })
  likes!: number;

  @Column('uuid', {
    nullable: true,
  })
  reply!: string;

  @Column({ default: false })
  has_replies!: boolean;

  @Column({ default: false })
  deleted!: boolean;

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

  @ManyToOne((type) => User)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne((type) => Post, (post) => post.comments)
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  subcomments!: Comment[];
}
