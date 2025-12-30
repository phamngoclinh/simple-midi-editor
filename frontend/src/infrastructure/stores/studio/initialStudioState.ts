import { StudioState } from './studioTypes';

const initialStudioState: StudioState = {
  songs: {},
  tracks: {},
  notes: {},
  uiState: {
    isLoadingSong: true,
    isLoadingSongs: true,
  },
};

export default initialStudioState;
