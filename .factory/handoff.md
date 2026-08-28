# Source Trail Workbook — repair handoff

Work order: `source-trail-workbook-repair-1`
Base independently verified: `758f8fc05559b02abb8d7f6ecc74ed1d4512e95e`
Repair base: `500379f603d5b5fc5b7ebe3cef6a3683ac30aed8`
Deployment: Azure Static Web Apps static artifact (`dist/`)
Repair commits: `e759c15`, `3a3ee38`
Final Azure deployment: `0f465acf-acde-4f5e-8223-13711ad10021`

## Repair completed

- **Invalid locator could become “Ready to review” (M2):** readiness now
  requires a trimmed, complete `http` or `https` URL with a hostname. A malformed
  value remains **Needs evidence**, gets `aria-invalid`, and has a visible,
  repairable message. A persistent identifier can be supplied as its HTTPS
  resolver URL (for example `https://doi.org/...`).
- **Immutable static caching absent in production (M2):** hero assets now use
  content-addressed filenames and `public/staticwebapp.config.json` applies
  `cache-control: public, max-age=31536000, immutable` to `/assets/*` on Azure
  Static Web Apps. HTML and the manifest revalidate; `sw.js` is explicitly
  `no-cache, no-store, must-revalidate`.
- **Response-policy follow-ups (M3):** the same Azure configuration supplies a
  self-only enforcing CSP, one-year HSTS with subdomains/preload, `nosniff`, a
  restrictive Permissions Policy, and
  `application/manifest+json` for `.webmanifest`.
- The service-worker cache names and manifest start URL were advanced to v3/v2
  so the new shell and fingerprinted hero asset are adopted by an existing
  installation.

## Regression coverage

- `tests/model.test.ts` verifies that `not-a-valid-url` cannot produce the
  review-ready status, while an HTTPS DOI resolver can.
- `tests/e2e/workbook.spec.ts` reproduces the verifier’s browser case: native
  URL `typeMismatch`, **Needs evidence**, accessible recovery text, then a
  valid URL restoring **Ready to review**. It also asserts the dynamic
  `aria-invalid="true"` state and its removal after repair.
- `tests/deployment-policy.test.ts` locks the Azure immutable-asset,
  revalidated-service-worker, CSP, HSTS, and manifest media-type configuration.

## Verification performed locally (2026-08-28)

```text
npm ci                         PASS — 61 packages audited, 0 vulnerabilities
npm test                       PASS — 7/7 Vitest tests
npm run build                  PASS — TypeScript no-emit + Vite production build
npm run test:e2e               PASS — 4/4 Playwright tests
npm audit --omit=dev           PASS — 0 known vulnerabilities
```

- `verify-url.sh` against the built artifact: HTTP 200, 535 ms load, no
  console/page errors, title present, `lang="en"`, one `<h1>`, `<main>`, zero
  missing image alt attributes, and zero unlabeled buttons.
- Desktop browser smoke check: visible skip link is first keyboard focus;
  no horizontal overflow, no console errors, and only the local app origin was
  requested. The 390 × 844 browser check also had no overflow.
- Offline PWA check at 390 px: after service-worker control and then offline
  reload, the app heading, “Offline mode”, and a controlled worker were all
  present. The existing Playwright suite also runs axe with zero
  serious/critical violations on the completed workbook workflow.
- Lighthouse 13 local production-artifact report: Performance **100**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s, LCP
  1.7 s, TBT 0 ms, CLS 0. (The CLI emitted a tab-crash notice while closing,
  but wrote the complete scored JSON report.)
- Production budget from the final build: JS 29.71 kB / 9.91 kB gzip, CSS
  16.49 kB / 4.28 kB gzip; mobile hero remains 62,180 B. No separate lint
  script exists; the build runs the repository TypeScript check.

## Live deployment verification (2026-08-28)

- The live page references final `assets/index-DpOqpYg7.js`. Desktop browser
  verification reproduced the malformed URL case: native `typeMismatch` and
  `aria-invalid="true"` alongside **Needs evidence**; replacing it with an
  HTTPS DOI resolver produced **Ready to review**. There were zero console or
  page errors and axe found zero serious/critical violations.
- Keyboard check: the skip link is first focus and has a `4px solid` cobalt
  focus outline. Desktop and 390 × 844 mobile both had no horizontal overflow.
  Browser request origins were only `https://source-trail-workbook.sociobot.in`.
- The deployed PWA controlled the page and successfully reloaded offline at
  390 px with the workbook heading and “Offline mode” present.
- Response policy is live: asset JS and WebP return
  `public, max-age=31536000, immutable`; HTML and manifest return
  `public, max-age=0, must-revalidate`; `sw.js` returns
  `no-cache, no-store, must-revalidate`. The manifest is
  `application/manifest+json`; CSP is enforcing; HSTS is
  `max-age=31536000; includeSubDomains; preload`.

## Run and deploy

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Deploy `dist/` through the configured Azure Static Web Apps pipeline. The
response policy is shipped in `dist/staticwebapp.config.json`; do not strip it
from the artifact.

## Known limits

- Citation output remains explicitly a basic draft; students must check it
  against their course style guide.
- One workbook is stored per browser/device. JSON export/import is the
  supported archive and transfer path; cloud sync remains out of scope.
