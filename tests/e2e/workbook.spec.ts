import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => new Promise<void>((resolve) => {
    const request = indexedDB.deleteDatabase('source-trail-workbook');
    request.onsuccess = () => resolve();
    request.onerror = () => resolve();
    request.onblocked = () => resolve();
  }));
  await page.reload();
});

test('builds a complete auditable trail and keeps it after reload', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()); });

  await page.getByRole('button', { name: /start a workbook/i }).click();
  await page.getByLabel('Workbook title').fill('Philosophy source audit');
  await page.getByLabel('Research question').fill('How do Stoic writers frame grief?');
  await page.getByLabel('Exact search query').fill('Seneca grief consolation primary source');
  await page.getByLabel('Source title').fill('Moral Letters to Lucilius');
  await page.getByLabel('Source URL or stable identifier').fill('https://example.edu/seneca');
  await page.getByLabel('Who made it—and what qualifies them?').fill('A university classics collection with named editors.');
  await page.getByLabel('Your claim').fill('Seneca frames grief as a practice shaped by social duty.');
  await page.getByLabel('Short quotation or paraphrase').fill('A short excerpt about mourning and duty.');
  await page.getByLabel('Explain the connection').fill('The passage treats mourning as conduct that can be evaluated, which supports the claim.');

  await expect(page.getByText('Ready to review', { exact: true }).first()).toBeVisible();
  await page.waitForTimeout(650);
  await page.reload();
  await page.getByRole('button', { name: /continue workbook/i }).click();
  await expect(page.getByLabel('Research question')).toHaveValue('How do Stoic writers frame grief?');
  await expect(page.getByLabel('Your claim')).toHaveValue(/Seneca frames grief/);
  expect(errors).toEqual([]);

  const accessibility = await new AxeBuilder({ page }).analyze();
  expect(accessibility.violations.filter((item) => ['serious', 'critical'].includes(item.impact ?? ''))).toEqual([]);
});

test('exports JSON and reports an invalid import', async ({ page }) => {
  await page.getByRole('button', { name: /start a workbook/i }).click();
  await page.getByLabel('Workbook title').fill('Export test');
  await page.getByText('Export', { exact: true }).click();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Workbook JSON', exact: true }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('export-test.json');

  await page.getByRole('button', { name: 'Close' }).click();
  await page.getByRole('button', { name: 'Import JSON' }).click();
  await page.locator('#import-file').setInputFiles({ name: 'broken.json', mimeType: 'application/json', buffer: Buffer.from('{bad') });
  await expect(page.getByText(/not valid JSON/i)).toBeVisible();
});

test('fits a 390px viewport and reloads while offline', async ({ page, context }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Source Trail Workbook' })).toBeVisible();
  await expect(page.getByText(/offline mode/i)).toBeVisible();
  await context.setOffline(false);
});
