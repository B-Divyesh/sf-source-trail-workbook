# Perfection loop polish 2 — finding closure

**Base review:** `2a4d97b37582db43c6d8659ccaa2dacb35b064b0`

**Repair commit:** `439717b`

**Deployment:** `4b926fcf-f6bd-4fe2-a136-172550aae73a`

**Live product:** <https://source-trail-workbook.sociobot.in/>

## Finding map

| Finding | Change made | Evidence | Screenshot | Live check |
| --- | --- | --- | --- | --- |
| F-1-1 | Kept the task-first `h1`, named students and instructors, and retained the sample action as the first action. Corrected its outcome text to name one workbook and three trails. | `site.spec.ts` — “landing explains the job…” | `.factory/evidence/polish-2-live-root/screenshot-mobile.png` | Root shows the job, audience, action, and result above the product preview at 390 px and desktop. |
| F-1-2 | Kept `/?demo=1` and `/demo/` as direct entries; strengthened isolation proof by creating a named real workbook before entering, editing, resetting, and leaving the demo. | `@claim:demo-isolation`, `@claim:offline-reload` | `.factory/evidence/polish-2-live-demo/screenshot-mobile.png` | Live test preserved `REAL WORKBOOK MUST SURVIVE`, removed `demo:current`, retained `workbook:current`, and reloaded offline. |
| F-1-3 | Expanded the claim inventory from 11 to 19 entries and added a contract test that rejects missing, duplicate, or orphan claim tags. | `claims-contract.test.ts`; all 19 manifest commands passed individually in a clean clone | Root and demo screenshots | All 19 tagged tests also passed against production. |
| F-1-4 | Retained direct demo routing, History API back behavior, route focus, and the styled host-level 404 mapping. | `site.spec.ts`; `@claim:designed-404` | `.factory/evidence/polish-2-live-404.png` | `/demo/` returned 200; an unknown path returned HTTP 404 with “This trail ends here” and a home link. |
| F-1-5 | Rechecked unique titles, descriptions, canonicals, social metadata, icons, sitemap, legal shells, focus, legal links, and build id. | `site.spec.ts` complete-shell and legal-focus cases | `.factory/evidence/polish-2-live-privacy-mobile.png` | Root, demo, privacy, terms, favicon, touch icon, social image, robots, and sitemap returned 200. |
| F-1-6 | Removed `IndexedDB`, internal keys, deployment jargon, and unexplained acronyms from README copy. Updated the complete landing/README word audit. | `.factory/copy-audit.md`; banned-word/jargon search | `.factory/evidence/polish-2-live-root/screenshot-mobile.png` | No first-screen copy exceeds 22 words; terminology is consistent. |
| F-2-1 | Added claim tests for the complete workflow, import confirmation/replacement, install prompt, art provenance, host policy, 404, storage deletion, and build output. Strengthened demo isolation against pre-existing work. | `@claim:core-workflow`, `@claim:json-import-replacement`, `@claim:install-action`, `@claim:hero-provenance`, `@claim:deployment-policy`, `@claim:designed-404`, `@claim:storage-deletion`, `@claim:build-output` | Root and demo screenshots | Production ran the full 27-test browser suite, including all 19 claim tests, with no failures. |
| F-2-2 | Rewrote README storage, build, cache, security, and artwork language in plain words; removed the internal demo key and unexplained browser/hosting jargon. | `.factory/copy-audit.md` README section | Not applicable | Live product copy and repository README use “browser storage” consistently. |
| F-2-3 | Changed the adjacent action result to “Opens a sample workbook with three completed research trails.” The demo `h1` now also names three trails. | `@claim:demo-isolation`; landing route test | Root and demo screenshots | Cold live click opened one workbook with three ready trails. |
| F-2-4 | Made “Built by Param Factory (external site)” visible and identical on app, privacy, terms, 404, and offline shells. | `site.spec.ts` legal-focus/external-link case | `.factory/evidence/polish-2-live-privacy-mobile.png`; `.factory/evidence/polish-2-live-404.png` | Production legal and 404 pages expose the complete accessible link name and `rel="external"`. |

## Earlier product-defect regression checks

| Earlier item | Change/evidence | Live result |
| --- | --- | --- |
| Verification-1 M2 — malformed locator marked ready | `@claim:status-evaluation` and `workbook.spec.ts` require a valid HTTP(S) URL, visible error, and `aria-invalid`. | Invalid locator remained “Needs evidence”; corrected locator became ready. |
| Verification-1 M2 — immutable asset caching missing | `@claim:deployment-policy` and `deployment-policy.test.ts`. | `/assets/main-CPBGeQt1.js` returned `public, max-age=31536000, immutable`. |
| Verification-1 M3 — CSP/HSTS/manifest gaps | Same deployment tests assert the policy and media type. | Live root returned enforcing self-only CSP and one-year preload HSTS; manifest returned `application/manifest+json`. |

## Verification evidence

- Clean clone of `439717b`: `npm ci`, `npm test` (9/9), `npm run build`,
  `npm run test:e2e` (27/27), and `npm audit --omit=dev` (0 vulnerabilities).
- Every one of the 19 commands in `.factory/claims.json` ran separately from
  that clean clone and passed one tagged test.
- Local and live browser suites each passed 27/27. Axe found zero serious or
  critical violations on root, demo, privacy, terms, and 404 at 390 px.
- Local Lighthouse: 100 Performance, 100 Accessibility, 100 Best Practices,
  100 SEO; LCP 1.8 s, TBT 50 ms, CLS 0.
- Live Lighthouse: 100/100/100/100; FCP 0.9 s, LCP 1.3 s, TBT 0 ms, CLS 0.
- Live and `dist/` SHA-256 matched for root, demo, service worker, manifest,
  privacy, terms, 404, JavaScript, and CSS.
- Final JavaScript is 39,457 B raw / 13,007 B gzip; CSS is 17,842 B raw /
  4,579 B gzip; mobile hero is 62,180 B.

No finding from either adversarial review or the earlier verification reports
remains open.
