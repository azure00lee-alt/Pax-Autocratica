import Link from 'next/link';
import {officialSteamUrl, officialWebsiteUrl, shellCopy, wikiSections} from '@/lib/navigation';
import type {Locale} from '@/lib/locale';

export function SiteFooter({locale, disclosure}: {locale: Locale; disclosure: string}) {
  const copy = shellCopy[locale];
  return <footer className="site-footer">
    <p>{disclosure}</p>
    <nav className="footer-links" aria-label={copy.footerNav}>
      {wikiSections[locale].map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}
      <a href={officialWebsiteUrl} target="_blank" rel="noreferrer">{copy.officialWebsite}</a>
      <a href={officialSteamUrl} target="_blank" rel="noreferrer">{copy.officialSteam}</a>
    </nav>
  </footer>;
}
