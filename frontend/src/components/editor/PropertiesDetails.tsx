import { useCallback } from "react";
import { Song } from "../../domain/entities/Song";
import useNotesManager from "../../hooks/useNotesManager";
import NoteEditForm from "../note/NoteEditForm";

interface PropertiesDetailsProps {
  currentSong: Song;
  reload: () => void;
}

const PropertiesDetails = ({ currentSong, reload }: PropertiesDetailsProps) => {
  const reloadCallback = useCallback(async () => reload(), [reload])
  const {
    initialNote,
    editingNote,
    startEditNote,
    saveNote,
    stopEditNote,
  } = useNotesManager(reloadCallback, currentSong);

  return <NoteEditForm
    currentSong={currentSong}
    initialNote={initialNote}
    onSubmit={saveNote}
    onCancel={stopEditNote}
    buttonLabel='Lưu Note'
  />
}

export default PropertiesDetails;