import React from 'react';
import { useNavigate } from 'react-router-dom';
import SongEntity from '../../../domain/song/songEntity';
import useDeleteSong from '../../hooks/song/useDeleteSong';
import useExportSong from '../../hooks/song/useImportExportSong';
import useSong from '../../hooks/song/useSong';
import useStudioAction from '../../hooks/store/useStudioAction';
import { formatDate } from '../../utils/helper';
import DropdownMenu, { DropdownItem } from '../common/DropdownMenu';
import VisualizationBar from '../note/VisualizationBar';

interface SongListItemProps {
  id: string;
}

const SongListItem: React.FC<SongListItemProps> = ({ id }) => {
  const navigate = useNavigate()
  const { song, notes } = useSong({ id });
  const { deleteSong } = useDeleteSong();
  const { exportSong } = useExportSong();
  const { openNoteListModal, openUpdateSongFormModal } = useStudioAction();

  const formattedDate = song.updatedTimestamp
    ? formatDate(song.updatedTimestamp)
    : 'Chưa xác định';

  const handleOpen = () => navigate(`/editor/${id}`);
  const handleEdit = () => openUpdateSongFormModal(id);
  const handleDelete = () => deleteSong(id);
  const handleViewNotes = () => openNoteListModal(id);
  const handleExportSong = () => exportSong(id);

  const getDropdownItems = (song: SongEntity): DropdownItem[] => [
    {
      label: 'Mở Editor',
      onClick: handleOpen,
      icon: <span className='material-symbols-outlined text-[20px]'>open_in_new</span>,
      link: `/editor/${song.id}`
    },
    {
      label: 'Quản lý Notes',
      onClick: handleViewNotes,
      icon: <span className='material-symbols-outlined text-[20px]'>music_note</span>,
    },
  
    {
      label: 'Xuất file (JSON)',
      onClick: handleExportSong,
      icon: <span className='material-symbols-outlined text-[20px]'>arrow_downward</span>,
    },
  
    {
      label: 'Xóa bài hát',
      onClick: handleDelete,
      icon: <span className='material-symbols-outlined text-[20px]'>delete</span>,
      isDestructive: true,
    },
  ];

  return (
    <div className='group relative flex flex-col bg-white dark:bg-[#1e2430] rounded-xl border border-slate-200 dark:border-[#282e39] hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5'>
      <div className='relative aspect-video bg-[#101622] p-4 flex items-center justify-center group-hover:bg-[#151b26] transition-colors rounded-t-xl overflow-hidden' onClick={handleEdit}>
        <VisualizationBar notes={notes} totalDuration={song.totalDuration} />
        <div className='absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 backdrop-blur-[1px]'>
          <button className='size-12 rounded-full bg-white dark:bg-white text-primary flex items-center justify-center shadow-lg hover:scale-110 transition-transform'>
            <span className='material-symbols-outlined text-[28px] ml-1'>edit</span>
          </button>
        </div>
      </div>
      <div className='p-4 flex flex-col gap-3'>
        <div className='flex justify-between items-start'>
          <div>
            <h3 className='text-slate-900 dark:text-white font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors'>{song.name}</h3>
            <p className='text-slate-500 dark:text-[#9da6b9] text-xs'>{formattedDate}</p>
          </div>
          <DropdownMenu
            items={getDropdownItems(song)}
            triggerIcon={<span className='text-slate-400 dark:text-[#637083] hover:text-slate-900 dark:hover:text-white'>
              <span className='material-symbols-outlined text-[20px]'>more_vert</span>
            </span>}
            align='right'
          />
        </div>
        <div className='flex items-center gap-3 mt-1'>
          <span className='px-2 py-1 rounded bg-slate-100 dark:bg-[#282e39] text-slate-600 dark:text-[#9da6b9] text-xs font-mono font-medium'>Thời lượng: {song.totalDuration}s</span>
        </div>
      </div>
    </div>
  );
};

export default SongListItem;
