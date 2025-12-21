/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import NoteModalContainer from '../components/note/modal/NoteModalContainer';
import SongList from '../components/song/SongList';
import SongModalContainer from '../components/song/modal/SongModalContainer';
import useSongList from '../hooks/song/useSongList';
import useStudioAction from '../hooks/store/useStudioAction';
import { PrimaryButton } from '../components/common/Button';

const SongManagerPage: React.FC = () => {
  const { loading, loadSongs, ids } = useSongList();
  const { openCreateSongFormModal } = useStudioAction();

  useEffect(() => {
    loadSongs();
  }, [])

  return (
    <main className='flex-1 flex overflow-hidden'>
      <div className='flex-1 overflow-y-auto p-6 lg:p-10'>
        <div className='max-w-7xl mx-auto flex flex-col gap-8'>
          <div className='flex flex-col md:flex-row md:items-center justify-between gap-6'>
            <div className='flex flex-col gap-1'>
              <h1 className='text-3xl md:text-4xl font-bold tracking-tight text-slate-900 dark:text-white'>Bài hát của tôi</h1>
              <p className='text-slate-500 dark:text-[#9da6b9] text-base'>Quản lý các dự án MIDI của bạn và hiện thực hoá ý tưởng mới.</p>
            </div>
            <div className='flex items-center gap-3'>
              <PrimaryButton onClick={openCreateSongFormModal}>
                <span className='material-symbols-outlined text-[20px]'>add</span>
                <span>Tạo bài hát</span>
              </PrimaryButton>
            </div>
          </div>
          <div>
            {loading && <div className='w-[320px] group relative flex flex-col bg-white dark:bg-[#1e2430] rounded-xl border border-slate-200 dark:border-[#282e39] hover:border-primary/50 dark:hover:border-primary/50 transition-all hover:shadow-xl hover:shadow-primary/5'>
              <div className='relative aspect-video bg-[#101622] p-4 flex items-center justify-center group-hover:bg-[#151b26] transition-colors'></div>
              <div className='p-4 flex flex-col gap-3'>
                <div className='flex justify-between items-start'>
                  <div className='text-slate-900 dark:text-white font-bold text-lg leading-tight mb-1 group-hover:text-primary transition-colors'></div>
                </div>
                <div className='flex items-center gap-3 mt-1'>
                  <div className='px-2 py-1 rounded bg-slate-100 dark:bg-[#282e39] text-slate-600 dark:text-[#9da6b9] text-xs font-mono font-medium'></div>
                </div>
              </div>
            </div>}
            {!loading && <SongList ids={ids} />}
          </div>
        </div>
      </div>
      <SongModalContainer />
      <NoteModalContainer />
    </main>
  );
};

export default SongManagerPage;
