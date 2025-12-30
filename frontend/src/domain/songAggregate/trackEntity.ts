import { Id } from '../shared/types';
import NoteEntity from './noteEntity';

interface TrackEntity {
  id: Id;

  order: number;

  label: string;

  instrument?: string;

  notes: NoteEntity[];
}

export default TrackEntity;
