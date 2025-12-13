import React from 'react';
import { Song } from '../../domain/entities/Song';
import DropdownMenu, { DropdownItem } from '../common/DropdownMenu';

interface SongListItemProps {
  song: Song;
  onOpen: (songId: string) => void;
  onEdit: (songId: string) => void;
  onDelete: (songId: string) => void;
  onEditNotes: (song: Song) => void;
  onExport: (song: Song) => void;
}

const SongListItem: React.FC<SongListItemProps> = ({
  song,
  onOpen,
  onEdit,
  onDelete,
  onEditNotes,
  onExport
}) => {
  const formattedDate = song.updatedTimestamp
    ? new Date(song.updatedTimestamp).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
    : 'Chưa xác định';

  const handleOpen = () => song.id && onOpen(song.id);
  const handleEdit = () => song.id && onEdit(song.id);
  const handleDelete = () => song.id && onDelete(song.id);
  const handleEditNotes = () => onEditNotes(song);
  const handleExportSong = () => onExport(song);

  const getDropdownItems = (song: Song): DropdownItem[] => [
    {
      label: "Mở Editor",
      onClick: handleOpen,
      icon: <span className="material-symbols-outlined text-[20px]">open_in_new</span>,
    },
    {
      label: "Quản lý Notes",
      onClick: handleEditNotes,
      icon: <span className="material-symbols-outlined text-[20px]">music_note</span>,
    },
  
    {
      label: "Export (JSON)",
      onClick: handleExportSong,
      icon: <span className="material-symbols-outlined text-[20px]">arrow_downward</span>,
    },
  
    {
      label: "Xóa Song",
      onClick: handleDelete,
      icon: <span className="material-symbols-outlined text-[20px]">delete</span>,
      isDestructive: true,
    },
  ];

  return (
    <>
      <div className="relative aspect-video bg-[#101622] p-4 flex items-center justify-center group-hover:bg-[#151b26] transition-colors" onClick={handleEdit}>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]">
          <button className="size-12 rounded-full bg-white dark:bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
            <span className="material-symbols-outlined text-[28px] ml-1">edit</span>
          </button>
        </div>
      </div>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-slate-900 dark:text-white font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors">{song.name}</h3>
            <p className="text-slate-500 dark:text-[#9da6b9] text-xs">{formattedDate}</p>
          </div>
          <DropdownMenu
            items={getDropdownItems(song)}
            triggerIcon={<span className="text-slate-400 dark:text-[#637083] hover:text-slate-900 dark:hover:text-white">
              <span className="material-symbols-outlined text-[20px]">more_vert</span>
            </span>}
            align="right"
          />
        </div>
        <div className="flex items-center gap-3 mt-1">
          <span className="px-2 py-1 rounded bg-slate-100 dark:bg-[#282e39] text-slate-600 dark:text-[#9da6b9] text-xs font-mono font-medium">Duration: {song.totalDuration}s</span>
        </div>
      </div>
    </>
  );
};

export default SongListItem;
