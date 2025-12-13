import React, { useCallback } from 'react';
import { loadSongByIdUseCase } from '../../dependencies';
import { Note } from '../../domain/entities/Note';
import { Song } from '../../domain/entities/Song';
import useEditorGrid from '../../hooks/useEditorGrid';
import useTrackManager from '../../hooks/useTrackManager';
import { RULER_WIDTH_PX, TIME_UNIT_HEIGHT_PX } from './constants';
import NoteRenderer from './NoteRenderer';
import TimeRuler from './TimeRuler';
import TrackHeader from './TrackHeader';

interface MidiEditorContainerProps {
  currentSong: Song;
  onNoteClick: (note: Note) => void;
  onSongUpdate: (updatedSong: Song) => void;
}

const MidiEditorContainer: React.FC<MidiEditorContainerProps> = ({ currentSong, onNoteClick, onSongUpdate }) => {
  const {
    totalDuration,
    totalEditorHeight,
    totalEditorWidth,
    timeLines,
    allNotes
  } = useEditorGrid({ currentSong });
  const { editTrackLabel } = useTrackManager();

  const handleTrackLabelEdit = useCallback(async (trackId: string, newLabel: string) => {
    if (!currentSong.id) return;

    await editTrackLabel(currentSong.id, trackId, newLabel, async () => {
      onSongUpdate(await loadSongByIdUseCase.execute(currentSong.id as string))
    })
  }, [currentSong, editTrackLabel, onSongUpdate]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0f1115] relative overflow-hidden">
      <div className="flex-1 overflow-auto relative">
        <div className="flex flex-col p-8">
          <div className="sticky top-0 z-10 flex border-b border-[#3b4354] bg-[#111318] shadow-md">
            <div
              className={`shrink-0 w-[${RULER_WIDTH_PX}px] px-4 py-3 text-left text-[#9da6b9] text-xs font-bold uppercase tracking-wider border-r border-[#282e39] bg-[#111318]`}>
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
            />

            <div className={`absolute inset-0 left-[${RULER_WIDTH_PX}px] flex pointer-events-none`}>
              {currentSong.tracks?.map((track, index) => {
                return index % 2 ? (
                  <div key={track.id} className={`w-[${RULER_WIDTH_PX}px] border-r border-[#1c1f27]/50 bg-[#1c1f27]/10`}></div>
                ) : (
                  <div key={track.id} className={`w-[${RULER_WIDTH_PX}px] border-r border-[#1c1f27]/50`}></div>
                );
              })}
            </div>
            <div className={`absolute inset-0 left-[${RULER_WIDTH_PX}px] pointer-events-none`}>
              {timeLines.map((timeLine, index) => {
                const colors = ['#393d45ff', '#935656ff', '#393d45ff', '#279999ff']
                const color = colors[index % colors.length];
                return (
                  <div key={timeLine.key} className={`h-[${TIME_UNIT_HEIGHT_PX}px] w-full border-b border-[${color}]/50`}></div>
                )
              })}
            </div>

            <NoteRenderer
              notes={allNotes}
              onNoteClick={onNoteClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MidiEditorContainer;
