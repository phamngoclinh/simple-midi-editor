import React, { useCallback, useRef, useState } from 'react';
import { Note } from '../../domain/entities/Note';
import { Song } from '../../domain/entities/Song';
import useEditorGrid from '../../hooks/useEditorGrid';
import useSongManager from '../../hooks/useSongManager';
import { ChildFormHandles } from '../../utils/types';
import Modal from '../common/Modal';
import NoteEditForm, { NoteFormData } from '../note/NoteEditForm';
import NoteRenderer from './NoteRenderer';
import TimeRuler from './TimeRuler';
import TrackHeader from './TrackHeader';

interface MidiEditorContainerProps {
  currentSong: Song;
  onNoteClick: (note: Note) => void;
}

const MidiEditorContainer: React.FC<MidiEditorContainerProps> = ({ currentSong, onNoteClick }) => {
  const {
    totalDuration,
    totalEditorHeight,
    totalEditorWidth,
    allNotes,
    columns,
    timeUnitHeight,
    rulerWidth,
    secondPerUnit,
    hightLightHorizontalLines,
  } = useEditorGrid({ currentSong });
  const { editTrackLabel, saveNote } = useSongManager();
  const formRef = useRef<ChildFormHandles>(null);
  const [isCreateNote, setIsCreateNote] = useState<boolean>(false);

  const handleTrackLabelEdit = useCallback(async (trackId: string, newLabel: string) => {
    if (!currentSong.id) return;
    await editTrackLabel(currentSong.id, trackId, newLabel)
  }, [currentSong, editTrackLabel]);

  const handleSave = useCallback(async (data: NoteFormData) => {
    const success = await saveNote(data);
    if (success) setIsCreateNote(false);
  }, [saveNote])

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0f1115] relative overflow-hidden">
      <div className="flex flex-col overflow-auto relative">
        <div className="sticky top-[-1px] z-10 flex border-[#3b4354] bg-[#111318] shadow-md">
          <div
            className={`shrink-0 w-[${rulerWidth}px] px-4 py-3 text-left text-[#9da6b9] text-sm font-bold uppercase tracking-wider border-r border-[#282e39] bg-[#111318]`}>
            Time
          </div>

          <TrackHeader
            currentSong={currentSong}
            totalWidth={totalEditorWidth}
            onTrackLabelEdit={handleTrackLabelEdit}
          />
        </div>

        <div className={`flex relative flex-1 bg-[#101216]`}>
          <TimeRuler
            totalDuration={totalDuration}
            totalHeight={totalEditorHeight}
            width={rulerWidth}
            timeUnitHeight={timeUnitHeight}
            secondPerUnit={secondPerUnit}
            hightLightHorizontalLines={hightLightHorizontalLines}
          />

          <div className={`absolute inset-0 left-[${rulerWidth}px] flex pointer-events-none`}>
            {columns?.map((column, index) => {
              const bg = index % 2 ? 'bg-[#1c1f27]/50' : '';
              return <div key={column.id} style={hightLightHorizontalLines} className={`shrink-0 w-[${column.width}px] ${bg}`}></div>
            })}
          </div>

          <NoteRenderer
            notes={allNotes}
            onNoteClick={onNoteClick}
            onCreateNote={() => setIsCreateNote(true)}
          />
        </div>
      </div>

      <Modal
        isOpen={isCreateNote}
        onClose={() => setIsCreateNote(false)}
        title={'Tạo Note'}
        textClose='Đóng'
        textOk='Lưu note'
        onOk={() => formRef.current?.submitForm()}
      >
        <NoteEditForm
          songId={currentSong.id as string}
          tracks={currentSong.tracks}
          maxTime={currentSong.totalDuration}
          initialNote={null}
          onSubmit={handleSave}
          ref={formRef}
        />
      </Modal>
    </div>
  );
};

export default MidiEditorContainer;

