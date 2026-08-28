# Independent verification 2 — Source Trail Workbook

**Result: PASS**

Candidate `454e2abc11254562742ed5b10652f09d76fbd8d3` meets the researched brief and the supplied PWA, accessibility, privacy, performance, and deployment acceptance requirements. The earlier M2 defects are fixed in this candidate and the live deployment is byte-identical to its production artifact.

## Scope

- Repository / branch: `B-Divyesh/sf-source-trail-workbook`, `main`
- Candidate: `454e2abc11254562742ed5b10652f09d76fbd8d3` (`docs: record repair verification evidence`)
- Live URL: <https://source-trail-workbook.sociobot.in/>
- Verification date: 2026-08-28
- Environment: clean detached clone, Node 22.23.2, npm 10.9.8, Playwright 1.58.2 Chromium, Lighthouse CLI.
- Product source was not modified. This report and the handoff are verifier documentation only.

## Local gates

All available repository gates passed from the clean clone.

```text
npm ci                         PASS — 61 packages installed/audited; 0 vulnerabilities
npm test                       PASS — 2 files, 7 tests
npm run build                  PASS — tsc --noEmit and Vite production build
npm run test:e2e               PASS — 4 Playwright tests
npm audit --omit=dev           PASS — 0 vulnerabilities
```

There is no separate lint or typecheck script; `npm run build` is the available TypeScript check. The exact `dist/` artifact contains `index-DpOqpYg7.js` (29,713 B; 9,910 B gzip), `index-U5qD8zX9.css` (16,492 B; 4,280 B gzip), and a 62,180 B mobile WebP hero. These are within the 200 KB JS, 50 KB CSS, and 300 KB mobile-image budgets.

Fresh local Lighthouse against the production artifact scored Performance **100**, Accessibility **100**, Best Practices **100**, and SEO **100** (FCP 0.9 s, LCP 1.4 s, TBT 0 ms, CLS 0).

## End-to-end product evidence

On both the local production artifact and the live site, I completed a representative humanities trail containing a research question, exact query and rationale, rejected result and reason, source metadata, credibility notes, claim, short quotation, locator, and connection explanation.

- With a complete HTTPS source locator, the trail became **Ready to review**. `Ctrl+Enter` added a second trail; `Ctrl+S` saved. The title/question survived reload and “Continue workbook.” CSV export downloaded as `digital-humanities-evidence-trail.csv`.
- With `not-a-valid-url`, native `validity.typeMismatch` was true, `aria-invalid="true"` was present, the visible repair message appeared, and the state remained **Needs evidence**. Replacing it with an HTTPS archive URL immediately restored **Ready to review**. This closes prior finding M2.
- A 950-character quote was constrained to 900 characters. A 5,000,001 B import gave “That file is larger than 5 MB,” and a 251-trail workbook gave the safe 250-trail-limit error.
- A generated template retained the instructor research question, cleared the student name and claim, and contained one blank trail.
- Invalid JSON recovery and JSON export are also covered by the repository’s independent Playwright suite.

## Browser, accessibility, responsive, and PWA evidence

- Local and live browser probes reported zero console errors and zero page errors. Observed request origins were only the respective application origin; no analytics, remote font, third-party runtime, account, or upload request was observed.
- At 390 × 844, `scrollWidth === innerWidth === 390`; the full desktop workflow also completed. The first keyboard focus on the start screen is “Skip to workbook” with a visible `4px solid rgb(23, 69, 209)` outline. Keyboard shortcuts operate as documented.
- The app has `lang="en"`, a descriptive title, exactly one rendered `h1`, a `main` landmark, labeled form controls, legal pages, and meaningful hero alt text. Axe on the completed mobile workflow found **zero serious or critical violations**. Under reduced motion, button transition duration is `0.00001s`.
- After service-worker control, an actual 390 px offline reload retained the workbook heading, displayed “Offline mode,” and had a controlling worker on both local and live deployments.
- A separate controlled update test served the exact production artifact, then changed only its worker cache version. The app showed “A fresh app version is ready”; clicking “Update now” activated the new worker and left only `source-trail-shell-update` in Cache Storage. No errors resulted.
- Manifest inspection confirms standalone display, versioned start URL, matching paper colors, 192/512/maskable icons, and install scope. State persists in IndexedDB and export/import are local browser operations.

## Deployment identity and response policy

SHA-256 checks matched the live site and this candidate’s `dist/` bytes for `index.html`, `sw.js`, `manifest.webmanifest`, `offline.html`, both legal pages, JS, CSS, mobile hero, and all three icons. The live document references the same `index-DpOqpYg7.js` and `index-U5qD8zX9.css` emitted by the clean build.

Live response policy is correct:

- HTML, manifest, and legal pages: `public, max-age=0, must-revalidate`.
- `sw.js`: `no-cache, no-store, must-revalidate`.
- Hashed JS, CSS, and WebP assets: `public, max-age=31536000, immutable`.
- Enforcing self-only CSP, HSTS `max-age=31536000; includeSubDomains; preload`, `nosniff`, `strict-origin-when-cross-origin`, restrictive Permissions Policy, and `application/manifest+json` for the manifest are present.

This confirms the previous static-cache M2 and response-policy M3 findings are repaired in production, not merely in repository configuration.

## Privacy, server, and account scope

Source/artifact inspection and runtime observation show an offline local-first static PWA: workbook data is stored in IndexedDB; no sign-in, API endpoint, payment, synchronization, or server-side data storage exists. Therefore the Entra tenant and API rate-limit requirements are not applicable—there is no product API endpoint on which a 429 threshold could be observed. The app’s privacy and terms pages are deployed, and the repository has an MIT license.

## Defects

No P0, P1, P2, or P3 defects found in this verification.

## Acceptance conclusion

**PASS.** The deployed URL matches candidate `454e2abc11254562742ed5b10652f09d76fbd8d3` exactly and provides the brief’s auditable, offline classroom source-trail workflow with the required recovery, portability, privacy, accessibility, and PWA behavior.
