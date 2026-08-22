import type {MetadataRoute} from 'next';
import {guideSlugs} from '@/lib/guides';
import {locales} from '@/lib/locale';

const siteUrl = 'https://paxautocratica.pics';

export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) => [
    {url: `${siteUrl}/${locale}`},
    {url: `${siteUrl}/${locale}/guides`},
    ...guideSlugs.map((slug) => ({url: `${siteUrl}/${locale}/guides/${slug}`}))
  ]);
}
