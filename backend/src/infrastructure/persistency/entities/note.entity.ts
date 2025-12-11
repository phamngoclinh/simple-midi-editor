import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { TrackEntity } from './track.entity';

@Entity()
export class NoteEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Trường tham chiếu Track
  @ManyToOne(() => TrackEntity, (track) => track.notes, { onDelete: 'CASCADE' })
  track: TrackEntity;

  @Column({ type: 'real' })
  time: number;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  color: string;

  @Column({ nullable: true })
  icon: string; // Icon
}
