import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import MidiEditorManager from '../../components/editor/MidiEditorManager';
import useSongManager from '../../hooks/useSongManager';

const EditorPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const { song, loadSong } = useSongManager();

  useEffect(() => {
    if (songId) loadSong(songId);
  }, [songId, loadSong]);

  return (
    <>
      {song && <MidiEditorManager currentSong={song} reload={() => loadSong(song.id as string)} />}
    </>
  );
};

export default EditorPage;