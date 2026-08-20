import type {Metadata} from 'next';
import {hasLocale} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';
import {MDXRemote} from 'next-mdx-remote/rsc';
import {Breadcrumb} from '@/components/breadcrumb';
import remarkGfm from 'remark-gfm';
import {mdxComponents} from '@/components/mdx-components';
import {MediaCard} from '@/components/media-card';
import {routing} from '@/i18n/routing';
import {getGuide} from '@/lib/content';
import {guideSlugs, localizedAlternates} from '@/lib/guides';
import type {Locale} from '@/lib/locale';

const officialScreenshot = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1067360/6cd6758be1fe8edaf3775b2261fc6d6eb29782b3/ss_6cd6758be1fe8edaf3775b2261fc6d6eb29782b3.1920x1080.jpg';

const copy = {
  en: {breadcrumbLabel: 'Breadcrumb', home: 'Home', guides: 'Guides', updated: 'Updated'},
  zh: {breadcrumbLabel: '面包屑导航', home: '首页', guides: '攻略导航', updated: '更新日期'},
  fr: {breadcrumbLabel: 'Fil d’Ariane', home: 'Accueil', guides: 'Guides', updated: 'Mis à jour'},
  ru: {breadcrumbLabel: 'Навигационная цепочка', home: 'Главная', guides: 'Руководства', updated: 'Обновлено'},
  de: {breadcrumbLabel: 'Brotkrümelnavigation', home: 'Startseite', guides: 'Guides', updated: 'Aktualisiert'}
} satisfies Record<Locale, Record<string, string>>;

type PageProps = {params: Promise<{locale: string; slug: string}>};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => guideSlugs.map((slug) => ({locale, slug})));
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale, slug: guideSlug} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const guide = getGuide(locale, guideSlug);
  if (!guide) return {};
  const canonical = `/${locale}/guides/${guideSlug}`;

  return {
    title: guide.frontmatter.title,
    description: guide.frontmatter.description,
    alternates: {
      canonical,
      languages: localizedAlternates(`/guides/${guideSlug}`)
    },
    openGraph: {
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      url: canonical,
      images: [{url: officialScreenshot, alt: guide.frontmatter.imageAlt}]
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.frontmatter.title,
      description: guide.frontmatter.description,
      images: [officialScreenshot]
    }
  };
}

export default async function GuidePage({params}: PageProps) {
  const {locale, slug: guideSlug} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const guide = getGuide(locale, guideSlug);
  if (!guide) notFound();
  const pageCopy = copy[locale];

  return <article className="article">
    <Breadcrumb label={pageCopy.breadcrumbLabel} items={[
      {label: pageCopy.home, href: `/${locale}`},
      {label: pageCopy.guides, href: `/${locale}/guides`},
      {label: guide.frontmatter.cardTitle}
    ]} />
    <header className="article-hero">
      <h1>{guide.frontmatter.title}</h1>
      <p>{guide.frontmatter.description}</p>
      <time dateTime={guide.frontmatter.updated}>{pageCopy.updated}: {guide.frontmatter.updated}</time>
    </header>
    <MediaCard image={guide.frontmatter.image} alt={guide.frontmatter.imageAlt} label={guide.frontmatter.sourceLabel} eager />
    <div className="mdx-body">
      <MDXRemote
        source={guide.source}
        components={mdxComponents}
        options={{mdxOptions: {remarkPlugins: [remarkGfm]}}}
      />
    </div>
  </article>;
}
