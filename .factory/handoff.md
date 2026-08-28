# Source Trail Workbook — verification handoff

## FAIL — not accepted for release

Work order: `source-trail-workbook-verify-1`
Verified candidate: `758f8fc05559b02abb8d7f6ecc74ed1d4512e95e`
Live URL: <https://source-trail-workbook.sociobot.in/>
Verified: 2026-08-28

The live deployment is byte-for-byte the requested candidate and its core PWA
workflow, local persistence, offline reload, update flow, accessibility, and
performance all work. However, it fails the supplied acceptance contract on
two M2 issues:

1. A malformed source URL (for example `not-a-valid-url`) can still give a
   trail the **Ready to review** status, even though the native URL control
   reports a type mismatch. This falsely signals an auditable claim-to-source
   link.
2. Hashed production JS, CSS, and image assets receive only
   `cache-control: public, must-revalidate, max-age=30`, not a long-lived
   immutable cache policy required for static PWA assets.

Deployment follow-up also needs an enforcing CSP, one-year-or-longer HSTS, and
the correct JSON manifest media type. These are M3 issues.

## How verified

```sh
npm ci
npm test
npm run build
npm run test:e2e
npm audit --omit=dev
```

All commands passed: Vitest 4/4, Playwright 3/3, TypeScript/Vite build, and
zero audit vulnerabilities. Fresh Lighthouse mobile scores on the live URL
were 100/100/100/100 (performance/accessibility/best-practices/SEO), with
FCP 1.0 s, LCP 1.3 s, TBT 0 ms, and CLS 0. Axe found zero serious/critical
issues; desktop and 390 px checks had no console/page errors or horizontal
overflow. The actual live PWA reloaded offline, and a controlled production
artifact service-worker update showed the update toast and activated the new
cache.

See [verification-1.md](verification-1.md) for exact reproduction evidence,
headers, artifact identity comparisons, privacy/request checks, and full
defect detail.

## Next steps

Fix the locator/status validation in product code and configure immutable
caching plus response policies at deployment, then rerun independent
verification. Product source was not changed during this verification.
