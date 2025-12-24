import React from 'react';
import useEditorGrid from '../../hooks/useEditorGrid';
import NoteRenderer from './NoteRenderer';
import TimeRuler from './TimeRuler';
import TrackHeader from './TrackHeader';
import NoteEntity from '../../../domain/note/noteEntity';
import useStudioAction from '../../hooks/store/useStudioAction';

interface MidiEditorContainerProps {
  songId: string;
  onNoteClick: (note: NoteEntity) => void;
}

const MidiEditorContainer: React.FC<MidiEditorContainerProps> = ({ songId, onNoteClick }) => {
  const {
    totalDuration,
    totalEditorHeight,
    allNotes,
    columns,
    timeUnitHeight,
    rulerWidth,
    secondPerUnit,
    hightLightHorizontalLines,
  } = useEditorGrid({ songId });

  const { openCreateNoteFormModal } = useStudioAction();

  return (
    <div className='flex-1 flex flex-col min-w-0 bg-[#0f1115] relative overflow-hidden'>
      <div className='flex flex-col overflow-auto relative'>
        <div className='sticky top-[-1px] z-10 flex border-[#3b4354] bg-[#111318] shadow-md'>
          <div
            className={`shrink-0 w-[${rulerWidth}px] px-4 py-3 text-left text-[#9da6b9] text-sm font-bold uppercase tracking-wider border-r border-[#282e39] bg-[#111318]`}>
            Time
          </div>

          <TrackHeader />
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
            onCreateNote={() => openCreateNoteFormModal(songId)}
          />
        </div>
      </div>
    </div>
  );
};

export default MidiEditorContainer;

