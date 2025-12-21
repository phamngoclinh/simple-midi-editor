import React from 'react';
import useDeleteNote from '../../hooks/note/useDeleteNote';
import useNote from '../../hooks/note/useNote';
import useStudioAction from '../../hooks/store/useStudioAction';
import { toMMSS } from '../../utils/helper';
import DropdownMenu from '../common/DropdownMenu';

interface NoteListItemProps {
  index: number;
  noteId: string;
}

const NoteListItem: React.FC<NoteListItemProps> = ({
  index,
  noteId,
}) => {
  const { track, note } = useNote(noteId);
  const { deleteNote } = useDeleteNote();
  const { openUpdateNoteFormModal } = useStudioAction();

  return (
    <div className='group grid grid-cols-[150px_1fr] md:grid-cols-[20px_100px_50px_90px_100px_1fr_80px] gap-4 px-6 py-3 border-b border-slate-200 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-[#1c1f27] items-center transition-colors cursor-pointer'>
      <div className='flex md:hidden'>#</div>
      <div className='text-slate-400 dark:text-slate-500 font-mono'>{index}</div>
      <div className='flex md:hidden'>Thời gian</div>
      <div className='text-slate-400 dark:text-slate-500 font-mono'>{toMMSS(note.time)}</div>
      <div className='flex md:hidden'>Track</div>
      <div className='text-slate-400 dark:text-slate-500 font-mono'>{track?.order}</div>
      <div className='flex md:hidden'>Màu</div>
      <div className='flex items-center gap-3'>
        <div className={`size-2 rounded-full bg-[${note.color}]`}></div>
        <span className='truncate text-slate-400 dark:text-slate-500 font-mono'>{note.color}</span>
      </div>
      <div className='flex md:hidden'>Biểu tượng</div>
      <div className='flex items-center gap-3'>
        {note.icon && <span className='material-symbols-outlined'>{note.icon === 'none' ? 'deselect' : note.icon}</span>}
      </div>
      <div className='flex md:hidden'>Tiêu đề</div>
      <div className='truncate text-slate-400 dark:text-slate-500 font-mono' title={note.title}>{note.title}</div>
      {/* <div className='flex md:hidden'>Description</div>
      <div className='truncate text-slate-400 dark:text-slate-500 font-mono' title={note.description}>{note.description || '-'}</div> */}
      <div className='flex md:hidden'>Thao tác</div>
      <div className='text-slate-400 dark:text-slate-500 font-mono md:text-right'>
        <DropdownMenu
          items={[
            {
              label: 'Sửa',
              onClick: () => openUpdateNoteFormModal(note.id),
              icon: <span className='material-symbols-outlined text-[20px]'>edit</span>,
            },
            {
              label: 'Xóa',
              onClick: () => deleteNote(note.id),
              icon: <span className='material-symbols-outlined text-[20px]'>delete</span>,
              isDestructive: true,
            },
          ]}
          triggerIcon={<span
            className='p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark text-slate-500 hover:text-primary'>
            <span className='material-symbols-outlined text-[18px]'>more_vert</span>
          </span>}
          align='right'
        />
      </div>
    </div>
  );
};

export default NoteListItem;
