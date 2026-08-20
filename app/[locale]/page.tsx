import type {Metadata} from 'next';
import Link from 'next/link';
import {hasLocale} from 'next-intl';
import {getTranslations, setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {GuideCard} from '@/components/guide-card';
import {MediaCard} from '@/components/media-card';
import {routing} from '@/i18n/routing';
import {listGuides} from '@/lib/content';
import {localizedAlternates} from '@/lib/guides';
import {officialSteamUrl} from '@/lib/navigation';

const officialSiteUrl = 'https://www.paxautocratica.com/';
const officialHeaderUrl = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1067360/d492e901f3aec578ea3b3fc45c25f09784313d8c/header.jpg';

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({locale, namespace: 'Home'});
  const canonical = `/${locale}`;

  return {
    title: 'Pax Autocratica',
    description: t('hero.description'),
    alternates: {
      canonical,
      languages: localizedAlternates()
    },
    openGraph: {
      title: 'Pax Autocratica',
      description: t('hero.description'),
      url: canonical,
      images: [{url: officialHeaderUrl, alt: t('about.mediaAlt')}]
    }
  };
}

export default async function HomePage({params}: PageProps) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations('Home');
  const stats = t.raw('hero.stats') as string[];
  const guides = listGuides(locale);

  return <>
    <section className="home-hero">
      <span className="eyebrow">{t('hero.eyebrow')}</span>
      <h1>Pax Autocratica</h1>
      <p className="hero-copy">{t('hero.description')}</p>
      <div className="stat-pills">
        {stats.map((stat) => <span key={stat}>{stat}</span>)}
      </div>
      <div className="hero-actions">
        <Link className="button button--primary" href={`/${locale}/guides/soldiers-and-breeding`}>{t('hero.primaryCta')}</Link>
        <Link className="button" href={`/${locale}/guides`}>{t('hero.secondaryCta')}</Link>
        <a className="button" href={officialSteamUrl} target="_blank" rel="noreferrer">{t('hero.tertiaryCta')}</a>
      </div>
    </section>

    <section className="home-split" aria-label={t('start.regionLabel')}>
      <div className="panel">
        <span className="panel-index">01</span>
        <h2>{t('start.title')}</h2>
        <p>{t('start.description')}</p>
      </div>
      <div className="panel">
        <span className="panel-index">02</span>
        <h2>{t('updates.title')}</h2>
        <p>{t('updates.description')}</p>
      </div>
    </section>

    <section className="popular-guides" aria-labelledby="popular-guides-title">
      <h2 id="popular-guides-title" className="section-title">{t('popular.title')}</h2>
      {guides.map((guide) => <GuideCard
        key={guide.slug}
        title={guide.cardTitle}
        description={guide.cardDescription}
        href={`/${locale}/guides/${guide.slug}`}
        status="ready"
        actionLabel={t('popular.actionLabel')}
      />)}
    </section>

    <section className="about-game" aria-labelledby="about-game-title">
      <div className="about-game__copy">
        <span className="eyebrow">{t('about.eyebrow')}</span>
        <h2 id="about-game-title">{t('about.title')}</h2>
        <p>{t('about.description')}</p>
        <a href={officialSiteUrl} target="_blank" rel="noreferrer">{t('about.officialAction')}</a>
      </div>
      <MediaCard image="/media/pax-header.jpg" alt={t('about.mediaAlt')} label={t('about.mediaLabel')} />
    </section>

    <section className="faq" aria-labelledby="faq-title">
      <h2 id="faq-title">{t('faq.title')}</h2>
      <details>
        <summary>{t('faq.question')}</summary>
        <p>{t('faq.answer')}</p>
      </details>
    </section>

    <section className="final-cta">
      <p className="eyebrow">{t('finalCta.eyebrow')}</p>
      <h2>{t('finalCta.title')}</h2>
      <Link className="button button--primary" href={`/${locale}/guides`}>{t('finalCta.action')}</Link>
    </section>
  </>;
}
