'use client';

import React, { useEffect, useState } from 'react';
import useSong from '../../hooks/song/useSong';
import SongAggregate from '../../../domain/songAggregate/songAggregate';

interface EditorStoreHydratorProps {
  songId: string;
  initialSong: SongAggregate;
  children: React.ReactNode;
}

const EditorStoreHydrator = ({ songId, initialSong, children }: EditorStoreHydratorProps) => {
  const { setInitialSong } = useSong({ id: songId });
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (initialSong) {
      setInitialSong(initialSong);
      setIsHydrated(true);
    }
  }, [initialSong, setInitialSong]);

  if (!isHydrated) return null;

  return <>{children}</>;
};

export default EditorStoreHydrator;
