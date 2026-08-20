import {expect, test, type Page} from '@playwright/test';

const locales = ['en', 'zh', 'fr', 'ru', 'de'] as const;
const guideSlugs = [
  'soldiers-and-breeding',
  'base-and-resources',
  'captives-and-conversion',
  'weapons-and-combat',
  'exploration-and-bosses'
] as const;

function monitorRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return () => expect(errors).toEqual([]);
}

test('root redirects to the English home page', async ({page}) => {
  await page.goto('/');
  await expect(page).toHaveURL(/\/en$/);
});

test('localized pages expose the installable web app manifest', async ({page}) => {
  await page.goto('/de');
  await expect(page.locator('link[rel="manifest"]')).toHaveAttribute('href', '/site.webmanifest');
});

for (const locale of locales) {
  test(`${locale} serves the home, index, and all five guide pages`, async ({page}) => {
    const expectNoRuntimeErrors = monitorRuntimeErrors(page);
    const paths = [
      `/${locale}`,
      `/${locale}/guides`,
      ...guideSlugs.map((slug) => `/${locale}/guides/${slug}`)
    ];

    for (const path of paths) {
      const response = await page.goto(path);
      expect(response?.status(), path).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('main h1')).toBeVisible();
      await expect(page.locator('main .guide-card--planned')).toHaveCount(0);
    }
    expectNoRuntimeErrors();
  });
}

test('each guide index links to all five localized articles', async ({page}) => {
  for (const locale of locales) {
    await page.goto(`/${locale}/guides`);
    for (const slug of guideSlugs) {
      await expect(page.locator(`main a[href="/${locale}/guides/${slug}"]`)).toHaveCount(1);
    }
  }
});

test('language switch preserves a deep guide path', async ({page}) => {
  await page.goto('/zh/guides/weapons-and-combat');
  await page.getByRole('combobox', {name: '语言选择'}).selectOption('de');
  await expect(page).toHaveURL(/\/de\/guides\/weapons-and-combat$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
});

test('desktop shell keeps its header and column proportions', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  await page.goto('/en/guides');
  const geometry = await page.evaluate(() => {
    const header = document.querySelector<HTMLElement>('.site-header')!;
    const shell = document.querySelector<HTMLElement>('.site-grid')!;
    const main = document.querySelector<HTMLElement>('.site-main')!;
    const rail = document.querySelector<HTMLElement>('.wiki-sidebar')!;
    return {
      headerHeight: header.getBoundingClientRect().height,
      shellWidth: shell.getBoundingClientRect().width,
      mainWidth: main.getBoundingClientRect().width,
      railWidth: rail.getBoundingClientRect().width,
      gap: rail.getBoundingClientRect().left - main.getBoundingClientRect().right,
      railPosition: getComputedStyle(rail).position
    };
  });
  expect(geometry).toEqual({headerHeight: 64, shellWidth: 1232, mainWidth: 936, railWidth: 264, gap: 32, railPosition: 'sticky'});
  await expect(page.getByRole('navigation', {name: 'Wiki navigation'}).getByRole('link')).toHaveCount(7);
});

test('mobile page types in every locale have no horizontal overflow', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const locale of locales) {
    for (const path of [`/${locale}`, `/${locale}/guides`, `/${locale}/guides/exploration-and-bosses`]) {
      await page.goto(path);
      const widths = await page.evaluate(() => ({scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth}));
      expect(widths.scroll, path).toBeLessThanOrEqual(widths.client);
      await expect(page.locator('details.wiki-sidebar__mobile')).toBeVisible();
    }
  }
});

test('keyboard skip link and language selector remain accessible', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.goto('/zh/guides/soldiers-and-breeding');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: '跳到主要内容'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  const selector = page.getByRole('combobox', {name: '语言选择'});
  await expect(selector).toBeVisible();
  await expect(selector.locator('option')).toHaveCount(5);
  const box = await selector.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect(box?.width).toBeGreaterThanOrEqual(44);
});
