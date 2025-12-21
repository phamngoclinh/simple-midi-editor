import React from 'react';
import useStudioAction from '../../hooks/store/useStudioAction';
import SongListItem from './SongListItem';

interface SongListProps {
  ids: string[]
}

const SongList: React.FC<SongListProps> = ({ ids }) => {
  const { openCreateSongFormModal } = useStudioAction();
  
  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6'>
      {ids.map(id => <SongListItem key={id} id={id} />)}

      {ids.length === 0 && <button onClick={openCreateSongFormModal} className='group flex flex-col items-center justify-center bg-transparent border-2 border-dashed border-slate-300 dark:border-[#282e39] rounded-xl overflow-hidden hover:border-primary hover:bg-primary/5 transition-all aspect-[4/3] sm:aspect-auto'>
        <div className='flex flex-col items-center gap-3 p-8'>
          <div className='size-14 rounded-full bg-slate-100 dark:bg-[#1e2430] group-hover:bg-primary text-slate-400 dark:text-[#637083] group-hover:text-white flex items-center justify-center transition-colors'>
            <span className='material-symbols-outlined text-[32px]'>add</span>
          </div>
          <p className='text-slate-500 dark:text-[#9da6b9] group-hover:text-primary font-bold text-lg transition-colors'>Tạo bài hát mới</p>
        </div>
      </button>}
      
    </div>
  )
};

export default SongList;
