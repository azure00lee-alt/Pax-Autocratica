import Link from 'next/link';
import {ExternalLink} from 'lucide-react';
import {officialSteamUrl, shellCopy, wikiSections} from '@/lib/navigation';
import type {Locale} from '@/lib/locale';

function WikiNavigation({locale, pathname, navigationLabel}: {locale: Locale; pathname: string; navigationLabel: string}) {
  return <nav className="wiki-nav" aria-label={navigationLabel}>
    {wikiSections[locale].map((item) =>
      <Link key={item.label} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
          <span>{item.label}</span>
        </Link>
    )}
  </nav>;
}

export function WikiSidebar({locale, pathname}: {locale: Locale; pathname: string}) {
  const copy = shellCopy[locale];
  return <aside className="wiki-sidebar">
    <section className="wiki-sidebar__desktop sidebar-card">
      <p className="sidebar-eyebrow">{copy.knowledge}</p>
      <WikiNavigation locale={locale} pathname={pathname} navigationLabel={copy.wikiNav} />
    </section>
    <details className="wiki-sidebar__mobile sidebar-card">
      <summary className="wiki-sidebar__mobile-summary">{copy.browse}</summary>
      <WikiNavigation locale={locale} pathname={pathname} navigationLabel={copy.mobileNav} />
    </details>
    <section className="sidebar-card official-card" aria-labelledby="official-game-title">
      <p className="sidebar-eyebrow">{copy.officialGame}</p>
      <h2 id="official-game-title">Pax Autocratica</h2>
      <p>{copy.officialDescription}</p>
      <a href={officialSteamUrl} target="_blank" rel="noreferrer">
        {copy.openSteam}
        <ExternalLink aria-hidden="true" size={16} strokeWidth={1.75} />
      </a>
    </section>
  </aside>;
}
