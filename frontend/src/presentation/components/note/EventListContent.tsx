'use client';

import React, { useState } from 'react';
import useEventList, { SortField } from '../../hooks/note/useEventList';
import { useTranslations } from 'next-intl';
import { Link } from '../../../i18n/routing';
import TrackEntity from '../../../domain/track/trackEntity';
import NoteEntity from '../../../domain/note/noteEntity';
import EditorStoreHydrator from '../editor/EditorStoreHydrator';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import FormField from '../common/FormField';
import { DefaultButton, PrimaryButton } from '../common/Button';
import useImportExportSong from '../../hooks/song/useImportExportSong';
import NoteModalContainer from './modal/NoteModalContainer';

interface EventListContentProps {
  songId: string;
  initialSong: SongAggregate;
}

const EventListContentInner = ({ songId }: { songId: string }) => {
  const t = useTranslations('EventList');
  const tCommon = useTranslations('Common');

  const { exportSong } = useImportExportSong();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const {
    song,
    tracks,
    notes,
    sortBy,
    setSortBy,
    timeRange,
    setTimeRange,
    visibleTrackIds,
    toggleTrackVisibility,
    selectAllTracks,
    deleteNote,
    handleAddNote,
  } = useEventList({ songId });

  if (!song) {
    return (
      <div className="flex items-center justify-center h-full text-slate-900 dark:text-white">
        <p>{tCommon('loading')}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 overflow-hidden relative">
      {/* Sidebar: Filters & Sorting */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-80 bg-background-light dark:bg-background-dark border-r border-border transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full p-5 flex flex-col gap-6 bg-background">
          <div className="flex justify-between items-center md:hidden mb-2">
            <h2 className="text-xl font-bold">{tCommon('filter')}</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="p-2">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          {/* Sorting */}
          <div className="flex flex-col gap-2">
            <FormField>
              <FormField.Label>{t('sortBy')}</FormField.Label>
              <FormField.Select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortField)}
              >
                <option value="startTime">{t('sortOptions.startTime')}</option>
                <option value="pitch">{t('sortOptions.pitch')}</option>
                <option value="velocity">{t('sortOptions.velocity')}</option>
                <option value="trackName">{t('sortOptions.trackName')}</option>
              </FormField.Select>
            </FormField>
          </div>

          {/* Time Range */}
          <div className="flex flex-col gap-3">
            <FormField>
              <div className="flex justify-between items-center">
                <FormField.Label>{t('timeRange')}</FormField.Label>
                <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  {timeRange[0]}% - {timeRange[1]}%
                </span>
              </div>
              <FormField.Range
                min="0"
                max="100"
                value={timeRange[1]}
                onChange={(e) => setTimeRange([timeRange[0], parseInt(e.target.value)])}
              />
            </FormField>
          </div>

          <div className="h-px bg-slate-200 dark:bg-border-dark w-full"></div>

          {/* Visible Tracks */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center mb-1">
              <p className="text-base font-medium">{t('visibleTracks')}</p>
              <button
                onClick={selectAllTracks}
                className="text-xs text-primary font-medium hover:underline"
              >
                {t('selectAll')}
              </button>
            </div>

            {tracks.map((track: TrackEntity, index: number) => {
              const colors = ['#38bdf8', '#a855f7', '#10b881', '#f43f5e', '#f59e0b'];
              const color = colors[index % colors.length];
              return (
                <label
                  key={track.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors group"
                >
                  <input
                    type="checkbox"
                    checked={visibleTrackIds.includes(track.id)}
                    onChange={() => toggleTrackVisibility(track.id)}
                    className="rounded border-slate-300 dark:border-slate-600 bg-transparent text-primary focus:ring-primary/20 size-4"
                  />
                  <div
                    className="size-2 rounded-full"
                    style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}66` }}
                  ></div>
                  <span className="text-slate-700 dark:text-slate-300 text-sm font-medium flex-1 truncate">
                    {track.label}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-slate-400">
                    music_note
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 bg-background dark:bg-background relative">
        {/* Header */}
        <div className="flex flex-col border-b border-border dark:border-border bg-background dark:bg-background shadow-sm z-10">
          <div className="flex items-center justify-between p-3 md:p-6 gap-3">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-1.5 flex md:hidden hover:bg-surface-hover rounded-lg transition-colors shrink-0"
              >
                <span className="material-symbols-outlined text-xl">menu</span>
              </button>
              <Link href={`/editor/${songId}`} className="hover:text-primary transition-colors flex items-center shrink-0">
                <span className="material-symbols-outlined text-xl md:text-2xl">arrow_back</span>
              </Link>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <h1 className="text-lg md:text-2xl lg:text-3xl font-bold leading-tight truncate">
                  {t('title')}
                </h1>
                <p className="hidden sm:block text-xs md:text-sm font-normal text-muted-foreground truncate">
                  {t('subtitle', { count: notes.length, songName: song.name })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <DefaultButton onClick={() => exportSong(songId)} className="hidden sm:flex py-2 px-3 text-sm">
                {t('exportMidi')}
              </DefaultButton>
              <button
                onClick={() => exportSong(songId)}
                className="sm:hidden p-2 rounded-lg bg-surface hover:bg-surface-hover transition-colors"
                title={t('exportMidi')}
              >
                <span className="material-symbols-outlined text-[20px]">download</span>
              </button>
              <PrimaryButton onClick={handleAddNote} className="py-2 px-3 text-sm">
                <span className="material-symbols-outlined text-[18px]">add</span>
                <span className="hidden sm:inline ml-1">{t('addNote')}</span>
              </PrimaryButton>
            </div>
          </div>

          {/* Quick Toolbar */}
          <div className="flex items-center gap-2 px-3 md:px-6 py-2 md:py-3 overflow-x-auto scrollbar-hide">
            <div className="flex bg-surface dark:bg-surface rounded-lg p-1 gap-1 border border-border dark:border-border shrink-0">
              <button className="cursor-pointer p-1.5 md:p-2 rounded hover:bg-surface-hover dark:hover:bg-border-dark text-slate-600 dark:text-slate-400 hover:text-primary transition-all" title="Delete">
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">delete</span>
              </button>
              <button className="cursor-pointer p-1.5 md:p-2 rounded hover:bg-surface-hover dark:hover:bg-border-dark text-slate-600 dark:text-slate-400 hover:text-primary transition-all" title="Split">
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">content_cut</span>
              </button>
              <button className="cursor-pointer p-1.5 md:p-2 rounded hover:bg-surface-hover dark:hover:bg-border-dark text-slate-600 dark:text-slate-400 hover:text-primary transition-all" title="Quantize">
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">auto_fix_high</span>
              </button>
              <button className="cursor-pointer p-1.5 md:p-2 rounded hover:bg-surface-hover dark:hover:bg-border-dark text-slate-600 dark:text-slate-400 hover:text-primary transition-all" title="Metronome">
                <span className="material-symbols-outlined text-[18px] md:text-[20px]">timer</span>
              </button>
            </div>
            <div className="h-6 md:h-8 w-px bg-border dark:bg-border mx-1 md:mx-2 shrink-0"></div>
            <div className="flex items-center gap-2 text-xs md:text-sm text-slate-500 dark:text-slate-400 bg-surface dark:bg-surface px-2 md:px-3 py-1 md:py-1.5 rounded-lg border border-border dark:border-border shrink-0">
              <span className="material-symbols-outlined text-[16px] md:text-[18px]">schedule</span>
              <span className="font-mono whitespace-nowrap">{tCommon('total')}: {song.totalDuration}s</span>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-[40px_1fr_1fr_60px] md:grid-cols-[48px_1.5fr_1fr_1fr_2.5fr_2fr_1fr] gap-2 md:gap-4 px-4 md:px-6 py-3 border-b border-border dark:border-border bg-surface dark:bg-surface text-[10px] md:text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 items-center sticky top-0 z-0">
          <div className="flex justify-center">#</div>
          <div>{t('table.startTime')}</div>
          <div>{t('table.pitch')}</div>
          <div className="hidden md:block">{t('table.velocity')}</div>
          <div className="hidden md:block">{t('table.trackInstrument')}</div>
          <div className="hidden lg:block">{t('table.meta')}</div>
          <div className="text-right">{t('table.action')}</div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col">
            {notes.map((note: NoteEntity, index: number) => {
              const trackIndex = tracks.findIndex((t: TrackEntity) => t.id === note.trackId);
              const track = tracks[trackIndex];
              const colors = ['#38bdf8', '#a855f7', '#10b881', '#f43f5e', '#f59e0b'];
              const color = trackIndex >= 0 ? colors[trackIndex % colors.length] : '#ccc';

              return (
                <div
                  key={note.id}
                  className="group grid grid-cols-[40px_1fr_1fr_60px] md:grid-cols-[48px_1.5fr_1fr_1fr_2.5fr_2fr_1fr] gap-2 md:gap-4 px-4 md:px-6 py-2 md:py-3 border-b border-border dark:border-border hover:bg-surface-hover dark:hover:bg-surface-hover items-center transition-colors cursor-pointer text-xs md:text-sm"
                >
                  <div className="flex justify-center font-mono opacity-50 md:opacity-100">{index + 1}</div>
                  <div className="font-mono font-medium text-primary truncate">
                    {Math.floor(note.time / 60).toString().padStart(2, '0')}:{(note.time % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="w-8 h-5 md:h-6 flex items-center justify-center rounded bg-slate-200 dark:bg-border text-[10px] md:text-xs font-bold text-slate-700 dark:text-slate-300 font-mono truncate px-1">
                      {note.title}
                    </span>
                  </div>
                  <div className="hidden md:flex flex-col gap-1 w-24">
                    <div className="h-1.5 w-full bg-slate-200 dark:bg-border-dark rounded-full overflow-hidden">
                      <div className="h-full bg-sky-400 w-[80%]"></div>
                    </div>
                  </div>
                  <div className="hidden md:flex items-center gap-3 overflow-hidden">
                    <div
                      className="size-2 rounded-full shrink-0"
                      style={{ backgroundColor: color }}
                    ></div>
                    <span className="truncate font-medium text-slate-700 dark:text-slate-500">
                      {track?.label || 'Unknown'}
                    </span>
                  </div>
                  <div className="hidden lg:block truncate text-slate-500 dark:text-slate-400">
                    {note.description || '--'}
                  </div>
                  <div className="flex justify-end md:opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="cursor-pointer p-1.5 rounded hover:bg-surface-hover dark:hover:bg-surface-hover text-red-500"
                    >
                      <span className="material-symbols-outlined text-[18px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })}

            {notes.length === 0 && (
              <div className="p-10 text-center text-slate-500 text-sm">
                {t('noEvents')}
              </div>
            )}

            {notes.length > 0 && (
              <div className="p-6 text-center text-slate-500 text-sm">
                {t('noEvents')} <button className="text-primary hover:underline">{t('loadMore')}</button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const EventListContent = ({ songId, initialSong }: EventListContentProps) => {
  return (
    <EditorStoreHydrator songId={songId} initialSong={initialSong}>
      <EventListContentInner songId={songId} />
      <NoteModalContainer />
    </EditorStoreHydrator>
  );
};

export default EventListContent;
