import {describe, expect, it} from 'vitest';
import {getGuide, listGuides} from '@/lib/content';

describe('guide content', () => {
  it.each(['en', 'zh'] as const)('loads the %s Soldiers & Breeding guide', (locale) => {
    const guide = getGuide(locale, 'soldiers-and-breeding');
    expect(guide?.frontmatter.slug).toBe('soldiers-and-breeding');
    expect(guide?.frontmatter.updated).toMatch(/^2026-08-/);
    expect(guide?.frontmatter.image).toBe('/media/pax-soldiers.jpg');
    expect(guide?.source).toContain('##');
  });

  it.each(['en', 'zh'] as const)('lists exactly one completed %s guide', (locale) => {
    expect(listGuides(locale)).toHaveLength(1);
  });

  it('returns null for an unknown guide', () => {
    expect(getGuide('en', 'unknown')).toBeNull();
  });
});
