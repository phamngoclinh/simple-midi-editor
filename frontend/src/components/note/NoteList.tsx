/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import { Note } from '../../domain/entities/Note';
import { toMMSS } from '../../utils/helper';
import DropdownMenu from '../common/DropdownMenu';

// Định nghĩa Props
interface NoteListProps {
  notes: Note[];
  onEditNote: (note: Note) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<boolean>;
}

const NoteList: React.FC<NoteListProps> = ({
  notes,
  onEditNote,
  onDeleteNote
}) => {
  const [noteList, setNoteList] = useState<Note[]>(notes);
  const handleDelete = useCallback(async (noteId: string) => {
    const result = await onDeleteNote(noteId);
    if (result) {
      setNoteList(prev => prev.filter(n => n.id !== noteId));
    }
  }, [])

  const handleEdit = useCallback(async (note: Note) => {
    await onEditNote(note);
  }, [])

  return (
    <div>
      {noteList.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>Chưa có Notes nào trong bài hát này.</p>
      ) : (
        <>
          <div className="hidden md:grid md:grid-cols-[20px_80px_60px_70px_50px_80px_1fr_50px] gap-4 px-6 py-3 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#151921] text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 items-center sticky top-0 z-0">
            <div className="flex justify-center">#</div>
            <div>Time</div>
            <div>Track</div>
            <div>Color</div>
            <div>Icon</div>
            <div>Title</div>
            <div className="hidden md:block">Description</div>
            <div className="text-right">Action</div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden min-h-[200px]">
            <div className="flex flex-col md:min-w-[700px]">
              {notes.map((note, index) => {
                return (
                  <div key={note.id} className="group grid grid-cols-[150px_1fr] md:grid-cols-[20px_80px_60px_70px_50px_80px_1fr_50px] gap-4 px-6 py-3 border-b border-slate-200 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-[#1c1f27] items-center transition-colors cursor-pointer">
                    <div className="flex md:hidden">#</div>
                    <div className="text-slate-400 dark:text-slate-500 font-mono">{index + 1}</div>
                    <div className="flex md:hidden">Time</div>
                    <div className="text-slate-400 dark:text-slate-500 font-mono">{toMMSS(note.time)}</div>
                    <div className="flex md:hidden">Track</div>
                    <div className="text-slate-400 dark:text-slate-500 font-mono">{note.track}</div>
                    <div className="flex md:hidden">Color</div>
                    <div className="flex items-center gap-3">
                      <div className={`size-2 rounded-full bg-[${note.color}]`}></div>
                      <span className="truncate text-slate-400 dark:text-slate-500 font-mono">{note.color}</span>
                    </div>
                    <div className="flex md:hidden">Icon</div>
                    <div className="flex items-center gap-3">
                      {note.icon && <span className="material-symbols-outlined">{note.icon === 'none' ? 'deselect' : note.icon}</span>}
                    </div>
                    <div className="flex md:hidden">Title</div>
                    <div className="truncate text-slate-400 dark:text-slate-500 font-mono" title={note.title}>{note.title}</div>
                    <div className="flex md:hidden">Description</div>
                    <div className="truncate text-slate-400 dark:text-slate-500 font-mono" title={note.description}>{note.description || '-'}</div>
                    <div className="flex md:hidden">Action</div>
                    <div className="text-slate-400 dark:text-slate-500 font-mono">
                      <DropdownMenu
                        items={[
                          {
                            label: "Sửa",
                            onClick: () => handleEdit(note),
                            icon: <span className="material-symbols-outlined text-[20px]">edit</span>,
                          },
                          {
                            label: "Xóa",
                            onClick: () => handleDelete(note.id!),
                            icon: <span className="material-symbols-outlined text-[20px]">delete</span>,
                            isDestructive: true,
                          },
                        ]}
                        triggerIcon={<span
                          className="p-1.5 rounded hover:bg-slate-200 dark:hover:bg-border-dark text-slate-500 hover:text-primary">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </span>}
                        align="right"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NoteList;
