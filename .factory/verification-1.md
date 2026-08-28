# Independent verification 1 — Source Trail Workbook

**Result: FAIL**

The candidate is functional and the live deployment exactly matches it, but it
does not fully meet the supplied acceptance contract. Two medium-severity
issues remain: invalid source locators can be marked review-ready, and hashed
static files are not served with long-lived immutable caching.

## Scope and environment

- Candidate tested: `758f8fc05559b02abb8d7f6ecc74ed1d4512e95e`
- Candidate repository: `B-Divyesh/sf-source-trail-workbook`, branch `main`
- Live URL: <https://source-trail-workbook.sociobot.in/>
- Verification date: 2026-08-28
- Clean checkout confirmed before installation; product source was not edited.
- Node 22.23.2, npm 10.9.8, Playwright 1.58.2 Chromium, Lighthouse 12.8.2.

## Local quality gates

All available repository checks passed from the clean candidate checkout:

```text
npm ci                         PASS — 61 packages audited, 0 vulnerabilities
npm test                       PASS — 4/4 Vitest tests
npm run build                  PASS — TypeScript no-emit check and Vite build
npm run test:e2e               PASS — 3/3 Playwright tests
npm audit --omit=dev           PASS — 0 vulnerabilities
```

There is no separate `lint` or `typecheck` script; `npm run build` performs
the repository's TypeScript type check. The production output is `dist/`.

## Product and recovery evidence

- Completed a representative humanities exercise: workbook title, research
  question, exact query and rationale, rejected result/reason, source metadata,
  credibility notes, claim, short quote, and explanation. The trail became
  **Ready to review**, had no unsupported-claim warning, autosaved, and
  persisted after reload.
- Added two further complete trails using `Ctrl+Enter`; the index showed three
  trails, **3 ready**, **0 unsupported**. CSV exported as
  `audit-workbook.csv`.
- Existing end-to-end coverage independently rerun: JSON export download,
  malformed-JSON error, 390 px overflow check, persistence, axe, and offline
  reload all passed.
- Boundary and recovery probes passed: a 950-character quote is capped and
  counted at `900/900`; imports over 5 MB report a repairable error; a 251-trail
  JSON file reports that imports are limited to 250 trails.
- Unit tests pass for template generation (question retained; student and
  trail responses cleared), citation text, CSV escaping, status calculation,
  and unrelated-JSON rejection.

## PWA, privacy, and browser checks

- The live app registered an active, controlling service worker at `/`; after
  a controlled online load, a real 390 px live offline reload showed the app
  heading and “Offline mode” with no console/page errors.
- A separate controlled service-worker update test served the production
  artifact with a changed worker cache version. The in-app “A fresh app
  version is ready” toast appeared; activating it replaced
  `source-trail-shell-v2` with `source-trail-shell-update` without errors.
- Local and live Playwright/axe checks: one `<h1>`, one `<main>`, `lang="en"`,
  zero console/page errors, and zero axe serious/critical findings.
- Keyboard probe reached a visible skip link first; computed focus outline was
  `4px solid rgb(23, 69, 209)`. At 390 px there was no horizontal overflow
  (`scrollWidth = innerWidth = 390`). Reduced-motion CSS reduced button
  transitions to `0.00001s`.
- Observed browser request origins were only the app origin, both locally and
  live. Source and deployed artifact inspection found no analytics, remote
  font, third-party runtime script, account, or workbook-upload request.
  Workbook state is in IndexedDB and export/import are local browser actions.

## Deployment identity, headers, and performance

- SHA-256 comparisons matched for the live and candidate `index.html`,
  `sw.js`, `manifest.webmanifest`, JS, CSS, icons, WebP artwork, legal pages,
  and offline page. The live asset names exactly match the Vite build.
- Live response headers: HTTPS/HSTS, `nosniff`, and
  `strict-origin-when-cross-origin` are present. The app shell and service
  worker are correctly revalidated rather than immutable.
- Initial JS is 28,857 B (9,601 B gzip), CSS 16,299 B (4,228 B gzip), and
  the mobile hero is 62,180 B: all are within the stated static/PWA budgets.
- Fresh Lighthouse mobile run against the live URL: Performance **100**,
  Accessibility **100**, Best Practices **100**, SEO **100**; FCP 1.0 s,
  LCP 1.3 s, TBT 0 ms, CLS 0.

## Defects

### M2 — Invalid locator can be labelled “Ready to review”

Reproduction: complete every required field, enter `not-a-valid-url` in
“Source URL or stable identifier,” and wait for autosave. The native URL input
reports `validity.typeMismatch === true`, but the application uses `novalidate`
and status calculation only checks for non-empty text. The trail is then shown
as **Ready to review**.

Impact: an instructor can be told a claim has an auditable source link when
the supplied URL cannot be followed. This conflicts with the product's core
claim-to-source-trail job and its invalid-input/recovery acceptance requirement.

### M2 — Hashed static assets are not long-lived immutable cached in production

Live `HEAD` requests for `/assets/index-CHKY5CAo.js`,
`/assets/index-CnujaCOE.css`, and the hashed/immutable-style hero asset return:

```text
cache-control: public, must-revalidate, max-age=30
```

They lack `immutable` and a long lifetime. This violates the stated PWA/static
performance caching policy for hashed assets. The service worker masks this on
repeat controlled loads, but HTTP caching remains incorrect when the worker is
not controlling or has been cleared.

### M3 — Deployment response-policy gaps

The live HTML response has no enforcing `Content-Security-Policy`; HSTS is only
`max-age=10886400` (below the one-year preload threshold despite advertising
`preload`); and `manifest.webmanifest` is served as
`application/octet-stream` rather than a manifest JSON media type. Current
Chromium accepts and runs the PWA, but these should be corrected at deployment.

## Acceptance conclusion

The live URL is not suffering from a byte mismatch or runtime deployment
failure: it is the requested candidate and its core workflow works. It is
nonetheless **FAIL** for this acceptance run until the two M2 issues are fixed
and reverified. No P0/P1 defects were found.
