import type {Metadata} from 'next';
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import Script from 'next/script';
import {SiteShell} from '@/components/site-shell';
import {routing} from '@/i18n/routing';
import '../globals.css';

export const metadata: Metadata = {
  title: {default: 'Pax Autocratica Wiki', template: '%s | Pax Autocratica Wiki'},
  description: 'Independent Pax Autocratica guides for colony management, soldiers, breeding and survival.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [{url: '/favicon.ico'}, {url: '/favicon-32x32.png', sizes: '32x32'}],
    apple: '/apple-touch-icon.png'
  }
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}: Readonly<{
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}>) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  return <html lang={locale} suppressHydrationWarning>
    <body>
      <NextIntlClientProvider messages={await getMessages()}>
        <SiteShell locale={locale}>{children}</SiteShell>
      </NextIntlClientProvider>
      <Script async src="https://www.googletagmanager.com/gtag/js?id=G-G9PKVZB3P9" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">{`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-G9PKVZB3P9');
      `}</Script>
    </body>
  </html>;
}
