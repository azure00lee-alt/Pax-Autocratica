import Link from 'next/link';
import {officialSteamUrl, officialWebsiteUrl} from '@/lib/navigation';
import type {Locale} from '@/lib/locale';

const labels = {
  en: {home: 'Home', guides: 'Guides', article: 'Soldiers & Breeding', website: 'Official website', steam: 'Official Steam'},
  zh: {home: '首页', guides: '攻略导航', article: '士兵与繁育', website: '官方网站', steam: 'Steam 官方页面'}
} as const;

export function SiteFooter({locale, disclosure}: {locale: Locale; disclosure: string}) {
  const copy = labels[locale];
  return <footer className="site-footer">
    <p>{disclosure}</p>
    <nav className="footer-links" aria-label={locale === 'en' ? 'Footer navigation' : '页脚导航'}>
      <Link href={`/${locale}`}>{copy.home}</Link>
      <Link href={`/${locale}/guides`}>{copy.guides}</Link>
      <Link href={`/${locale}/guides/soldiers-and-breeding`}>{copy.article}</Link>
      <a href={officialWebsiteUrl} target="_blank" rel="noreferrer">{copy.website}</a>
      <a href={officialSteamUrl} target="_blank" rel="noreferrer">{copy.steam}</a>
    </nav>
  </footer>;
}
