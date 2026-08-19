import type {Metadata} from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {default: 'Pax Autocratica Wiki', template: '%s | Pax Autocratica Wiki'},
  description: 'Independent Pax Autocratica guides for colony management, soldiers, breeding and survival.',
  icons: {
    icon: [{url: '/favicon.ico'}, {url: '/favicon-32x32.png', sizes: '32x32'}],
    apple: '/apple-touch-icon.png'
  }
};

export default function RootLayout({children}: Readonly<{children: React.ReactNode}>) {
  return <html suppressHydrationWarning><body>{children}</body></html>;
}
