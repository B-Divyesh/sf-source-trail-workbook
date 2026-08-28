import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test('landing explains the job and opens the isolated demo in one click', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle('Source Trail Workbook — Trace claims to sources');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Trace research claims to their sources');
  await expect(page.getByText('For students and instructors who need to show how a search became a claim.')).toBeVisible();
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://source-trail-workbook.sociobot.in/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /og-source-trail\.jpg$/);

  await page.getByRole('link', { name: /Try it with sample data/i }).click();
  await expect(page).toHaveURL(/\?demo=1$/);
  await expect(page).toHaveTitle('Demo — Source Trail Workbook');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Review a completed research trail');
  await expect(page.getByText(/Demo — sample data, nothing is saved/i)).toBeVisible();
  await expect(page.getByRole('heading', { level: 2, name: '3 trails' })).toBeVisible();

  await page.goBack();
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Trace research claims to their sources');
  await expect(page.getByRole('heading', { level: 1 })).toBeFocused();
});

test('direct demo, legal, and designed not-found routes have complete shells', async ({ page }) => {
  const routes = [
    ['/demo/', 'Demo — Source Trail Workbook', 'Review a completed research trail'],
    ['/privacy/', 'Privacy — Source Trail Workbook', 'Privacy, in plain language'],
    ['/terms/', 'Terms — Source Trail Workbook', 'Use it to show your work'],
    ['/404.html', 'Page not found — Source Trail Workbook', 'This trail ends here'],
  ] as const;

  for (const [path, title, heading] of routes) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(heading);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.getByRole('link', { name: 'Privacy', exact: true }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: 'Terms', exact: true }).last()).toBeVisible();
    await expect(page.getByRole('link', { name: /Built by Param Factory/i })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveCount(1);
    await expect(page.locator('meta[property="og:title"]')).toHaveCount(1);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute('content', 'summary_large_image');
  }
});

test('landing, demo, and legal pages fit mobile and have no serious accessibility issues', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const path of ['/', '/?demo=1', '/privacy/', '/terms/', '/404.html']) {
    await page.goto(path);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
    expect(await page.locator('h1').count()).toBe(1);
    const result = await new AxeBuilder({ page }).analyze();
    expect(result.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
  }
});
