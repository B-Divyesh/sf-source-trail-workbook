import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type Claim = {
  id: string;
  claim: string;
  where: string;
  test: string;
  sandbox: string;
};

async function claims(): Promise<Claim[]> {
  return JSON.parse(await readFile(resolve(import.meta.dirname, '../.factory/claims.json'), 'utf8')) as Claim[];
}

describe('claims contract', () => {
  it('gives every claim one unique tagged browser test and a clean-state command', async () => {
    const manifest = await claims();
    const specification = await readFile(resolve(import.meta.dirname, 'e2e/claims.spec.ts'), 'utf8');
    const ids = manifest.map(({ id }) => id);

    expect(new Set(ids).size).toBe(ids.length);
    expect(manifest.length).toBeGreaterThan(0);

    for (const entry of manifest) {
      expect(entry.claim.trim().length).toBeGreaterThan(0);
      expect(entry.where.trim().length).toBeGreaterThan(0);
      expect(entry.sandbox).toMatch(/fresh|clean/);
      expect(entry.test).toBe(`npm run test:claims -- --grep @claim:${entry.id}`);
      expect(specification.match(new RegExp(`@claim:${entry.id}(?![a-z0-9-])`, 'g')) ?? []).toHaveLength(1);
    }

    const taggedIds = [...specification.matchAll(/@claim:([a-z0-9-]+)/g)].map((match) => match[1]);
    expect(taggedIds.sort()).toEqual([...ids].sort());
  });

  it('keeps the catalog line verb-first and within 120 characters', async () => {
    const description = (await readFile(resolve(import.meta.dirname, '../.factory/catalog-description.txt'), 'utf8')).trim();
    expect(description.length).toBeLessThanOrEqual(120);
    expect(description).toMatch(/^(Trace|Record|Check|Connect|Build|Review)\b/);
  });
});
