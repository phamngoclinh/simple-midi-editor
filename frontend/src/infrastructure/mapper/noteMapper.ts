import NoteEntity from '../../domain/note/noteEntity';
import { Note as NoteResponse } from '../services/types';

const NoteMapper = {
  toDomain(response: NoteResponse): NoteEntity {
    return {
      id: response.id,
      time: response.time,
      title: response.title,
      description: response.description,
      color: response.color,
      icon: response.icon,
      trackId: response.track.id,
    };
  },
};

export default NoteMapper;
