import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { StatusAbstract, TimestampAbstract } from '../common/entities';

@Entity('english_words')
export class EnglishWordEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  word: string;

  @Column({ type: 'json', nullable: true })
  content: any;

  @Column(() => StatusAbstract, { prefix: false })
  status: StatusAbstract;

  @Column(() => TimestampAbstract, { prefix: false })
  timestamp: TimestampAbstract;
}
