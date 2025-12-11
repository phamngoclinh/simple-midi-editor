import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { TrackEntity } from './track.entity';

@Entity()
export class SongEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'real', default: 60 })
  totalDuration: number;

  @Column({ type: 'int', default: 120 })
  tempo: number;

  @Column('simple-array', { nullable: true }) // Mảng Tags
  tags: string[];

  // Time Signature
  @Column({ type: 'int', default: 4 })
  numerator: number;

  @Column({ type: 'int', default: 4 })
  denominator: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  createdTimestamp: Date;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  updatedTimestamp: Date;

  // Mối quan hệ một-nhiều với Tracks
  @OneToMany(() => TrackEntity, (track) => track.song, { cascade: true })
  tracks: TrackEntity[];
}
