import { Id } from '../shared/types';

interface NoteEntity {

  id: Id;

  time: number;

  title: string;

  description?: string;

  color: string;

  icon?: string;

}

export default NoteEntity;