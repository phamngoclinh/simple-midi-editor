import { useRef } from "react";
import { ChildFormHandles } from "../../utils/types";
import Aside from "../common/Aside";
import NoteEditForm, { NoteFormData } from "../note/NoteEditForm";
import { Song } from "../../domain/entities/Song";

interface AsideNoteFormProps {
  song: Song;
  initialNote: NoteFormData | null;
  onCancel: () => void;
  onSubmit: (note: NoteFormData) => void;
  onDelete: (id: string) => void;
}

const AsideNoteForm = ({ song, initialNote, onCancel, onSubmit, onDelete }: AsideNoteFormProps) => {
  const propertiesFormRef = useRef<ChildFormHandles>(null);

  if (!initialNote) return <></>

  return (
    <Aside
      title='Edit note'
      subTitle="Edit note details"
      actions={[
        <button
          className="flex-1 h-10 flex items-center justify-center rounded-lg border border-red-500/30 text-red-500 hover:bg-red-500/10 transition-colors font-medium"
          onClick={() => onDelete(initialNote.id as string)}
        >
          <span className="material-symbols-outlined text-lg mr-2">delete</span>
          Delete
        </button>,
        <button
          type="submit"
          className="flex-1 h-10 flex items-center justify-center bg-primary rounded-lg bg-[#282e39] text-white hover:bg-[#3b4354] transition-colors font-medium"
          onClick={() => propertiesFormRef.current?.submitForm()}
        >
          <span className="material-symbols-outlined text-lg mr-2">save</span>
          Save
        </button>
      ]}
    >
      {song
        ? <>
            <div className="flex items-center transition-colors font-medium text-white cursor-pointer" onClick={onCancel}>
              <span className="material-symbols-outlined text-lg mr-2">arrow_back</span>
              Quay lại
            </div>
            <NoteEditForm
              currentSong={song}
              initialNote={initialNote}
              onSubmit={onSubmit}
              onCancel={onCancel}
              ref={propertiesFormRef}
            />
          </>
        : <></>
      }
    </Aside>
  )
}

export default AsideNoteForm;