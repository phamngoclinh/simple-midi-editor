import React from 'react';
import { ResizableProvider } from '../../../infrastructure/stores/ResizableContext';
import MidiEditorManager from './MidiEditorManager';
import NoteModalContainer from '../note/modal/NoteModalContainer';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import EditorStoreHydrator from './EditorStoreHydrator';

interface EditorContentProps {
  songId: string;
  initialSong: SongAggregate;
}

const EditorContent = ({ songId, initialSong }: EditorContentProps) => {
  return (
    <EditorStoreHydrator songId={songId} initialSong={initialSong}>
      <ResizableProvider>
        <MidiEditorManager songId={songId} />
        <NoteModalContainer />
      </ResizableProvider>
    </EditorStoreHydrator>
  );
};

export default EditorContent;
