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
import Tag from './Tag';
import Post from './Post';

@Entity('posts_tags', {
  synchronize: true,
})
export default class PostsTags {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255 })
  name!: string;

  @Index()
  @Column('uuid')
  post_id!: string;

  @ManyToOne((type) => Tag, { cascade: true, eager: true, nullable: true })
  @JoinColumn({ name: 'tag_id' })
  tag!: Tag;

  @ManyToOne((type) => Post, { cascade: true })
  @JoinColumn({ name: 'post_id' })
  post!: Post;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  // @Column({ length: 255, nullable: true, type: 'varchar' })
  // description!: string | null;
}
