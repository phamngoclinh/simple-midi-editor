import React, { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import { loadSongByIdUseCase } from '../../../../../dependencies';
import { getTranslations } from 'next-intl/server';
import EventListContent from '../../../../../presentation/components/note/EventListContent';

interface EventListPageProps {
  params: Promise<{ songId: string }>;
}

async function EventListData({ songId }: { songId: string }) {
  const t = await getTranslations('EventList');
  const response = await loadSongByIdUseCase.execute(songId);

  if (!response.success) {
    return <div className="p-6 text-slate-900 dark:text-white">{t('notFound')}</div>;
  }
  return <EventListContent songId={songId} initialSong={response.data} />;
}

export default async function EventListPage({ params }: EventListPageProps) {
  const t = await getTranslations('Common');
  const { songId } = await params;

  return (
    <Suspense fallback={<div className="p-6 animate-pulse text-slate-900 dark:text-white">{t('loading')}</div>}>
      <EventListData songId={songId} />
    </Suspense>
  );
}
