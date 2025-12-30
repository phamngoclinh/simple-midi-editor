'use client';

import React from 'react';
import useSongList from '../../hooks/song/useSongList';
import useStudioAction from '../../hooks/store/useStudioAction';
import SongListItem from './SongListItem';

const SongList: React.FC = () => {
  const { openCreateSongFormModal } = useStudioAction();
  const { ids } = useSongList();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6">
      {ids.map(id => (
        <SongListItem key={id} id={id} />
      ))}

      {ids.length === 0 && (
        <button
          onClick={openCreateSongFormModal}
          className="group flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-border-dark rounded-xl overflow-hidden hover:border-primary hover:bg-primary/5 transition-all aspect-[4/3] sm:aspect-auto"
        >
          <div className="flex flex-col items-center gap-3 p-8">
            <div className="size-14 rounded-full bg-surface-input group-hover:bg-primary text-text-subtle group-hover:text-white flex items-center justify-center transition-colors">
              <span className="material-symbols-outlined text-[32px]">add</span>
            </div>
            <p className="text-text-subtle group-hover:text-primary font-bold text-lg transition-colors">
              Tạo bài hát mới
            </p>
          </div>
        </button>
      )}
    </div>
  );
};

export default SongList;
