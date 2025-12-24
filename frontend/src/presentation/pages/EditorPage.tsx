import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResizableProvider } from '../../infrastructure/stores/ResizableContext';
import MidiEditorManager from '../components/editor/MidiEditorManager';
import useSong from '../hooks/song/useSong';
import NoteModalContainer from '../components/note/modal/NoteModalContainer';

const EditorPage = () => {
  const { songId } = useParams<{ songId: string }>();
  const { loading, song, loadSong } = useSong({ id: songId as string })

  useEffect(() => {
    if (songId) loadSong(songId);
  }, [songId, loadSong]);

  if (loading) return <>Đang tải bài hát</>

  if (!song) {
    return <div className='p-6'>Không tìm thấy bài hát.</div>;
  }

  return (
    <ResizableProvider>
      <MidiEditorManager songId={song.id} />
      <NoteModalContainer />
    </ResizableProvider>
  );
};

export default EditorPage;