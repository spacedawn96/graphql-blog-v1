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

@Entity('following', {
  synchronize: true,
})
@Index(['user_id'])
export default class Following {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('uuid')
  user_id!: string;

  @Column('uuid')
  following_id!: string;

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

  @ManyToOne((type) => User, { cascade: true, eager: true })
  @JoinColumn({ name: 'following_id' })
  following!: User;
}
