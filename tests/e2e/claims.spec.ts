import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
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
  const license = await readFile(resolve('LICENSE'), 'utf8');
  expect(license).toContain('Permission is hereby granted, free of charge');
  expect(license).toContain('without restriction');
});

test('@claim:demo-isolation opens three sample trails, resets them, and preserves existing real work', async ({ page }) => {
  await expect(page.getByLabel('Workbook title')).toHaveValue('Coffeehouses and the public sphere');
  await expect(page.getByRole('heading', { level: 2, name: '3 trails' })).toBeVisible();
  await expect(page.locator('#ready-count')).toHaveText('3');

  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Create a blank workbook' }).click();
  await page.getByLabel('Workbook title').fill('REAL WORKBOOK MUST SURVIVE');
  await expect(page.locator('#save-state')).toContainText('Saved locally');
  await page.getByRole('link', { name: 'Demo', exact: true }).click();

  await page.getByLabel('Workbook title').fill('Changed demo title');
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Workbook title')).toHaveValue('Coffeehouses and the public sphere');

  await page.getByRole('button', { name: 'Start for real' }).click();
  await expect(page).toHaveURL('/');
  await expect(page.getByRole('heading', { level: 1, name: 'Trace research claims to their sources' })).toBeVisible();
  await page.getByRole('button', { name: 'Continue your workbook' }).click();
  await expect(page.getByLabel('Workbook title')).toHaveValue('REAL WORKBOOK MUST SURVIVE');
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

test('@claim:core-workflow records a complete search-to-claim trail and marks it ready', async ({ page }) => {
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Create a blank workbook' }).click();
  await page.getByLabel('Research question').fill('How did pamphlets affect public debate?');
  await page.getByLabel('Exact search query').fill('eighteenth century pamphlets public debate archive');
  await page.getByLabel('Where did you search?').fill('University archive catalog');
  await page.getByLabel('Why this wording?').fill('Added archive to find primary-source collections.');
  await page.getByLabel('Result title or URL').fill('General history blog');
  await page.getByLabel('Why did you pass it over?').fill('It did not name its sources.');
  await page.getByLabel('Source title').fill('Pamphlets and Public Opinion');
  await page.getByLabel('Source URL or stable identifier').fill('https://example.edu/archive/pamphlets');
  await page.getByLabel('Who made it—and what qualifies them?').fill('A university archive with named curators.');
  await page.getByLabel('What evidence, method, or editorial process supports it?').fill('The catalog describes dated pamphlets and their collection history.');
  await page.getByLabel('What perspective, gap, or limitation matters?').fill('The surviving collection favors printed urban debate.');
  await page.getByLabel('Your claim').fill('Pamphlets carried political arguments beyond formal institutions.');
  await page.getByLabel('Short quotation or paraphrase').fill('The collection circulated arguments among urban readers.');
  await page.getByLabel('Explain the connection').fill('The dated collection connects printed arguments with readers outside Parliament.');

  await expect(page.locator('.sheet-state')).toContainText('Ready to review');
  await expect(page.locator('#ready-count')).toHaveText('1');
  await expect(page.getByLabel('Result title or URL')).toHaveValue('General history blog');
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

test('@claim:json-import-replacement asks before replacing a saved workbook', async ({ page }) => {
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Create a blank workbook' }).click();
  await page.getByLabel('Workbook title').fill('Keep this workbook');
  await expect(page.locator('#save-state')).toContainText('Saved locally');
  await page.getByRole('button', { name: 'Close' }).click();

  const imported = {
    workbook: {
      kind: 'source-trail-workbook', schemaVersion: 1, id: 'imported-workbook',
      title: 'Confirmed import', studentName: '', course: '', researchQuestion: 'Imported question',
      assignmentNotes: '', citationStyle: 'MLA', trails: [], history: [],
      createdAt: '2026-08-28T00:00:00.000Z', updatedAt: '2026-08-28T00:00:00.000Z',
    },
  };
  const file = { name: 'confirmed-import.json', mimeType: 'application/json', buffer: Buffer.from(JSON.stringify(imported)) };

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('replace the workbook currently stored');
    await dialog.dismiss();
  });
  await page.getByRole('button', { name: 'Import JSON' }).click();
  await page.locator('#import-file').setInputFiles(file);
  await page.getByRole('button', { name: 'Continue your workbook' }).click();
  await expect(page.getByLabel('Workbook title')).toHaveValue('Keep this workbook');
  await page.getByRole('button', { name: 'Close' }).click();

  page.once('dialog', async (dialog) => {
    expect(dialog.message()).toContain('replace the workbook currently stored');
    await dialog.accept();
  });
  await page.getByRole('button', { name: 'Import JSON' }).click();
  await page.locator('#import-file').setInputFiles(file);
  await expect(page.getByLabel('Workbook title')).toHaveValue('Confirmed import');
  await expect(page.getByLabel('Research question')).toHaveValue('Imported question');
});

test('@claim:offline-reload keeps the sample available offline after one visit', async ({ page, context }) => {
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload();
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByRole('heading', { level: 1, name: 'Review three completed research trails' })).toBeVisible();
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

test('@claim:storage-deletion removes saved work when browser site data is cleared', async ({ page }) => {
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.getByRole('button', { name: 'Create a blank workbook' }).click();
  await page.getByLabel('Workbook title').fill('Delete with site data');
  await expect(page.locator('#save-state')).toContainText('Saved locally');
  await page.getByRole('button', { name: 'Close' }).click();
  await page.evaluate(async () => {
    await new Promise<void>((resolveDelete) => {
      const request = indexedDB.deleteDatabase('source-trail-workbook');
      request.onsuccess = () => resolveDelete();
      request.onerror = () => resolveDelete();
      request.onblocked = () => resolveDelete();
    });
  });
  await page.reload();
  await expect(page.getByRole('button', { name: 'Create a blank workbook' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continue your workbook' })).toHaveCount(0);
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

test('@claim:install-action offers install only when the browser permits it', async ({ page }) => {
  await page.getByRole('button', { name: 'Start for real' }).click();
  await page.evaluate(() => {
    (window as unknown as { installPromptCalls: number }).installPromptCalls = 0;
    const event = new Event('beforeinstallprompt', { cancelable: true });
    Object.defineProperties(event, {
      prompt: { value: async () => { (window as unknown as { installPromptCalls: number }).installPromptCalls += 1; } },
      userChoice: { value: Promise.resolve({ outcome: 'accepted' }) },
    });
    window.dispatchEvent(event);
  });
  const install = page.getByRole('button', { name: 'Install app' });
  await expect(install).toBeVisible();
  await install.click();
  expect(await page.evaluate(() => (window as unknown as { installPromptCalls: number }).installPromptCalls)).toBe(1);
  await expect(install).toBeHidden();
});

test('@claim:hero-provenance serves the documented original generated artwork', async ({ page }) => {
  await page.getByRole('button', { name: 'Start for real' }).click();
  const image = page.getByRole('img', { name: /Five torn paper notes connected by blue arrows/i });
  await expect(image).toBeVisible();
  const response = await page.request.get(await image.getAttribute('src') ?? '');
  expect(response.ok()).toBe(true);
  expect((await response.body()).byteLength).toBeGreaterThan(50_000);

  const provenance = JSON.parse(await readFile(resolve('assets/src/research-trail-hero.prompt.json'), 'utf8'));
  expect(provenance.deployment).toBe('factory-image');
  expect(provenance.prompt).toContain('auditable research trail');
  expect(provenance.review).toContain('Selected');
  expect((await stat(resolve('assets/src/research-trail-hero.png'))).size).toBeGreaterThan(100_000);
});

test('@claim:deployment-policy defines long-lived assets, secure responses, and update checks', async () => {
  const config = JSON.parse(await readFile(resolve('public/staticwebapp.config.json'), 'utf8'));
  expect(config.routes.find((route: { route: string }) => route.route === '/assets/*').headers['cache-control'])
    .toBe('public, max-age=31536000, immutable');
  expect(config.routes.find((route: { route: string }) => route.route === '/sw.js').headers['cache-control'])
    .toBe('no-cache, no-store, must-revalidate');
  expect(config.globalHeaders['content-security-policy']).toContain("default-src 'self'");
  expect(config.globalHeaders['strict-transport-security']).toContain('max-age=31536000');
});

test('@claim:designed-404 maps missing routes to the product not-found page', async ({ page }) => {
  const config = JSON.parse(await readFile(resolve('public/staticwebapp.config.json'), 'utf8'));
  expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  await page.goto('/404.html');
  await expect(page).toHaveTitle('Page not found — Source Trail Workbook');
  await expect(page.getByRole('heading', { level: 1, name: 'This trail ends here' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the workbook' })).toHaveAttribute('href', '/');
});

test('@claim:build-output emits a deployable dist site with an index document', async () => {
  const index = await readFile(resolve('dist/index.html'), 'utf8');
  expect(index).toContain('<!doctype html>');
  expect(index).toMatch(/\/assets\/main-[A-Za-z0-9_-]+\.js/);
  expect((await stat(resolve('dist/staticwebapp.config.json'))).size).toBeGreaterThan(100);
});
