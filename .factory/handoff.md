# Polish 2 handoff — Source Trail Workbook

## Outcome

Perfection-loop round 2 is complete. Every finding in review 1, polish 1, and
review 2 is closed. The repaired static PWA is live at
<https://source-trail-workbook.sociobot.in/>.

- Repair commit: `439717b` (`fix: close cumulative review findings`)
- Azure Static Web Apps deployment: `4b926fcf-f6bd-4fe2-a136-172550aae73a`
- Artifact class remains `pwa-offline`; build output remains `dist/`.
- The seminar-handout visual system, generated paper-trail art, palette, type,
  and interaction grammar are unchanged.

## What changed

- Corrected the first action’s result to promise one sample workbook with three
  completed trails; the demo heading now states the same count.
- Strengthened demo isolation testing so a named real workbook exists before
  demo entry and is verified unchanged after demo edit, reset, and exit.
- Expanded `.factory/claims.json` to 19 claims and added exactly one tagged test
  per claim. A unit contract rejects duplicate, missing, and orphan tags.
- Added observable coverage for the complete source-trail workflow, import
  confirmation and cancellation, conditional install, artwork origin, browser
  storage deletion, build output, deployment policy, and designed 404.
- Rewrote README storage and deployment language without internal storage keys,
  unexplained browser terms, or hosting acronyms.
- Made the external Param Factory footer label visible and consistent on every
  static and app-rendered route.
- Added an optional `PLAYWRIGHT_BASE_URL` test setting so the same browser suite
  can verify the deployed product without starting a local server.
- Updated the release marker to `v1.2.0 · polish 2`, the service-worker cache to
  v5, the install start URL version, the catalog description, and copy audit.

## Exact verification

Fresh clone of `439717b` at `/tmp/source-trail-polish-2-clean-WGnrBW`:

```text
npm ci                  PASS — 60 packages installed; 0 vulnerabilities
npm test                PASS — 3 files, 9 tests
npm run build           PASS — TypeScript + Vite; dist/index.html emitted
npm run test:e2e        PASS — 27/27 Chromium tests
npm audit --omit=dev    PASS — 0 vulnerabilities
```

Every `test` command in `.factory/claims.json` was then executed separately in
that clone: **19/19 passed**. This includes real-before-demo isolation, offline
reload, same-origin request capture, all downloads, import replacement,
keyboard actions, status validation, install prompting, provenance, host
policy, 404 mapping, and build output.

Production verification after deployment:

```text
PLAYWRIGHT_BASE_URL=https://source-trail-workbook.sociobot.in npx playwright test
PASS — 27/27

/opt/fleet/lib/verify-url.sh root
PASS — title, lang=en, one h1, main, alt text, labels, zero console/page errors

/opt/fleet/lib/verify-url.sh ?demo=1
PASS — demo title, one h1, main, labels, zero console/page errors
```

- Unknown route: HTTP 404 with the designed “This trail ends here” page.
- Route crawl: root, demo, privacy, terms, favicon, touch icon, social image,
  robots, and sitemap all returned 200.
- Headers: self-only CSP, one-year preload HSTS, `nosniff`, strict referrer
  policy, restrictive permissions, manifest JSON type, and immutable hashed
  assets all present.
- SHA-256: live bytes matched `dist/` for root, demo, service worker, manifest,
  legal pages, 404, JavaScript, and CSS.
- Axe: zero serious or critical findings across five routes at 390 px.
- Mobile: no horizontal overflow at 390 × 844; route focus, skip link, and
  reduced-motion behavior passed.
- Offline: controlled demo and blank landing both reloaded offline; demo sample
  and browser edits remained available.
- Privacy: all observed requests were same-origin; no workbook text appeared in
  a request body; no external runtime scripts, fonts, analytics, or account flow.

## Performance and artifact sizes

- Local Lighthouse: Performance 100, Accessibility 100, Best Practices 100,
  SEO 100; FCP 1.0 s, LCP 1.8 s, TBT 50 ms, CLS 0.
- Live Lighthouse: 100/100/100/100; FCP 0.9 s, LCP 1.3 s, TBT 0 ms, CLS 0.
- Initial JavaScript: 39,457 B raw / 13,007 B gzip.
- CSS: 17,842 B raw / 4,579 B gzip.
- Mobile hero: 62,180 B.

Evidence is in `.factory/evidence/polish-2-*`. The finding-by-finding map is in
`.factory/polish-2.md`.

## Run and verify

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm run test:claims
PLAYWRIGHT_BASE_URL=https://source-trail-workbook.sociobot.in npx playwright test
```

## Known gaps and next steps

None. No review finding, deferred minor item, placeholder, or TODO remains.
