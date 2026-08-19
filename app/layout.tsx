import type {Metadata} from 'next';
import {getLocale} from 'next-intl/server';
import './globals.css';

export const metadata: Metadata = {
  title: {default: 'Pax Autocratica Wiki', template: '%s | Pax Autocratica Wiki'},
  description: 'Independent Pax Autocratica guides for colony management, soldiers, breeding and survival.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [{url: '/favicon.ico'}, {url: '/favicon-32x32.png', sizes: '32x32'}],
    apple: '/apple-touch-icon.png'
  }
};

export default async function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  const locale = await getLocale();
  return <html lang={locale} suppressHydrationWarning><body>{children}</body></html>;
}
