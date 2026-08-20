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
import type {Locale} from '@/lib/locale';

const officialScreenshot = 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/1067360/794019d7a98da85f60757e6be9409dcb829881aa/ss_794019d7a98da85f60757e6be9409dcb829881aa.1920x1080.jpg';

const copy = {
  en: {
    breadcrumbLabel: 'Breadcrumb',
    home: 'Home',
    guides: 'Guides',
    title: 'Pax Autocratica Guides',
    description: 'Officially sourced guides for managing your colony, soldiers, production, and survival in Pax Autocratica.',
    mediaAlt: 'A Pax Autocratica colony',
    officialMedia: 'Official Steam media',
    earlyAccessTitle: 'Early Access information',
    earlyAccessCopy: 'Pax Autocratica is in active development. Game systems and balance may change as new updates are released.',
    guideListTitle: 'Guides',
    plannedLabel: 'Planned',
    actionLabel: 'Read guide',
    planned: [
      {title: 'States & Policies', description: 'How citizen states and government policies shape a colony.'},
      {title: 'Economy & Production', description: 'Production chains, resources, and workforce priorities.'},
      {title: 'Decrees', description: 'A practical reference for colony-wide decrees and their effects.'},
      {title: 'Troubleshooting', description: 'Common gameplay problems and officially documented solutions.'}
    ]
  },
  zh: {
    breadcrumbLabel: '面包屑导航',
    home: '首页',
    guides: '攻略导航',
    title: 'Pax Autocratica 攻略',
    description: '基于官方资料整理的 Pax Autocratica 殖民地管理、士兵、生产与生存攻略。',
    mediaAlt: 'Pax Autocratica 殖民地',
    officialMedia: 'Steam 官方媒体',
    earlyAccessTitle: '抢先体验信息',
    earlyAccessCopy: 'Pax Autocratica 仍在持续开发中。游戏系统与平衡可能会随后续更新而改变。',
    guideListTitle: '攻略',
    plannedLabel: '计划中',
    actionLabel: '阅读攻略',
    planned: [
      {title: '状态与政策', description: '了解市民状态与政府政策如何影响殖民地。'},
      {title: '经济与生产', description: '生产链、资源与劳动力优先级指南。'},
      {title: '法令', description: '殖民地全局法令及其效果的实用参考。'},
      {title: '故障解决', description: '常见游戏问题与官方资料确认的解决方法。'}
    ]
  }
} as const satisfies Record<Locale, unknown>;

type PageProps = {params: Promise<{locale: string}>};

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const pageCopy = copy[locale];
  const canonical = `/${locale}/guides`;

  return {
    title: pageCopy.title,
    description: pageCopy.description,
    alternates: {
      canonical,
      languages: {en: '/en/guides', zh: '/zh/guides'}
    },
    openGraph: {
      title: pageCopy.title,
      description: pageCopy.description,
      url: canonical,
      images: [{url: officialScreenshot, alt: pageCopy.mediaAlt}]
    },
    twitter: {
      card: 'summary_large_image',
      title: pageCopy.title,
      description: pageCopy.description,
      images: [officialScreenshot]
    }
  };
}

export default async function GuidesPage({params}: PageProps) {
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const pageCopy = copy[locale];
  const guides = listGuides(locale);

  return <>
    <Breadcrumb label={pageCopy.breadcrumbLabel} items={[
      {label: pageCopy.home, href: `/${locale}`},
      {label: pageCopy.guides}
    ]} />
    <MediaCard image="/media/pax-colony.jpg" alt={pageCopy.mediaAlt} label={pageCopy.officialMedia} eager />
    <header className="page-intro">
      <h1>{pageCopy.title}</h1>
      <p>{pageCopy.description}</p>
    </header>
    <Callout type="warning" title={pageCopy.earlyAccessTitle}>{pageCopy.earlyAccessCopy}</Callout>
    <section aria-labelledby="guide-list-title" className="guide-grid">
      <h2 id="guide-list-title" className="section-title">{pageCopy.guideListTitle}</h2>
      {guides.map((guide) => <GuideCard
        key={guide.slug}
        title={guide.cardTitle}
        description={guide.cardDescription}
        href={`/${locale}/guides/${guide.slug}`}
        status="ready"
        statusLabel={pageCopy.plannedLabel}
        actionLabel={pageCopy.actionLabel}
      />)}
      {pageCopy.planned.map((guide) => <GuideCard
        key={guide.title}
        title={guide.title}
        description={guide.description}
        status="planned"
        statusLabel={pageCopy.plannedLabel}
        actionLabel={pageCopy.actionLabel}
      />)}
    </section>
  </>;
}
