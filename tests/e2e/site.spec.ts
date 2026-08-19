import {expect, test, type Page} from '@playwright/test';

const localizedContent = {
  en: {primaryCta: 'Soldiers & Breeding', secondaryCta: 'All Guides', articleTitle: 'Soldiers & Breeding'},
  zh: {primaryCta: '士兵与繁育', secondaryCta: '全部攻略', articleTitle: '士兵与繁育'}
} as const;

function monitorRuntimeErrors(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  return () => expect(errors).toEqual([]);
}

async function expectNoForbiddenReference(page: Page) {
  await expect(page.locator('body')).not.toContainText(/VV:\s*ULTIMATUM/i);
}

test('root redirects to a supported locale and defaults to English', async ({page}) => {
  const expectNoRuntimeErrors = monitorRuntimeErrors(page);
  await page.goto('/');
  await expect(page).toHaveURL(/\/(en|zh)$/);
  await expect(page).toHaveURL(/\/en$/);
  await expectNoForbiddenReference(page);
  expectNoRuntimeErrors();
});

for (const locale of ['en', 'zh'] as const) {
  const labels = localizedContent[locale];

  test(`${locale} home exposes localized actions with correct destinations`, async ({page}) => {
    const expectNoRuntimeErrors = monitorRuntimeErrors(page);
    await page.goto(`/${locale}`);
    const main = page.locator('main');
    await expect(page.getByRole('heading', {level: 1, name: 'Pax Autocratica'})).toBeVisible();
    await expect(main.getByRole('link', {name: labels.primaryCta, exact: true})).toHaveAttribute('href', `/${locale}/guides/soldiers-and-breeding`);
    await expect(main.getByRole('link', {name: labels.secondaryCta, exact: true})).toHaveAttribute('href', `/${locale}/guides`);
    await expect(main.getByRole('link', {name: locale === 'en' ? 'View on Steam' : '前往 Steam', exact: true})).toHaveAttribute('href', /store\.steampowered\.com/);
    await expectNoForbiddenReference(page);
    expectNoRuntimeErrors();
  });

  test(`${locale} guide index renders its localized article route`, async ({page}) => {
    const expectNoRuntimeErrors = monitorRuntimeErrors(page);
    await page.goto(`/${locale}/guides`);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('main').getByRole('link', {name: new RegExp(labels.articleTitle, 'i')})).toHaveAttribute('href', `/${locale}/guides/soldiers-and-breeding`);
    await expectNoForbiddenReference(page);
    expectNoRuntimeErrors();
  });

  test(`${locale} article renders all localized MDX sections`, async ({page}) => {
    const expectNoRuntimeErrors = monitorRuntimeErrors(page);
    await page.goto(`/${locale}/guides/soldiers-and-breeding`);
    await expect(page.getByRole('heading', {level: 1, name: labels.articleTitle})).toBeVisible();
    await expect(page.locator('article h2')).toHaveCount(7);
    await expectNoForbiddenReference(page);
    expectNoRuntimeErrors();
  });
}

test('language switch preserves the article path', async ({page}) => {
  const expectNoRuntimeErrors = monitorRuntimeErrors(page);
  await page.goto('/en/guides/soldiers-and-breeding');
  await page.getByRole('link', {name: '中文'}).click();
  await expect(page).toHaveURL(/\/zh\/guides\/soldiers-and-breeding$/);
  await expectNoForbiddenReference(page);
  expectNoRuntimeErrors();
});

test('desktop shell matches the inspected header and column proportions', async ({page}) => {
  await page.setViewportSize({width: 1440, height: 1000});
  const expectNoRuntimeErrors = monitorRuntimeErrors(page);
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
      railPosition: getComputedStyle(rail).position,
      railNavigationDisplay: getComputedStyle(document.querySelector<HTMLElement>('.wiki-nav')!).display
    };
  });
  expect(geometry).toEqual({headerHeight: 64, shellWidth: 1232, mainWidth: 936, railWidth: 264, gap: 32, railPosition: 'sticky', railNavigationDisplay: 'grid'});
  expectNoRuntimeErrors();
});

test('keyboard focus, target sizing, and reduced motion remain accessible', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  await page.emulateMedia({reducedMotion: 'reduce'});
  const expectNoRuntimeErrors = monitorRuntimeErrors(page);
  await page.goto('/en');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', {name: 'Skip to content'})).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();

  const targets = [
    page.getByRole('link', {name: 'Pax Autocratica Wiki'}),
    page.getByRole('link', {name: 'EN', exact: true}),
    page.getByRole('link', {name: '中文'}),
    page.getByRole('link', {name: 'Soldiers & Breeding', exact: true}).first(),
    page.getByRole('link', {name: 'All Guides', exact: true})
  ];
  for (const target of targets) {
    const box = await target.boundingBox();
    expect(box?.height).toBeGreaterThanOrEqual(44);
    expect(box?.width).toBeGreaterThanOrEqual(44);
  }

  const motion = await page.locator('.button').first().evaluate((element) => ({
    scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
    transitionDurationSeconds: Number.parseFloat(getComputedStyle(element).transitionDuration)
  }));
  expect(motion.scrollBehavior).toBe('auto');
  expect(motion.transitionDurationSeconds).toBeLessThanOrEqual(0.00001);
  expectNoRuntimeErrors();
});

test('mobile pages expose the wiki disclosure and have no horizontal overflow', async ({page}) => {
  await page.setViewportSize({width: 390, height: 844});
  for (const path of ['/en', '/en/guides', '/en/guides/soldiers-and-breeding']) {
    const expectNoRuntimeErrors = monitorRuntimeErrors(page);
    await page.goto(path);
    const widths = await page.evaluate(() => ({scroll: document.documentElement.scrollWidth, client: document.documentElement.clientWidth}));
    expect(widths.scroll).toBeLessThanOrEqual(widths.client);

    const disclosure = page.locator('details.wiki-sidebar__desktop');
    await expect(disclosure).toBeVisible();
    const summary = page.getByText('Browse the wiki', {exact: true});
    const summaryBox = await summary.boundingBox();
    expect(summaryBox?.height).toBeGreaterThanOrEqual(44);
    await expect(disclosure).not.toHaveAttribute('open', '');
    await summary.click();
    await expect(disclosure).toHaveAttribute('open', '');
    await summary.click();
    await expect(disclosure).not.toHaveAttribute('open', '');
    expectNoRuntimeErrors();
  }
});
