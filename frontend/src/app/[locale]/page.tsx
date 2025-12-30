import React, { Suspense } from 'react';
export const dynamic = 'force-dynamic';
import HomeContent from '../../presentation/components/home/HomeContent';
import { listAllSongsUseCase } from '../../dependencies';
import { getTranslations } from 'next-intl/server';

async function HomeData() {
  const t = await getTranslations('Home');
  const response = await listAllSongsUseCase.execute({ sortBy: 'created', order: 'asc' });

  if (!response.success) {
    return <div className="p-6">{t('error')}</div>;
  }
  return <HomeContent initialSongs={response.data} />;
}

export default async function HomePage() {
  const t = await getTranslations('Home');

  return (
    <Suspense
      fallback={
        <main className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 lg:p-10">
            <div className="max-w-7xl mx-auto flex flex-col gap-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
                    {t('title')}
                  </h1>
                  <p className="text-muted-foreground text-base">{t('loading')}</p>
                </div>
              </div>
              <div className="flex animate-pulse">
                <div className="w-[320px] aspect-video bg-muted rounded-xl"></div>
              </div>
            </div>
          </div>
        </main>
      }
    >
      <HomeData />
    </Suspense>
  );
}
