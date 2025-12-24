import React, { createContext, ReactNode, useCallback, useContext, useMemo, useReducer } from 'react';
import initialStudioState from './initialStudioState';
import studioReducer from './studioReducer';
import { StudioAction, StudioState } from './studioTypes';

interface StudioContextType {
  state: StudioState,
  dispatch: React.Dispatch<StudioAction>;
}

const StudioContext = createContext<StudioContextType | undefined>(undefined);

interface StudioProviderProps {
  children: ReactNode;
}

export const StudioProvider: React.FC<StudioProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(studioReducer, initialStudioState);

  return (
    <StudioContext.Provider value={{ state, dispatch }}>
      {children}
    </StudioContext.Provider>
  );
};

export const useStudio = () => {
  const context = useContext(StudioContext);
  if (context === undefined) {
    throw new Error('useStudio phải được sử dụng trong StudioProvider');
  }
  return context;
};

export const useStudioState = () => {
  const { state } = useStudio();
  return state;
}

export const useStudioDispatch = () => {
  const { dispatch } = useStudio();
  return dispatch;
}

export const useStudioSelector = <TSelected extends any>(selector: (state: StudioState) => TSelected): TSelected => {
  const state = useStudioState();
  return selector(state);
}

export const useSongsState = () => {
  const state = useStudioState();

  const select = useCallback((id: string) => {
    const song = state.songs[id];
    const tracks = Object.values(state.tracks)
      .filter(t => t.songId === id)
      .sort((a, b) => a.order - b.order);
    const trackIds = tracks.map(t => t.id);
    const notes = Object.values(state.notes).filter(n => trackIds.includes(n.trackId));
    
    return { song, tracks, notes,}
  }, [state])

  return {
    select,
    songs: state.songs,
    tracks: state.tracks,
    notes: state.notes,
  };
}

export const useSongSelector = (id: string) => {
  const { select } = useSongsState();

  const song = useMemo(() => {
    return select(id);
  }, [select, id])

  return song;
}
