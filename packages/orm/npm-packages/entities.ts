import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { StatusAbstract, TimestampAbstract } from '../abstracts/entities';
import { TagEntity } from '../tags/entities';

@Entity('npm-packages')
export class NpmPackageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true
  })
  pkg: string;

  @Column({ nullable: true })
  title?: string;

  @Column({ nullable: true, type: 'text' })
  description?: string;

  @Column({ nullable: true, type: 'text' })
  content?: string;

  @Column({ nullable: true })
  homepage?: string;

  @Column({ nullable: true })
  repositoryUrl?: string;

  @ManyToMany(() => TagEntity, { cascade: true })
  @JoinTable()
  tags?: TagEntity[];

  @Column(() => StatusAbstract, { prefix: false })
  status?: StatusAbstract;

  @Column(() => TimestampAbstract, { prefix: false })
  timestamp?: TimestampAbstract;
}
