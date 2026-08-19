import {expect, test} from '@playwright/test';

for (const locale of ['en', 'zh']) {
  test(`${locale} home exposes the three required actions`, async ({page}) => {
    await page.goto(`/${locale}`);
    const main = page.locator('main');
    await expect(page.getByRole('heading', {level: 1, name: 'Pax Autocratica'})).toBeVisible();
    await expect(main.getByRole('link', {name: locale === 'en' ? 'Soldiers & Breeding' : '士兵与繁育', exact: true})).toBeVisible();
    await expect(main.getByRole('link', {name: locale === 'en' ? 'All Guides' : '全部攻略', exact: true})).toBeVisible();
    await expect(main.getByRole('link', {name: locale === 'en' ? 'View on Steam' : '前往 Steam', exact: true})).toHaveAttribute('href', /store\.steampowered\.com/);
  });

  test(`${locale} guide index and article render`, async ({page}) => {
    await page.goto(`/${locale}/guides`);
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('main').getByRole('link', {name: locale === 'en' ? /soldiers & breeding/i : /士兵与繁育/}).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/soldiers-and-breeding$`));
    await expect(page.locator('article h2')).toHaveCount(7);
  });
}
