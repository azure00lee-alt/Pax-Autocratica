'use client';

import {usePathname} from 'next/navigation';
import {useTranslations} from 'next-intl';
import {SiteFooter} from '@/components/site-footer';
import {SiteHeader} from '@/components/site-header';
import {WikiSidebar} from '@/components/wiki-sidebar';
import type {Locale} from '@/lib/locale';

export function SiteShell({locale, children}: {locale: Locale; children: React.ReactNode}) {
  const pathname = usePathname();
  const t = useTranslations();

  return <div className="site-shell">
    <a className="skip-link" href="#main-content">{locale === 'en' ? 'Skip to content' : '跳到主要内容'}</a>
    <SiteHeader locale={locale} pathname={pathname} brand={t('brand')} />
    <div className="site-grid">
      <WikiSidebar locale={locale} pathname={pathname} />
      <main className="site-main" id="main-content" tabIndex={-1}>{children}</main>
    </div>
    <SiteFooter disclosure={t('footer.disclosure')} />
  </div>;
}
