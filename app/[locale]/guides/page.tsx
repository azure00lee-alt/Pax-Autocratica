import type {Metadata} from 'next';
import {hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {Breadcrumb} from '@/components/breadcrumb';
import {Callout} from '@/components/callout';
import {GuideCard} from '@/components/guide-card';
import {MediaCard} from '@/components/media-card';
import {routing} from '@/i18n/routing';
import {listGuides} from '@/lib/content';
import {localizedAlternates} from '@/lib/guides';
import type {Locale} from '@/lib/locale';

const officialScreenshot = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1067360/794019d7a98da85f60757e6be9409dcb829881aa/ss_794019d7a98da85f60757e6be9409dcb829881aa.1920x1080.jpg';

const copy = {
  en: {breadcrumbLabel: 'Breadcrumb', home: 'Home', guides: 'Guides', title: 'Pax Autocratica Guides', description: 'Officially sourced guides for managing your colony, soldiers, production, combat, and exploration in Pax Autocratica.', mediaAlt: 'A Pax Autocratica colony', officialMedia: 'Official Steam media', noticeTitle: 'Living guide collection', noticeCopy: 'These guides are based on official material. Details can change as the game receives updates.', listTitle: 'Guides', action: 'Read guide'},
  zh: {breadcrumbLabel: '面包屑导航', home: '首页', guides: '攻略导航', title: 'Pax Autocratica 攻略', description: '基于官方资料整理的 Pax Autocratica 殖民地管理、士兵、生产、战斗与探索攻略。', mediaAlt: 'Pax Autocratica 殖民地', officialMedia: 'Steam 官方媒体', noticeTitle: '持续更新的攻略集', noticeCopy: '以下攻略基于官方资料整理；游戏更新后，部分细节可能发生变化。', listTitle: '攻略', action: '阅读攻略'},
  fr: {breadcrumbLabel: 'Fil d’Ariane', home: 'Accueil', guides: 'Guides', title: 'Guides de Pax Autocratica', description: 'Des guides fondés sur les sources officielles pour la colonie, les soldats, la production, le combat et l’exploration.', mediaAlt: 'Une colonie de Pax Autocratica', officialMedia: 'Média officiel Steam', noticeTitle: 'Collection de guides évolutive', noticeCopy: 'Ces guides reposent sur des sources officielles. Certains détails peuvent changer avec les mises à jour.', listTitle: 'Guides', action: 'Lire le guide'},
  ru: {breadcrumbLabel: 'Навигационная цепочка', home: 'Главная', guides: 'Руководства', title: 'Руководства по Pax Autocratica', description: 'Руководства на основе официальных источников о колонии, солдатах, производстве, боях и исследовании.', mediaAlt: 'Колония в Pax Autocratica', officialMedia: 'Официальные материалы Steam', noticeTitle: 'Обновляемая коллекция', noticeCopy: 'Руководства основаны на официальных материалах. После обновлений отдельные детали могут измениться.', listTitle: 'Руководства', action: 'Читать руководство'},
  de: {breadcrumbLabel: 'Brotkrümelnavigation', home: 'Startseite', guides: 'Guides', title: 'Pax Autocratica Guides', description: 'Offiziell belegte Guides zu Kolonie, Soldaten, Produktion, Kampf und Erkundung in Pax Autocratica.', mediaAlt: 'Eine Kolonie in Pax Autocratica', officialMedia: 'Offizielle Steam-Medien', noticeTitle: 'Aktuelle Guide-Sammlung', noticeCopy: 'Diese Guides beruhen auf offiziellen Quellen. Durch Spielupdates können sich einzelne Details ändern.', listTitle: 'Guides', action: 'Guide lesen'}
} satisfies Record<Locale, Record<string, string>>;

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const pageCopy = copy[locale];
  const canonical = `/${locale}/guides`;
  return {
    title: pageCopy.title,
    description: pageCopy.description,
    alternates: {canonical, languages: localizedAlternates('/guides')},
    openGraph: {title: pageCopy.title, description: pageCopy.description, url: canonical, images: [{url: officialScreenshot, alt: pageCopy.mediaAlt}]},
    twitter: {card: 'summary_large_image', title: pageCopy.title, description: pageCopy.description, images: [officialScreenshot]}
  };
}

export default async function GuidesPage({params}: PageProps) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const pageCopy = copy[locale];
  const guides = listGuides(locale);
  return <>
    <Breadcrumb label={pageCopy.breadcrumbLabel} items={[{label: pageCopy.home, href: `/${locale}`}, {label: pageCopy.guides}]} />
    <MediaCard image="/media/pax-colony.jpg" alt={pageCopy.mediaAlt} label={pageCopy.officialMedia} eager />
    <header className="page-intro"><h1>{pageCopy.title}</h1><p>{pageCopy.description}</p></header>
    <Callout type="warning" title={pageCopy.noticeTitle}>{pageCopy.noticeCopy}</Callout>
    <section aria-labelledby="guide-list-title" className="guide-grid">
      <h2 id="guide-list-title" className="section-title">{pageCopy.listTitle}</h2>
      {guides.map((guide) => <GuideCard key={guide.slug} title={guide.cardTitle} description={guide.cardDescription} href={`/${locale}/guides/${guide.slug}`} status="ready" actionLabel={pageCopy.action} />)}
    </section>
  </>;
}
