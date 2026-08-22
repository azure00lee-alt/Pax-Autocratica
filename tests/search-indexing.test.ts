import {describe, expect, it} from 'vitest';

const expectedUrls = [
  'https://paxautocratica.pics/en',
  'https://paxautocratica.pics/en/guides',
  'https://paxautocratica.pics/en/guides/soldiers-and-breeding',
  'https://paxautocratica.pics/en/guides/base-and-resources',
  'https://paxautocratica.pics/en/guides/captives-and-conversion',
  'https://paxautocratica.pics/en/guides/weapons-and-combat',
  'https://paxautocratica.pics/en/guides/exploration-and-bosses',
  'https://paxautocratica.pics/de',
  'https://paxautocratica.pics/de/guides',
  'https://paxautocratica.pics/de/guides/soldiers-and-breeding',
  'https://paxautocratica.pics/de/guides/base-and-resources',
  'https://paxautocratica.pics/de/guides/captives-and-conversion',
  'https://paxautocratica.pics/de/guides/weapons-and-combat',
  'https://paxautocratica.pics/de/guides/exploration-and-bosses',
  'https://paxautocratica.pics/fr',
  'https://paxautocratica.pics/fr/guides',
  'https://paxautocratica.pics/fr/guides/soldiers-and-breeding',
  'https://paxautocratica.pics/fr/guides/base-and-resources',
  'https://paxautocratica.pics/fr/guides/captives-and-conversion',
  'https://paxautocratica.pics/fr/guides/weapons-and-combat',
  'https://paxautocratica.pics/fr/guides/exploration-and-bosses',
  'https://paxautocratica.pics/ru',
  'https://paxautocratica.pics/ru/guides',
  'https://paxautocratica.pics/ru/guides/soldiers-and-breeding',
  'https://paxautocratica.pics/ru/guides/base-and-resources',
  'https://paxautocratica.pics/ru/guides/captives-and-conversion',
  'https://paxautocratica.pics/ru/guides/weapons-and-combat',
  'https://paxautocratica.pics/ru/guides/exploration-and-bosses',
  'https://paxautocratica.pics/zh',
  'https://paxautocratica.pics/zh/guides',
  'https://paxautocratica.pics/zh/guides/soldiers-and-breeding',
  'https://paxautocratica.pics/zh/guides/base-and-resources',
  'https://paxautocratica.pics/zh/guides/captives-and-conversion',
  'https://paxautocratica.pics/zh/guides/weapons-and-combat',
  'https://paxautocratica.pics/zh/guides/exploration-and-bosses'
];

describe('search indexing metadata', () => {
  it('publishes every canonical localized page exactly once', async () => {
    const {default: sitemap} = await import('@/app/sitemap');
    const urls = sitemap().map((entry) => entry.url);

    expect(urls).toEqual(expectedUrls);
    expect(new Set(urls).size).toBe(35);
  });

  it('allows crawling and advertises the sitemap', async () => {
    const {default: robots} = await import('@/app/robots');

    expect(robots()).toEqual({
      rules: {userAgent: '*', allow: '/'},
      sitemap: 'https://paxautocratica.pics/sitemap.xml'
    });
  });
});
