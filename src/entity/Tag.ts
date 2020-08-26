import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  UpdateDateColumn,
  CreateDateColumn,
  getRepository,
} from 'typeorm';

@Entity('tags', {
  synchronize: true,
})
export default class Tag {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Index()
  @Column({ length: 255 })
  name!: string;

  @Column('timestampz')
  @CreateDateColumn()
  created_at!: Date;

  @Column('timestamptz')
  @UpdateDateColumn()
  updated_at!: Date;

  // @Column({ length: 255, nullable: true, type: 'varchar' })
  // description!: string | null;
}
