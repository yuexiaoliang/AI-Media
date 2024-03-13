import { Column, Entity, PrimaryGeneratedColumn, JoinTable, ManyToMany } from 'typeorm';
import { CommonEntities } from '..';
import { TagsEntities } from '..';

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

  @ManyToMany(() => TagsEntities.TagEntity, { cascade: true })
  @JoinTable()
  tags?: TagsEntities.TagEntity[];

  @Column(() => CommonEntities.StatusAbstract, { prefix: false })
  status?: CommonEntities.StatusAbstract;

  @Column(() => CommonEntities.TimestampAbstract, { prefix: false })
  timestamp?: CommonEntities.TimestampAbstract;
}
