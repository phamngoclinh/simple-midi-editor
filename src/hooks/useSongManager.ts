import { useContext } from 'react';
import { SongManagerContext } from '../contexts/SongManagerContext';

export const useSongManager = () => {
  return useContext(SongManagerContext);
};
export default useSongManager;