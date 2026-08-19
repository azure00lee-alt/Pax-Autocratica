import {describe, expect, it} from 'vitest';
import {isLocale, switchLocalePath} from '@/lib/locale';

describe('locale helpers', () => {
  it('accepts only supported locales', () => {
    expect(isLocale('en')).toBe(true);
    expect(isLocale('zh')).toBe(true);
    expect(isLocale('fr')).toBe(false);
  });

  it.each([
    ['/en', 'zh', '/zh'],
    ['/en/guides', 'zh', '/zh/guides'],
    ['/zh/guides/soldiers-and-breeding', 'en', '/en/guides/soldiers-and-breeding']
  ])('switches %s to %s', (path, locale, expected) => {
    expect(switchLocalePath(path, locale as 'en' | 'zh')).toBe(expected);
  });
});
