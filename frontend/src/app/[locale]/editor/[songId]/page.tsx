import React, { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import EditorContent from '../../../../presentation/components/editor/EditorContent';
import { loadSongByIdUseCase } from '../../../../dependencies';
import { getTranslations } from 'next-intl/server';

interface EditorPageProps {
  params: Promise<{ songId: string }>;
}

async function EditorData({ songId }: { songId: string }) {
  const t = await getTranslations('Editor');
  const response = await loadSongByIdUseCase.execute(songId);

  if (!response.success) {
    return <div className="p-6">{t('notFound')}</div>;
  }
  return <EditorContent songId={songId} initialSong={response.data} />;
}

export default async function EditorPage({ params }: EditorPageProps) {
  const t = await getTranslations('Editor');
  const { songId } = await params;

  return (
    <Suspense fallback={<div className="p-6 animate-pulse">{t('loading')}</div>}>
      <EditorData songId={songId} />
    </Suspense>
  );
}
