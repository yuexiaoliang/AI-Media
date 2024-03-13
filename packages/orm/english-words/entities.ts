import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { CommonEntities } from '..';

@Entity('english_words')
export class EnglishWordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  word: string;

  @Column({ type: 'json', nullable: true })
  content?: any;

  @Column(() => CommonEntities.StatusAbstract, { prefix: false })
  status?: CommonEntities.StatusAbstract;

  @Column(() => CommonEntities.TimestampAbstract, { prefix: false })
  timestamp?: CommonEntities.TimestampAbstract;
}
