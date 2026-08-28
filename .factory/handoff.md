# Polish round 1 handoff — Source Trail Workbook

## Outcome

All six findings in `.factory/review-1.md` are implemented and covered by automated tests.
The earlier invalid-locator, immutable-cache, and response-header repairs remain covered by regression tests.

The product remains a static offline PWA with the original seminar-handout visual system.

## What changed

- Rewrote the first screen around the job: “Trace research claims to their sources.”
- Added the student/instructor audience, a one-click sample action, its immediate result, and three plain facts.
- Added a three-trail humanities demo at `/?demo=1` and `/demo/`.
- Isolated demo and real work under `demo:current` and `workbook:current` IndexedDB keys.
- Added a persistent demo banner, reset, exit, route history, focus, and title updates.
- Added 11 claim records with one observable Playwright test per claim.
- Tested actual JSON, CSV, citation, and template file contents.
- Added complete metadata, a 1200×630 social image, SVG favicon, 180 px touch icon, sitemap, and designed host-level 404.
- Gave landing, demo, privacy, terms, offline, and 404 pages the shared header/footer shell.
- Reworked mobile header, demo banner, workspace hierarchy, and touch layout without changing the product’s visual thesis.
- Removed slogan-first wording and jargon; `.factory/copy-audit.md` has the final counts.
- Fixed an export activation race found during this repair. JSON and text exports now download reliably instead of occasionally opening a blob document.

## Local verification

Clean clone: `/tmp/source-trail-polish-lc69BH`, commit `ed98361`.

```text
npm ci                         PASS — 60 packages, 0 vulnerabilities
npm test                       PASS — 7/7 Vitest tests
npm run build                  PASS — dist/index.html and dist/demo/index.html
npm run test:e2e               PASS — 18/18 Playwright tests
npm audit --omit=dev           PASS — 0 vulnerabilities
11 individual claim commands   PASS — each manifest command run separately
```

The production artifact measured 39.34 KB JavaScript, 17.84 KB CSS, and 62.18 KB for the mobile hero image.
JavaScript is 13.01 KB gzip and CSS is 4.55 KB gzip.

Local Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100.
FCP was 1.0 s, LCP 1.7 s, TBT 10 ms, and CLS 0.

The worker URL verifier passed root and demo with zero console errors, one `h1`, one `main`, `lang=en`, complete image alt text, and zero unlabeled buttons.
Playwright axe found zero serious or critical issues across root, demo, privacy, terms, and 404 at 390×844.

Evidence:

- `.factory/evidence/polish-1-local-root/verify.json`
- `.factory/evidence/polish-1-local-demo/verify.json`
- `.factory/evidence/polish-1-lighthouse.json`
- `.factory/evidence/polish-1-landing-mobile.png`
- `.factory/evidence/polish-1-demo-mobile.png`
- `.factory/evidence/polish-1-demo-desktop.png`
- `.factory/evidence/polish-1-404.png`

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm run test:claims
```

Every independent claim command is listed in `.factory/claims.json`.

## Known gaps

None in the reviewed scope.
