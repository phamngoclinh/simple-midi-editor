/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MidiEditorManager from '../../components/editor/MidiEditorManager';
import { ResizableProvider } from '../../contexts/ResizableContext';
import useSongManager from '../../hooks/useSongManager';

const EditorPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const { song, loadSong, setSong } = useSongManager();

  useEffect(() => {
    if (!song && songId) loadSong(songId);
  }, [song, songId, loadSong]);

  useEffect(() => {
    return () => {
      setSong(null);
    }
  }, [])

  return (
    <ResizableProvider>
      {song && <MidiEditorManager currentSong={song} reload={() => loadSong(song.id as string)} />}
    </ResizableProvider>
  );
};

export default EditorPage;