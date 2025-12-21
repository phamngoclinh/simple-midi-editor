import { Id } from '../../../domain/shared/types';
import { v4 as uuidv4 } from 'uuid';

const generateId = (prefix: 'song' | 'track' | 'note'): Id => {
  return uuidv4();
  return `${prefix}-${Date.now()}`;
}

export default generateId;