'use client';

import { useMemo } from 'react';
import useStudioAction from '../../../hooks/store/useStudioAction';
import CreateNoteModal from './CreateNoteModal';
import NoteListModal from './NoteListModal';
import UpdateNoteModal from './UpdateNoteModal';

const NoteModalContainer = () => {
  const { modal } = useStudioAction();

  const component = useMemo(() => {
    switch (modal?.type) {
      case 'VIEW_NOTES':
        return <NoteListModal open={true} songId={(modal.data as any).songId} />;
      case 'CREATE_NOTE':
        return <CreateNoteModal open={true} songId={(modal.data as any).songId} />;
      case 'UPDATE_NOTE':
        return <UpdateNoteModal open={true} noteId={(modal.data as any).noteId} />;
      default:
        return null;
    }
  }, [modal]);

  return <>{component}</>;
};

export default NoteModalContainer;
