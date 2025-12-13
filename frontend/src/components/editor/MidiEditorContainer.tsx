import React, { useCallback } from 'react';
import { loadSongByIdUseCase } from '../../dependencies';
import { Note } from '../../domain/entities/Note';
import { Song } from '../../domain/entities/Song';
import useEditorGrid from '../../hooks/useEditorGrid';
import useTrackManager from '../../hooks/useTrackManager';
import { RULER_WIDTH_PX, TIME_UNIT_HEIGHT_PX, TRACK_WIDTH_PX } from './constants';
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
      <div className="flex flex-col overflow-auto relative">
        <div className="sticky top-[-1px] z-10 flex border-[#3b4354] bg-[#111318] shadow-md">
          <div
            className={`shrink-0 w-[${RULER_WIDTH_PX}px] px-4 py-3 text-left text-[#9da6b9] text-sm font-bold uppercase tracking-wider border-r border-[#282e39] bg-[#111318]`}>
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

          {/* Following header width */}
          {/* {currentSong.tracks?.map((track) => (<div 
            key={track.id}
            className={`w-[${TRACK_WIDTH_PX}px] shrink-0`}
          ></div>))} */}
          <div className={`absolute inset-0 left-[${RULER_WIDTH_PX}px] flex pointer-events-none`}>
            {currentSong.tracks?.map((track, index) => {
              return index % 2 ? (
                <div key={track.id} style={hightLightHorizontalLines} className={`w-[${TRACK_WIDTH_PX}px] shrink-0 bg-[#1c1f27]/50`}></div>
              ) : (
                <div key={track.id} style={hightLightHorizontalLines} className={`w-[${TRACK_WIDTH_PX}px] shrink-0`}></div>
              );
            })}
          </div>
          {/* <div className={`absolute inset-0 left-[${RULER_WIDTH_PX}px] pointer-events-none`}>
            {timeLines.map((timeLine, index) => {
              const colors = ['#393d45ff', '#935656ff', '#393d45ff', '#279999ff']
              const color = colors[index % colors.length];
              return (
                <div key={timeLine.key} className={`h-[${TIME_UNIT_HEIGHT_PX}px] shrink-0 w-full border-b border-[${color}]/50`}></div>
              )
            })}
          </div> */}

          <NoteRenderer
            notes={allNotes}
            onNoteClick={onNoteClick}
          />
        </div>
      </div>
    </div>
  );
};

export default MidiEditorContainer;

const hightLightHorizontalLines: React.CSSProperties = {
  backgroundImage: 'linear-gradient(to bottom, #515c51ff 0px, #515c51ff 0px, transparent 0px, transparent calc(25% - 1px), #393d4580 calc(25% - 1px), #393d4580 25%, transparent 25%, transparent calc(50% - 1px), #93565680 calc(50% - 1px), #93565680 50%, transparent 50%, transparent calc(75% - 1px), #393d4580 calc(75% - 1px), #393d4580 75%, transparent 75%, transparent calc(100% - 1px), #27999980 calc(100% - 1px), #27999980 100%)',
  backgroundSize: `100% ${TIME_UNIT_HEIGHT_PX * 4}px`,
  backgroundRepeat: 'repeat'
}