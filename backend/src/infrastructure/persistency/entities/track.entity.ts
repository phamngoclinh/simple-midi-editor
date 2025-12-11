import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { SongEntity } from './song.entity';
import { NoteEntity } from './note.entity';

@Entity()
export class TrackEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => SongEntity, (song) => song.tracks, { onDelete: 'CASCADE' })
  song: SongEntity; // Tham chiếu đến Song mẹ

  @Column()
  label: string;

  @Column({ type: 'int' })
  order: number; // Thứ tự Track trong Song

  @Column({ default: 'synth' })
  instrument: string;

  @OneToMany(() => NoteEntity, (note) => note.track, { cascade: true })
  notes: NoteEntity[]; // Mối quan hệ một-nhiều với Notes
}
