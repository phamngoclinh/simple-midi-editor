'use client';

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
    <div className="flex-1 flex flex-col min-w-0 bg-background relative overflow-hidden">
      <div className="flex flex-col overflow-auto relative">
        <div className="sticky top-[-1px] z-10 flex border-border bg-background shadow-md">
          <div
            style={{ width: `${rulerWidth}px` }}
            className={`shrink-0 px-4 py-3 text-left text-muted-foreground text-sm font-bold uppercase tracking-wider border-r border-border bg-background`}
          >
            Time
          </div>

          <TrackHeader />
        </div>

        <div className={`flex relative flex-1`}>
          <TimeRuler
            totalDuration={totalDuration}
            totalHeight={totalEditorHeight}
            width={rulerWidth}
            timeUnitHeight={timeUnitHeight}
            secondPerUnit={secondPerUnit}
            hightLightHorizontalLines={hightLightHorizontalLines}
          />

          <div
            style={{ left: `${rulerWidth}px` }}
            className="absolute inset-0 flex pointer-events-none"
          >
            {columns?.map((column, index) => {
              const bg = index % 2 ? 'bg-muted/30' : '';
              return (
                <div
                  key={column.id}
                  style={{ ...hightLightHorizontalLines, width: `${column.width}px` }}
                  className={`shrink-0 ${bg}`}
                ></div>
              );
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
