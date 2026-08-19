import Link from 'next/link';
import {ExternalLink} from 'lucide-react';
import {officialSteamUrl, wikiSections} from '@/lib/navigation';
import type {Locale} from '@/lib/locale';

function WikiNavigation({locale, pathname}: {locale: Locale; pathname: string}) {
  const navigationLabel = locale === 'en' ? 'Wiki navigation' : 'Wiki 导航';

  return <nav className="wiki-nav" aria-label={navigationLabel}>
    {wikiSections[locale].map((item) => 'href' in item
      ? <Link key={item.label} href={item.href} aria-current={pathname === item.href ? 'page' : undefined}>
          <span>{item.label}</span>
        </Link>
      : <div className="wiki-nav__planned" key={item.label} aria-disabled="true">
          <span>{item.label}</span>
          <span className="wiki-nav__count" aria-label={locale === 'en' ? `${item.count} planned` : `计划 ${item.count} 篇`}>{item.count}</span>
        </div>
    )}
  </nav>;
}

export function WikiSidebar({locale, pathname}: {locale: Locale; pathname: string}) {
  return <aside className="wiki-sidebar">
    <details className="wiki-sidebar__desktop sidebar-card" open>
      <summary className="wiki-sidebar__mobile">{locale === 'en' ? 'Browse the wiki' : '浏览 Wiki'}</summary>
      <p className="sidebar-eyebrow">{locale === 'en' ? 'Knowledge base' : '知识库'}</p>
      <WikiNavigation locale={locale} pathname={pathname} />
    </details>
    <section className="sidebar-card official-card" aria-labelledby="official-game-title">
      <p className="sidebar-eyebrow">{locale === 'en' ? 'Official game' : '官方游戏'}</p>
      <h2 id="official-game-title">Pax Autocratica</h2>
      <p>{locale === 'en' ? 'Visit the official Steam page for game updates and community news.' : '前往 Steam 官方页面查看游戏更新与社区动态。'}</p>
      <a href={officialSteamUrl} target="_blank" rel="noreferrer">
        {locale === 'en' ? 'Open Steam' : '打开 Steam'}
        <ExternalLink aria-hidden="true" size={16} strokeWidth={1.75} />
      </a>
    </section>
  </aside>;
}
