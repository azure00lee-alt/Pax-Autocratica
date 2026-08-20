import {describe, expect, it} from 'vitest';
import {getGuide, listGuides} from '@/lib/content';
import {guideSlugs} from '@/lib/guides';

describe('guide content', () => {
  it.each(['en', 'zh'] as const)('loads the %s Soldiers & Breeding guide', (locale) => {
    const guide = getGuide(locale, 'soldiers-and-breeding');
    expect(guide?.frontmatter.slug).toBe('soldiers-and-breeding');
    expect(guide?.frontmatter.order).toBe(1);
    expect(guide?.frontmatter.updated).toMatch(/^2026-08-/);
    expect(guide?.frontmatter.image).toBe('/media/pax-soldiers.jpg');
    expect(guide?.source).toContain('##');
  });

  it.each(['en', 'zh'] as const)('lists all completed %s guides in editorial order', (locale) => {
    expect(listGuides(locale)).toHaveLength(5);
    expect(listGuides(locale).map((guide) => guide.slug)).toEqual(guideSlugs);
  });

  it('returns null for an unknown guide', () => {
    expect(getGuide('en', 'unknown')).toBeNull();
  });

  it.each(['en', 'zh'] as const)('%s guide is a complete practical guide with seven core sections', (locale) => {
    const guide = getGuide(locale, 'soldiers-and-breeding')!;
    const h2Headings = guide.source.match(/^##\s+.+$/gm) ?? [];

    expect(h2Headings).toHaveLength(7);
    expect(guide.source.match(/^###\s+.+$/gm)?.length).toBeGreaterThanOrEqual(8);
    expect(guide.source).toContain('|');
    expect(guide.source).toContain('<Callout');
    expect(guide.source).toContain(`/${locale}/guides`);
    expect(guide.source).toContain('/media/pax-soldiers.jpg');
  });

  it.each([
    ['en', ['Fear', 'Happiness', 'Hunger', 'Loyalty']],
    ['zh', ['恐惧', '幸福', '饥饿', '忠诚']]
  ] as const)('%s guide covers all four soldier condition readouts', (locale, labels) => {
    const source = getGuide(locale, 'soldiers-and-breeding')!.source;
    for (const label of labels) expect(source).toContain(label);
  });

  it('keeps the English and Chinese guide structures in parity', () => {
    const en = getGuide('en', 'soldiers-and-breeding')!.source;
    const zh = getGuide('zh', 'soldiers-and-breeding')!.source;
    const structure = (source: string) => ({
      h2: source.match(/^##\s+.+$/gm)?.length,
      h3: source.match(/^###\s+.+$/gm)?.length,
      rows: source.match(/^\|.+\|$/gm)?.length,
      callouts: source.match(/<Callout/g)?.length,
      links: source.match(/\]\(/g)?.length
    });

    expect(structure(zh)).toEqual(structure(en));
  });

  it.each(guideSlugs.flatMap((slug) => [
    ['en', slug],
    ['zh', slug]
  ] as const))('%s/%s is a complete sourced guide', (locale, slug) => {
    const guide = getGuide(locale, slug);
    expect(guide, `${locale}/${slug} should exist`).not.toBeNull();
    const source = guide!.source;
    expect(guide!.frontmatter.order).toBe(guideSlugs.indexOf(slug) + 1);
    expect(source.match(/^##\s+.+$/gm)?.length).toBeGreaterThanOrEqual(7);
    expect(source.match(/^###\s+.+$/gm)?.length).toBeGreaterThanOrEqual(7);
    expect(source).toContain('|');
    expect(source.match(/<Callout/g)?.length).toBeGreaterThanOrEqual(2);
    expect(source).toContain(`/${locale}/guides`);
    expect(source.match(/https:\/\//g)?.length).toBeGreaterThanOrEqual(3);
  });

  it('uses only the approved official external sources', () => {
    for (const locale of ['en', 'zh'] as const) {
      const source = getGuide(locale, 'soldiers-and-breeding')!.source;
      const urls = [...source.matchAll(/https:\/\/[^)\s]+/g)].map((match) => match[0]);
      expect(new Set(urls)).toEqual(new Set([
        'https://www.paxautocratica.com/',
        'https://store.steampowered.com/app/1067360/Pax_Autocratica/',
        'https://steamcommunity.com/app/1067360/allnews/'
      ]));
    }
  });
});
