// src/components/editor/MidiEditorManager.tsx
import React, { useCallback, useRef } from 'react';
import { Song } from '../../domain/entities/Song';
import useNotesManager from '../../hooks/useNotesManager';
import NoteEditForm from '../note/NoteEditForm';
import MidiEditorContainer from './MidiEditorContainer';
import useSongManager from '../../hooks/useSongManager';
import SongSummaryForm from '../song/SongSummaryForm';
import { ChildFormHandles } from '../../utils/types';


interface MidiEditorProps {
  currentSong: Song;
  reload: () => void;
}

const MidiEditorManager: React.FC<MidiEditorProps> = ({ currentSong, reload }) => {
  const reloadCallback = useCallback(async () => reload(), [reload])
  const {
    initialNote,
    editingNote,
    startEditNote,
    saveNote,
    stopEditNote,
  } = useNotesManager(reloadCallback, currentSong);
  const { editSong, exportSong } = useSongManager();
  const propertiesFormRef = useRef<ChildFormHandles>(null);

  return <>
    <MidiEditorContainer currentSong={currentSong} onNoteClick={startEditNote} onSongUpdate={() => reload()} />

    <aside className="flex-none w-80 bg-[#111318] border-l border-[#282e39] flex flex-col z-10">
      <div className="p-4 border-b border-[#282e39]">
        <h3 className="text-white text-lg font-bold">Properties</h3>
        <p className="text-[#9da6b9] text-sm">Edit selected note details</p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        {!editingNote && <SongSummaryForm 
          initialSong={currentSong}
          onSubmit={(songData) => editSong(currentSong.id as string, songData)}
          ref={propertiesFormRef}
        />}

        {!!editingNote && <>
          <div className="flex items-center transition-colors font-medium text-sm text-white cursor-pointer" onClick={stopEditNote}>
            <span className="material-symbols-outlined text-lg mr-2">arrow_back</span>
            Quay lại
          </div>
          <NoteEditForm
            currentSong={currentSong}
            initialNote={initialNote}
            onSubmit={saveNote}
            onCancel={stopEditNote}
            buttonLabel='Lưu Note'
            ref={propertiesFormRef}
          />
        </>}
      </div>

      <div className="p-4 border-t border-[#282e39] bg-[#111318] flex gap-3">
        <button
          className="flex-1 h-10 flex items-center justify-center rounded-lg border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 transition-colors font-medium text-sm"
          onClick={() => exportSong(currentSong)}
        >
          <span className="material-symbols-outlined text-lg mr-2">arrow_downward</span>
          Export
        </button>
        <button
          type="submit"
          className="flex-1 h-10 flex items-center justify-center bg-primary rounded-lg bg-[#282e39] text-white hover:bg-[#3b4354] transition-colors font-medium text-sm"
          onClick={() => propertiesFormRef.current?.submitForm()}
        >
          <span className="material-symbols-outlined text-lg mr-2">save</span>
          Save
        </button>
      </div>
    </aside>
  </>
};

export default MidiEditorManager;
