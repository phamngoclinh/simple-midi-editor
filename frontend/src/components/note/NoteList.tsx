/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from 'react';
import { listNotesInSongUseCase } from '../../dependencies';
import { Note } from '../../domain/entities/Note';
import { Song } from '../../domain/entities/Song';
import { toMMSS } from '../../utils/helper';
import DropdownMenu from '../common/DropdownMenu';

// Định nghĩa Props
interface NoteListProps {
  songId: string;
  currentSong: Song;
  onEditNote: (note: Note) => void;
  onDeleteNote: (noteId: string) => Promise<boolean>;
}

const NoteList: React.FC<NoteListProps> = ({
  songId,
  onEditNote,
  onDeleteNote
}) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotes = await listNotesInSongUseCase.execute(songId);
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Lỗi khi tải Notes:", err);
      setError("Không thể tải danh sách Notes.");
    } finally {
      setLoading(false);
    }
  }, [songId]);

  const handleDelete = useCallback(async (noteId: string) => {
    const result = await onDeleteNote(noteId);
    if (result) {
      setNotes(prev => prev.filter(n => n.id !== noteId));
    }
  }, [])

  useEffect(() => {
    loadNotes();
  }, []);

  if (loading) return <div>Đang tải Notes...</div>;
  if (error) return <div style={{ color: 'red' }}>Lỗi: {error}</div>;

  return (
    <div>
      {notes.length === 0 ? (
        <p style={{ fontStyle: 'italic' }}>Chưa có Notes nào trong bài hát này.</p>
      ) : (
        <>
          <div className="grid grid-cols-[48px_1fr_1fr_1fr_2fr_1fr] md:grid-cols-[48px_1.5fr_1fr_1fr_2.5fr_2fr_1fr] gap-4 px-6 py-3 border-b border-slate-200 dark:border-border-dark bg-slate-50 dark:bg-[#151921] text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 items-center sticky top-0 z-0">
            <div className="flex justify-center">#</div>
            <div>Start Time</div>
            <div>Title</div>
            <div>Color</div>
            <div>Icon</div>
            <div className="hidden md:block">Meta / Description</div>
            <div className="text-right">Action</div>
          </div>
          <div className="flex-1 overflow-y-auto overflow-x-hidden">
            <div className="flex flex-col min-w-[700px]">
              {notes.map((note, index) => {
                return (
                  <div key={note.id} className="group grid grid-cols-[48px_1fr_1fr_1fr_2fr_1fr] md:grid-cols-[48px_1.5fr_1fr_1fr_2.5fr_2fr_1fr] gap-4 px-6 py-3 border-b border-slate-200 dark:border-border-dark hover:bg-slate-100 dark:hover:bg-[#1c1f27] items-center transition-colors cursor-pointer text-sm">
                    <div className="flex justify-center text-slate-400 dark:text-slate-500 font-mono">{index + 1}</div>
                    <div className="font-mono text-slate-600 dark:text-slate-300">{toMMSS(note.time)}</div>
                    <div className="flex items-center gap-2">
                      <span
                        className="w-8 h-6 flex items-center justify-center font-bold text-slate-700 dark:text-slate-300 font-mono">{note.title}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className={`size-2 rounded-full bg-[${note.color}]`}></div>
                      <span className="truncate font-medium text-slate-700 dark:text-slate-200">{note.color}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        {note.icon && <span className="material-symbols-outlined">{note.icon}</span>}
                    </div>
                    <div className="hidden md:block truncate text-slate-500 dark:text-slate-400">{note.description || '-'}</div>
                    <div className="flex justify-end opacity-50 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu
                        items={[
                          {
                            label: "Sửa",
                            onClick: () => onEditNote(note),
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
