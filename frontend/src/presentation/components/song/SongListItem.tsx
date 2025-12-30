'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import SongEntity from '../../../domain/song/songEntity';
import useDeleteSong from '../../hooks/song/useDeleteSong';
import useExportSong from '../../hooks/song/useImportExportSong';
import useSong from '../../hooks/song/useSong';
import useStudioAction from '../../hooks/store/useStudioAction';
import { formatDate } from '../../utils/helper';
import DropdownMenu, { DropdownItem } from '../common/DropdownMenu';
import VisualizationBar from '../note/VisualizationBar';
import { useTranslations } from 'next-intl';

interface SongListItemProps {
  id: string;
}

const SongListItem: React.FC<SongListItemProps> = ({ id }) => {
  const router = useRouter();
  const { song, notes, tracks } = useSong({ id });
  const { deleteSong } = useDeleteSong();
  const { exportSong } = useExportSong();
  const { openNoteListModal, openUpdateSongFormModal } = useStudioAction();
  const t = useTranslations('Common');

  if (!song) return null;

  const formattedDate = song.updatedTimestamp
    ? formatDate(song.updatedTimestamp)
    : t('unknownDate');

  const handleOpen = () => router.push(`/editor/${id}`);
  const handleEdit = () => openUpdateSongFormModal(id);
  const handleDelete = () => deleteSong(id);
  const handleViewNotes = () => openNoteListModal(id);
  const handleExportSong = () => exportSong(id);

  return (
    <div
      className="group relative flex flex-col bg-input rounded-xl border border-border hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5"
      onClick={handleOpen}
    >
      <div
        className="relative aspect-video bg-muted p-4 flex items-center justify-center group-hover:bg-muted/80 transition-colors rounded-t-xl overflow-hidden"
        onClick={e => {
          e.stopPropagation();
          handleOpen();
        }}
      >
        <VisualizationBar notes={notes} totalDuration={song.totalDuration} />

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10 backdrop-blur-[1px] cursor-pointer">
          <button
            onClick={e => {
              e.stopPropagation();
              handleEdit();
            }}
            className="size-12 rounded-full bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform cursor-pointer"
            title={t('edit')}
          >
            <span className="material-symbols-outlined text-[28px] ml-1">edit</span>
          </button>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3
              className="text-foreground font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors line-clamp-1"
              title={song.name}
            >
              {song.name}
            </h3>
            <p className="text-muted-foreground text-xs">{formattedDate}</p>
          </div>
          <div onClick={e => e.stopPropagation()}>
            <DropdownMenu
              triggerIcon={
                <span className="text-muted-foreground hover:text-foreground transition-colors">
                  <span className="material-symbols-outlined text-[20px]">more_vert</span>
                </span>
              }
              items={[
                {
                  label: t('openEditor'),
                  icon: <span className="material-symbols-outlined text-[18px]">open_in_new</span>,
                  onClick: () => {
                    handleOpen();
                  },
                  link: `/editor/${id}`,
                },
                {
                  label: t('manageNotes'),
                  icon: <span className="material-symbols-outlined text-[18px]">music_note</span>,
                  onClick: () => {
                    handleViewNotes();
                  },
                },
                {
                  label: t('exportJson'),
                  icon: (
                    <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                  ),
                  onClick: () => {
                    handleExportSong();
                  },
                },
                {
                  label: t('edit'),
                  icon: <span className="material-symbols-outlined text-[18px]">edit</span>,
                  onClick: () => {
                    handleEdit();
                  },
                },
                {
                  label: t('deleteLabel'),
                  icon: <span className="material-symbols-outlined text-[18px]">delete</span>,
                  onClick: () => {
                    handleDelete();
                  },
                  isDestructive: true,
                },
              ]}
              align="right"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap mt-1">
          <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-mono font-medium border border-transparent">
            {song.totalDuration}s
          </span>
          <span className="px-2 py-1 rounded bg-muted text-muted-foreground text-xs font-mono font-medium border border-transparent">
            {tracks?.length || 0} {t('tracks')}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SongListItem;
