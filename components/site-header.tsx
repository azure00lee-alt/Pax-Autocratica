import Image from 'next/image';
import Link from 'next/link';
import {ExternalLink} from 'lucide-react';
import {LanguageSwitcher} from '@/components/language-switcher';
import {officialSteamUrl, wikiSections} from '@/lib/navigation';
import type {Locale} from '@/lib/locale';

export function SiteHeader({locale, pathname, brand}: {
  locale: Locale;
  pathname: string;
  brand: string;
}) {
  const links = wikiSections[locale].slice(0, 3);

  return <header className="site-header">
    <div className="header-inner">
      <Link className="brand-link" href={`/${locale}`} aria-label={brand}>
        <Image src="/android-chrome-192x192.png" alt="" width={40} height={40} priority />
        <span>{brand}</span>
      </Link>
      <nav className="header-nav" aria-label={locale === 'en' ? 'Primary navigation' : '主导航'}>
        {links.map((item) => 'href' in item && <Link
          key={item.href}
          href={item.href}
          aria-current={pathname === item.href ? 'page' : undefined}
        >{item.label}</Link>)}
        <a href={officialSteamUrl} target="_blank" rel="noreferrer">
          {locale === 'en' ? 'Official Steam' : 'Steam 官方页面'}
          <ExternalLink aria-hidden="true" size={16} strokeWidth={1.75} />
        </a>
      </nav>
      <LanguageSwitcher locale={locale} />
    </div>
  </header>;
}
