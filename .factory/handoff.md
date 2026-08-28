# Review 1 handoff — Source Trail Workbook

## What was done

Completed an adversarial first-read review of the live deployment at desktop and
390 px mobile. No product code was modified. The review is recorded in
.factory/review-1.md.

## Verification performed

- Loaded the site in fresh Playwright contexts at 390×844 and 1440×900.
- Checked first-screen copy, headers, metadata, links, /demo, ?demo=1, legal
  routes, an arbitrary unknown route, robots.txt, sitemap.xml, and favicon
  availability.
- Confirmed npm ci, npm test (7 tests), npm run build, and npm run test:e2e
  (4 tests) pass locally.
- Read all earlier factory review/polish/handoff/verification records. Prior
  invalid-URL and deployment-cache/header findings remain fixed.

## Result and remaining work

**FAIL.** Blocking findings remain: the first screen does not identify the
audience or a clear result, the required isolated sample demo is absent,
.factory/claims.json and tagged claim tests are absent, and /demo plus a product
404 are absent. Major/minor metadata, skeleton, and copy findings are listed
with exact remedies in .factory/review-1.md.

## Re-run

~~~sh
npm ci
npm test
npm run build
npm run test:e2e
~~~

Then rerun the live-browser checks and every command in the future
.factory/claims.json from a fresh demo context.
