import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type StaticWebAppConfig = {
  globalHeaders: Record<string, string>;
  routes: Array<{ route: string; headers: Record<string, string> }>;
  mimeTypes: Record<string, string>;
  responseOverrides: Record<string, { rewrite: string; statusCode: number }>;
};

const configPath = resolve(import.meta.dirname, '../public/staticwebapp.config.json');

async function deploymentPolicy(): Promise<StaticWebAppConfig> {
  return JSON.parse(await readFile(configPath, 'utf8')) as StaticWebAppConfig;
}

describe('Azure Static Web Apps response policy', () => {
  it('keeps content-addressed assets immutable and the service worker revalidated', async () => {
    const config = await deploymentPolicy();
    const assetRoute = config.routes.find((route) => route.route === '/assets/*');
    const serviceWorkerRoute = config.routes.find((route) => route.route === '/sw.js');

    expect(assetRoute?.headers['cache-control']).toBe('public, max-age=31536000, immutable');
    expect(serviceWorkerRoute?.headers['cache-control']).toBe('no-cache, no-store, must-revalidate');
  });

  it('ships the required browser response protections and manifest type', async () => {
    const config = await deploymentPolicy();

    expect(config.globalHeaders['content-security-policy']).toContain("default-src 'self'");
    expect(config.globalHeaders['strict-transport-security']).toContain('max-age=31536000');
    expect(config.mimeTypes['.webmanifest']).toBe('application/manifest+json');
    expect(config.responseOverrides['404']).toEqual({ rewrite: '/404.html', statusCode: 404 });
  });
});
