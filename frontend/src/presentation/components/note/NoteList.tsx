import React from 'react';
import NoteListItem from './NoteListItem';
import useNoteList from '../../hooks/note/useNoteList';
import { useTranslations } from 'next-intl';

interface NoteListProps {
  noteIds: string[];
}

const NoteList: React.FC<NoteListProps> = ({ noteIds }) => {
  const { notesByNoteIds: notes } = useNoteList({ noteIds });
  const t = useTranslations('NoteList');

  return (
    <div>
      {notes.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>{t('empty')}</p>
      ) : (
        <>
          <div className="hidden md:grid md:grid-cols-[20px_100px_50px_90px_100px_1fr_80px] gap-4 px-6 py-3 border-b border-border bg-muted text-sm font-bold uppercase tracking-wider text-muted-foreground items-center sticky -top-6 z-1">
            <div className="flex justify-center">#</div>
            <div>{t('time')}</div>
            <div>{t('track')}</div>
            <div>{t('color')}</div>
            <div>{t('icon')}</div>
            <div>{t('title')}</div>
            {/* <div className='hidden md:block'>{t('description')}</div> */}
            <div className="text-right">{t('actions')}</div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[200px]">
            <div className="flex flex-col md:min-w-[700px]">
              {notes.map((note, index) => {
                return <NoteListItem key={note.id} index={index + 1} noteId={note.id} />;
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteList;
