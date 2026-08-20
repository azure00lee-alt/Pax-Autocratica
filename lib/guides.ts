import {locales, type Locale} from '@/lib/locale';

export const guideSlugs = [
  'soldiers-and-breeding',
  'base-and-resources',
  'captives-and-conversion',
  'weapons-and-combat',
  'exploration-and-bosses'
] as const;

export type GuideSlug = (typeof guideSlugs)[number];

export function guidePath(locale: Locale, slug: GuideSlug): string {
  return `/${locale}/guides/${slug}`;
}

export function localizedAlternates(pathWithoutLocale = ''): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, `/${locale}${pathWithoutLocale}`])
  ) as Record<Locale, string>;
}
