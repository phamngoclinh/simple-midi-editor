/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import NoteListItem from './NoteListItem';
import useNoteList from '../../hooks/note/useNoteList';

interface NoteListProps {
  noteIds: string[];
}

const NoteList: React.FC<NoteListProps> = ({ noteIds }) => {
  const { notesByNoteIds: notes } = useNoteList({ noteIds });

  return (
    <div>
      {notes.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>Chưa có Notes nào trong bài hát này.</p>
      ) : (
        <>
          <div className='hidden md:grid md:grid-cols-[20px_100px_50px_90px_100px_1fr_80px] gap-4 px-6 py-3 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#151921] text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 items-center sticky -top-6 z-0'>
            <div className='flex justify-center'>#</div>
            <div>Thời gian</div>
            <div>Track</div>
            <div>Màu</div>
            <div>Biểu tượng</div>
            <div>Tiêu đề</div>
            {/* <div className='hidden md:block'>Mô tả</div> */}
            <div className='text-right'>Thao tác</div>
          </div>
          <div className='flex-1 overflow-y-auto overflow-x-hidden min-h-[200px]'>
            <div className='flex flex-col md:min-w-[700px]'>
              {notes.map((note, index) => {
                return <NoteListItem
                  key={note.id}
                  index={index + 1}
                  noteId={note.id}
                />
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteList;
