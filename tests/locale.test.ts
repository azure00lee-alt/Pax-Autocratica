import {describe, expect, it} from 'vitest';
import {isLocale, locales, switchLocalePath} from '@/lib/locale';

describe('locale helpers', () => {
  it('accepts only supported locales', () => {
    expect(locales).toEqual(['en', 'zh', 'fr', 'ru', 'de']);
    for (const locale of locales) expect(isLocale(locale)).toBe(true);
    expect(isLocale('es')).toBe(false);
    expect(isLocale('ja')).toBe(false);
  });

  it.each([
    ['/en', 'zh', '/zh'],
    ['/en/guides', 'zh', '/zh/guides'],
    ['/zh/guides/soldiers-and-breeding', 'en', '/en/guides/soldiers-and-breeding'],
    ['/zh/guides/base-and-resources', 'de', '/de/guides/base-and-resources']
  ])('switches %s to %s', (path, locale, expected) => {
    expect(switchLocalePath(path, locale as 'en' | 'zh' | 'fr' | 'ru' | 'de')).toBe(expected);
  });
});
