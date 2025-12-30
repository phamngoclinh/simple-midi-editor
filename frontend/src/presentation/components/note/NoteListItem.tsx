import React from 'react';
import useDeleteNote from '../../hooks/note/useDeleteNote';
import useNote from '../../hooks/note/useNote';
import useStudioAction from '../../hooks/store/useStudioAction';
import { toMMSS } from '../../utils/helper';
import DropdownMenu from '../common/DropdownMenu';
import { useTranslations } from 'next-intl';

interface NoteListItemProps {
  index: number;
  noteId: string;
}

const NoteListItem: React.FC<NoteListItemProps> = ({ index, noteId }) => {
  const { track, note } = useNote(noteId);
  const { deleteNote } = useDeleteNote();
  const { openUpdateNoteFormModal } = useStudioAction();
  const t = useTranslations('NoteList');
  const tCommon = useTranslations('Common');

  return (
    <div className="group grid grid-cols-[150px_1fr] md:grid-cols-[20px_100px_50px_90px_100px_1fr_80px] gap-4 px-6 py-3 border-b border-border hover:bg-surface-hover items-center transition-colors cursor-pointer">
      <div className="flex md:hidden">#</div>
      <div className="text-muted-foreground font-mono">{index}</div>
      <div className="flex md:hidden">{t('time')}</div>
      <div className="text-muted-foreground font-mono">{toMMSS(note.time)}</div>
      <div className="flex md:hidden">{t('track')}</div>
      <div className="text-muted-foreground font-mono">{track?.order}</div>
      <div className="flex md:hidden">{t('color')}</div>
      <div className="flex items-center gap-3">
        <div className={`size-2 rounded-full bg-[${note.color}]`}></div>
        <span className="truncate text-muted-foreground font-mono">{note.color}</span>
      </div>
      <div className="flex md:hidden">{t('icon')}</div>
      <div className="flex items-center gap-3">
        {note.icon && (
          <span className="material-symbols-outlined text-foreground">
            {note.icon === 'none' ? 'deselect' : note.icon}
          </span>
        )}
      </div>
      <div className="flex md:hidden">{t('title')}</div>
      <div className="truncate text-muted-foreground font-mono" title={note.title}>
        {note.title}
      </div>
      <div className="flex md:hidden">{t('description')}</div>
      <div
        className="truncate text-slate-400 dark:text-slate-500 font-mono md:hidden"
        title={note.description}
      >
        {note.description || '-'}
      </div>
      <div className="flex md:hidden">{t('actions')}</div>
      <div className="text-muted-foreground font-mono md:text-right">
        <DropdownMenu
          items={[
            {
              label: tCommon('edit'),
              onClick: () => openUpdateNoteFormModal(note.id),
              icon: <span className="material-symbols-outlined text-[20px]">edit</span>,
            },
            {
              label: tCommon('deleteLabel'),
              onClick: () => deleteNote(note.id),
              icon: <span className="material-symbols-outlined text-[20px]">delete</span>,
              isDestructive: true,
            },
          ]}
          triggerIcon={
            <span className="p-1.5 rounded hover:bg-muted text-muted-foreground hover:text-primary">
              <span className="material-symbols-outlined text-[18px]">more_vert</span>
            </span>
          }
          align="right"
        />
      </div>
    </div>
  );
};

export default NoteListItem;
