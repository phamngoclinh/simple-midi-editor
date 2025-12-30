import type { Metadata } from 'next';
import '../globals.css';
import Providers from '../providers';
import AppLayout from '../../presentation/components/layout/AppLayout';
import NotificationManagement from '../../presentation/components/notification/NotificationManagement';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { routing } from '../../i18n/routing';
import { notFound } from 'next/navigation';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Receiving messages provided in `i18n.ts`
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
      </head>
      <body className="h-screen overflow-hidden bg-background text-foreground">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <AppLayout>{children}</AppLayout>
            <NotificationManagement />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
