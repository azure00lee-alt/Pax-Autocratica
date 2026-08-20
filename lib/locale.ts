export const locales = ['en', 'de', 'fr', 'ru', 'zh'] as const;
export type Locale = (typeof locales)[number];

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function switchLocalePath(pathname: string, locale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length && isLocale(segments[0])) segments[0] = locale;
  else segments.unshift(locale);
  return `/${segments.join('/')}`;
}
