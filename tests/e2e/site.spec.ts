import {expect, test} from '@playwright/test';

for (const locale of ['en', 'zh']) {
  test(`${locale} guide index and article render`, async ({page}) => {
    await page.goto(`/${locale}/guides`);
    await expect(page.locator('h1')).toBeVisible();
    await page.locator('main').getByRole('link', {name: locale === 'en' ? /soldiers & breeding/i : /士兵与繁育/}).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/guides/soldiers-and-breeding$`));
    await expect(page.locator('article h2')).toHaveCount(7);
  });
}
