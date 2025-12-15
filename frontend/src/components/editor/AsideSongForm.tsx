import { useRef } from "react";
import { Song } from "../../domain/entities/Song";
import useSongManager from "../../hooks/useSongManager";
import { ChildFormHandles } from "../../utils/types";
import Aside from "../common/Aside";
import SongForm from "../song/SongForm";

interface AsideSongFormProps {
  song: Song;
}

const AsideSongForm = ({ song }: AsideSongFormProps) => {
  const propertiesFormRef = useRef<ChildFormHandles>(null);
  const { editSong, exportSong } = useSongManager();

  if (!song) return <></>;

  return (
    <Aside
      title='Edit song'
      subTitle="Edit song details"
      actions={[
        <button
          className="flex-1 h-10 flex items-center justify-center rounded-lg border border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10 transition-colors font-medium"
          onClick={() => exportSong(song)}
        >
          <span className="material-symbols-outlined text-lg mr-2">arrow_downward</span>
          Export
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
      <SongForm
        initialSong={song}
        onSubmit={async (songData) => editSong(song.id as string, songData)}
        ref={propertiesFormRef}
      />
    </Aside>
  )
}

export default AsideSongForm;