import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';

@Entity('users', {
  synchronize: true,
})
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ unique: true, length: 255 })
  username!: string;

  @Column('text')
  password!: string;

  @Index()
  @Column({ unique: true, length: 255, nullable: true, type: 'varchar' })
  email!: string | null;

  @Column({ default: false })
  email_verified!: boolean;

  @Column('int', { default: 0 })
  tokenVersion!: number;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;
}
