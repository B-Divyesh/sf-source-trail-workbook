# Review 2 handoff — Source Trail Workbook

## Outcome

Adversarial first-read review 2 is complete. The verdict is **FAIL** with four
findings in `.factory/review-2.md`. Product code was not modified.

The live first screen, demo, real/demo isolation behavior, offline mode,
exports, accessibility baseline, routes, metadata, 404, and visual identity all
worked. The blocking issues are claims-contract completeness and the exact
README jargon regression required to be reopened from review 1.

## Verification performed

- Cold live Chromium contexts at 390 × 844 and 1440 × 900.
- Live one-click demo, realistic first screen, Reset, exit, and a stronger
  pre-existing-real-workbook isolation probe.
- Live request capture, offline reload, route crawl, metadata/404 checks, and
  axe scans of root, demo, privacy, terms, and 404.
- Fresh clone at `ae4401325c2a1c5c1b9fd86ad7cc6f68211c31b3`:
  - all 11 `.factory/claims.json` commands run separately: command PASS;
  - `npm test`: 7/7 PASS;
  - `npm run build`: PASS, `dist/` emitted;
  - `npm run test:e2e`: 18/18 PASS;
  - `npm audit --omit=dev`: 0 vulnerabilities.
- Full landing/README copy count and every earlier review/polish/handoff finding
  checked against live behavior and source.

## Remaining work

See F-2-1 through F-2-4 in `.factory/review-2.md`. In summary:

1. List and tag every current claim, and make the demo-isolation test preserve
   a real workbook created before demo entry.
2. Remove or explain the remaining README jargon, especially `IndexedDB`.
3. Correct the demo outcome sentence to say it opens one workbook with three
   completed trails.
4. Identify the external Param Factory footer link consistently on static
   routes.

## Re-run

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Then run each command in `.factory/claims.json` separately from a clean clone
and repeat the live mobile/desktop, offline, storage-isolation, route, link, and
accessibility checks.
