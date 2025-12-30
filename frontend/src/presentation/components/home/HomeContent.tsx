'use client';

import React from 'react';
import NoteModalContainer from '../note/modal/NoteModalContainer';
import SongList from '../song/SongList';
import SongModalContainer from '../song/modal/SongModalContainer';
import SongAggregate from '../../../domain/songAggregate/songAggregate';
import HomeStoreHydrator from './HomeStoreHydrator';
import HomeActions from './HomeActions';
import { useTranslations } from 'next-intl';

interface HomeContentProps {
  initialSongs: SongAggregate[];
}

const HomeContent: React.FC<HomeContentProps> = ({ initialSongs }) => {
  const t = useTranslations('Home');

  return (
    <main className="flex-1 flex overflow-hidden">
      <HomeStoreHydrator initialSongs={initialSongs}>
        <div className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="max-w-7xl mx-auto flex flex-col gap-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex flex-col gap-1">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                  {t('title')}
                </h1>
                <p className="text-muted-foreground text-base">{t('description')}</p>
              </div>
              <HomeActions />
            </div>
            <div>
              <SongList />
            </div>
          </div>
        </div>
        <SongModalContainer />
        <NoteModalContainer />
      </HomeStoreHydrator>
    </main>
  );
};

export default HomeContent;
