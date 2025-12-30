'use client';

import React, { useEffect, useState } from 'react';
import useSongList from '../../hooks/song/useSongList';
import SongAggregate from '../../../domain/songAggregate/songAggregate';

interface HomeStoreHydratorProps {
  initialSongs: SongAggregate[];
  children: React.ReactNode;
}

const HomeStoreHydrator = ({ initialSongs, children }: HomeStoreHydratorProps) => {
  const { setInitialSongs } = useSongList();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setInitialSongs(initialSongs);
    setIsHydrated(true);
  }, [initialSongs, setInitialSongs]);

  if (!isHydrated) return null;

  return <>{children}</>;
};

export default HomeStoreHydrator;
