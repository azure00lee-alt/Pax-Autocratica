import {describe, expect, it} from 'vitest';
import {guidePath, guideSlugs, localizedAlternates} from '@/lib/guides';

describe('guide routes', () => {
  it('keeps the approved guide order', () => {
    expect(guideSlugs).toEqual([
      'soldiers-and-breeding',
      'base-and-resources',
      'captives-and-conversion',
      'weapons-and-combat',
      'exploration-and-bosses'
    ]);
  });

  it('builds a localized guide route', () => {
    expect(guidePath('de', 'weapons-and-combat')).toBe('/de/guides/weapons-and-combat');
  });

  it('builds all five language alternates', () => {
    expect(localizedAlternates('/guides')).toEqual({
      en: '/en/guides',
      zh: '/zh/guides',
      fr: '/fr/guides',
      ru: '/ru/guides',
      de: '/de/guides'
    });
  });
});
