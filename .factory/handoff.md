# Source Trail Workbook — build handoff

Work order: `source-trail-workbook-build-1`

Completed: 2026-08-28

Deploy: static `dist/`

## What shipped

- A complete local-first workbook for search decisions, rejected results,
  source metadata, credibility notes, claims, short quotations/paraphrases, and
  claim-to-evidence explanations.
- Automatic trail states (`Started`, `Needs evidence`, `Ready to review`) and a
  separate unsupported-claim count for instructor review.
- IndexedDB autosave with visible save/offline feedback and recent structural
  activity. State survives refresh, tab close, and PWA installation.
- JSON workbook export/import, response-free teacher template JSON, trail CSV,
  and basic MLA/APA/Chicago citation text. Import validates schema and limits,
  and confirms before replacing local work.
- Keyboard shortcuts, labelled forms, designed focus states, responsive 390 px
  layout, reduced-motion treatment, empty/error/offline/update states, and
  destructive-action confirmation.
- Installable PWA manifest and hand-written service worker with versioned shell
  and asset caches, network-first navigation, cache-first assets, offline
  fallback, `skipWaiting`, `clientsClaim`, and an update toast.
- Standalone `/privacy/` and `/terms/` pages. No analytics, accounts, remote
  fonts, third-party runtime scripts, or workbook uploads.
- Product-specific neo-brutalist seminar-handout system in `design.md`, an
  authored application mark, and generated/inspected hero art with prompt and
  generator metadata in `assets/src/`.

## Verification

Run from a clean checkout:

```sh
npm ci
npm test
npm run build
npm run test:e2e
```

Verified locally on 2026-08-28:

- `npm test`: 4/4 passed.
- Playwright 1.58.2: 3/3 passed—complete workflow and persistence, export and
  import error, 390×844 overflow check, offline reload, console errors, and axe.
- Axe: zero serious or critical violations on the completed workbook screen.
- `/opt/fleet/lib/verify-url.sh`: HTTP 200, 611 ms load, no console errors,
  `lang="en"`, one `<h1>`, `<main>` present, zero missing image alt attributes,
  and zero unlabeled buttons. Evidence is in `.factory/evidence/`.
- Lighthouse 13 mobile simulation: Performance **99**, Accessibility **100**,
  Best Practices **100**, SEO **100**. FCP 0.9 s, LCP 1.7 s, TBT 100 ms, CLS 0.
- Production budgets: JS 28,860 B (9.60 KB gzip), CSS 16,299 B (4.23 KB gzip),
  mobile hero WebP 62,180 B, desktop hero WebP 174,578 B.
- `npm audit`: zero known vulnerabilities.

## Known limits and next steps

- Citation strings are intentionally basic drafts; users must verify details
  against their course guide. Citation formatting never affects credibility or
  readiness scoring.
- The app keeps one active workbook on a device. JSON files are the supported
  way to archive, exchange, and switch between assignments; cloud sync is an
  explicit non-goal for v1.
- No web scraping or automatic source evaluation is included. All metadata,
  quotations, and judgments are entered by the researcher as required by the
  brief.
