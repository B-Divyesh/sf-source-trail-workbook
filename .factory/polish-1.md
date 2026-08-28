# Perfection loop polish 1 — finding closure

**Base review:** `30945e1fef3f3d684fc2043407b8eaaceb232261`  
**Repair commit:** `ed98361` (implementation; evidence follow-up follows)  
**Product:** <https://source-trail-workbook.sociobot.in/>

## Finding map

| Finding | Change made | Automated evidence | Screenshot | Live check |
| --- | --- | --- | --- | --- |
| F-1-1 | Made “Trace research claims to their sources” the sole landing `h1`; named students and instructors; put the sample action first with its result. | `site.spec.ts` — “landing explains the job and opens the isolated demo in one click” | `.factory/evidence/polish-1-landing-mobile.png` | Pending deployment check. |
| F-1-2 | Added realistic three-trail sample data for `/?demo=1` and `/demo/`; separated `demo:current` from `workbook:current`; added persistent banner, reset, and exit that deletes demo data. | `@claim:demo-isolation`, `@claim:offline-reload`, `site.spec.ts` direct-demo case | `.factory/evidence/polish-1-demo-mobile.png`; `.factory/evidence/polish-1-demo-desktop.png` | Pending deployment check. |
| F-1-3 | Added `.factory/claims.json` with 11 claims and exactly one tagged observable test per claim. Downloads assert file contents; privacy intercepts requests; offline uses a fresh service-worker-controlled context. | All 11 manifest commands passed separately in clean clone `/tmp/source-trail-polish-lc69BH`. Full claim file passed 11/11. | Demo screenshots above | Pending deployment check. |
| F-1-4 | Added built `/demo/`, History API state, back-button focus, and a designed `404.html`. Azure `responseOverrides` now rewrites unknown requests to it with status 404. | `site.spec.ts` landing/back and direct-route cases; `deployment-policy.test.ts` 404 assertion | `.factory/evidence/polish-1-404.png` | Pending unknown-route and `/demo/` checks. |
| F-1-5 | Added route titles, descriptions, canonicals, OG/Twitter metadata, 1200×630 art, SVG favicon, 180 px touch icon, sitemap, shared navigation/footer, build id, and route focus announcements. | `site.spec.ts` complete-shell and mobile/axe cases; worker verifier root/demo reports | `.factory/evidence/polish-1-local-root/screenshot-desktop.png`; `.factory/evidence/polish-1-local-demo/screenshot-desktop.png` | Pending route crawl and cold focus check. |
| F-1-6 | Replaced slogan and jargon copy, split long README sentences, standardised “workbook”, “trail”, “demo”, and “template”, and added the required copy audit. | `.factory/copy-audit.md`; banned-word search returned no product-copy matches; catalog line is 110 characters including newline. | `.factory/evidence/polish-1-landing-mobile.png` | Pending cold first-read check. |

## Earlier regression checks

| Earlier item | Evidence |
| --- | --- |
| Verification-1 M2 — malformed source URL marked ready | `@claim:status-evaluation`, `workbook.spec.ts` malformed-URL case, and unit readiness test pass. |
| Verification-1 M2 — hashed assets not immutable | `deployment-policy.test.ts` asserts one-year immutable asset caching. |
| Verification-1 M3 — CSP, HSTS, and manifest media type | `deployment-policy.test.ts` asserts the enforcing self-only CSP, one-year HSTS, and manifest type. No inline styles/scripts remain. |

## Local acceptance evidence

- Clean install and full suite: 7 unit + 18 browser tests passed.
- Claims: 11/11 passed together and each manifest command passed separately.
- Axe: zero serious or critical issues on five routes at 390 px.
- Offline: sample reload retained all three trails and showed offline state.
- Privacy: only same-origin requests and scripts; no request body contained workbook text.
- Performance: Lighthouse 100/100/100/100; LCP 1.7 s; TBT 10 ms; CLS 0.
- Artifact: 39.34 KB JS, 17.84 KB CSS, 62.18 KB mobile hero.
