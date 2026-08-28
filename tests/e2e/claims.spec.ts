import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';

async function clearStorage(page: import('@playwright/test').Page): Promise<void> {
  await page.goto('/');
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      const request = indexedDB.deleteDatabase('source-trail-workbook');
      request.onsuccess = () => resolve();
      request.onerror = () => resolve();
      request.onblocked = () => resolve();
    });
    localStorage.clear();
    sessionStorage.clear();
  });
}

test.beforeEach(async ({ page }) => {
  await clearStorage(page);
  await page.goto('/?demo=1');
  await expect(page.getByText(/Demo — sample data, nothing is saved/i)).toBeVisible();
});

test('@claim:free-use completes the core workflow without an account or payment step', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Create a blank workbook' }).click();
  await page.getByLabel('Research question').fill('What changed in the public sphere?');
  await page.getByText('Export', { exact: true }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Workbook JSON', exact: true }).click();
  await pending;
  await expect(page.getByRole('link', { name: /sign in|subscribe|pay/i })).toHaveCount(0);
  expect(requests.every((url) => !/billing|checkout|login|oauth/i.test(url))).toBe(true);
});

test('@claim:demo-isolation resets sample data and keeps real work separate', async ({ page }) => {
  await expect(page.getByLabel('Workbook title')).toHaveValue('Coffeehouses and the public sphere');
  await page.getByLabel('Workbook title').fill('Changed demo title');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Workbook title')).toHaveValue('Coffeehouses and the public sphere');

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Trace research claims to their sources' })).toBeVisible();
  await page.getByRole('button', { name: 'Create a blank workbook' }).click();
  await expect(page.getByLabel('Workbook title')).toHaveValue('My research workbook');
  const keys = await page.evaluate(async () => new Promise<IDBValidKey[]>((resolve, reject) => {
    const request = indexedDB.open('source-trail-workbook', 1);
    request.onsuccess = () => {
      const db = request.result;
      const keysRequest = db.transaction('workbooks').objectStore('workbooks').getAllKeys();
      keysRequest.onsuccess = () => { resolve(keysRequest.result); db.close(); };
      keysRequest.onerror = () => reject(keysRequest.error);
    };
    request.onerror = () => reject(request.error);
  }));
  expect(keys).toContain('workbook:current');
  expect(keys).not.toContain('demo:current');
});

test('@claim:json-export downloads all sample trails as JSON', async ({ page }) => {
  await page.getByText('Export', { exact: true }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Workbook JSON', exact: true }).click();
  const download = await pending;
  const path = await download.path();
  expect(path).not.toBeNull();
  const data = JSON.parse(await readFile(path!, 'utf8'));
  expect(data.workbook.trails).toHaveLength(3);
  expect(data.workbook.trails.every((trail: { claim: string; sourceUrl: string }) => trail.claim && trail.sourceUrl)).toBe(true);
});

test('@claim:csv-export downloads one CSV row per sample trail', async ({ page }) => {
  await page.getByText('Export', { exact: true }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Trail table CSV', exact: true }).click();
  const download = await pending;
  const csv = await readFile((await download.path())!, 'utf8');
  expect(csv.split('\r\n')).toHaveLength(4);
  expect(csv).toContain('label,query,searchLocation');
  expect(csv).toContain('Coffeehouse discussion');
});

test('@claim:citation-export downloads draft citations for every sample source', async ({ page }) => {
  await page.getByText('Export', { exact: true }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Citations text', exact: true }).click();
  const download = await pending;
  const citations = await readFile((await download.path())!, 'utf8');
  expect(citations).toContain('draft citations — verify against your course guide');
  expect(citations).toContain('The Structural Transformation of the Public Sphere');
  expect(citations).toContain('The Spectator, No. 49');
  expect(citations).toContain('The Social Life of Coffee');
});

test('@claim:template-roundtrip exports and imports a response-free assignment', async ({ page }) => {
  await page.getByText('Export', { exact: true }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Blank template JSON', exact: true }).click();
  const download = await pending;
  const path = (await download.path())!;
  const template = JSON.parse(await readFile(path, 'utf8'));
  expect(template.workbook.researchQuestion).toContain('coffeehouses');
  expect(template.workbook.studentName).toBe('');
  expect(template.workbook.trails).toHaveLength(1);
  expect(template.workbook.trails[0].claim).toBe('');

  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Import JSON' }).click();
  await page.locator('#import-file').setInputFiles(path);
  await expect(page.getByLabel('Research question')).toHaveValue(/coffeehouses shape public debate/i);
  await expect(page.getByLabel('Student name')).toHaveValue('');
  await expect(page.getByLabel('Your claim')).toHaveValue('');
});

test('@claim:offline-reload keeps the sample available offline after one visit', async ({ page, context }) => {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Review a completed research trail' })).toBeVisible();
  await expect(page.getByText(/Offline mode/i)).toBeVisible();
  await expect(page.getByLabel('Workbook title')).toHaveValue('Coffeehouses and the public sphere');
  await context.setOffline(false);
});

test('@claim:local-persistence restores a saved browser edit after reload', async ({ page }) => {
  await page.getByLabel('Workbook title').fill('My edited demo workbook');
  await expect(page.locator('#save-state')).toContainText('Saved locally');
  await page.reload();
  await expect(page.getByLabel('Workbook title')).toHaveValue('My edited demo workbook');
});

test('@claim:privacy-local makes only same-origin requests and uploads no workbook text', async ({ page }) => {
  const observed: Array<{ url: string; body: string | null }> = [];
  page.on('request', (request) => observed.push({ url: request.url(), body: request.postData() }));
  await page.reload();
  const privateText = 'PRIVATE-WORKBOOK-CONTENT-9f3a';
  await page.getByLabel('Research question').fill(privateText);
  await page.getByText('Export', { exact: true }).click();
  const pending = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Workbook JSON', exact: true }).click();
  await pending;
  expect(observed.length).toBeGreaterThan(0);
  expect(observed.every(({ url }) => new URL(url).origin === new URL(page.url()).origin)).toBe(true);
  expect(observed.every(({ url }) => !/analytics|telemetry|tracking|pixel/i.test(new URL(url).pathname))).toBe(true);
  expect(observed.every(({ body }) => !body?.includes(privateText))).toBe(true);
  const scriptOrigins = await page.locator('script[src]').evaluateAll((scripts) => scripts.map((script) => new URL((script as HTMLScriptElement).src).origin));
  expect(scriptOrigins.every((origin) => origin === new URL(page.url()).origin)).toBe(true);
});

test('@claim:keyboard-workflow saves and adds a trail with documented shortcuts', async ({ page }) => {
  await page.keyboard.press('Control+s');
  await expect(page.locator('#live-region')).toContainText('Workbook saved locally');
  await page.keyboard.press('Control+Enter');
  await expect(page.getByRole('heading', { level: 2, name: '4 trails' })).toBeVisible();
  await expect(page.getByLabel('Short label for this trail')).toBeFocused();
});

test('@claim:status-evaluation updates readiness and explains an invalid source URL', async ({ page }) => {
  await expect(page.locator('#ready-count')).toHaveText('3');
  await page.getByLabel('Source URL or stable identifier').fill('not-a-valid-url');
  await expect(page.locator('.sheet-state')).toContainText('Needs evidence');
  await expect(page.getByText(/cannot be marked ready until the link works/i)).toBeVisible();
  await expect(page.getByLabel('Source URL or stable identifier')).toHaveAttribute('aria-invalid', 'true');
});
