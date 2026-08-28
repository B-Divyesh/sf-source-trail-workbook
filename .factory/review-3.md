# Adversarial first-read review 3 — Source Trail Workbook

**Reviewed:** 2026-08-28  
**Candidate:** 127cb245905ea1c455fab82c73c237890ab225b5  
**Live URL:** <https://source-trail-workbook.sociobot.in/>  
**Verdict: PASS**

## First 30 seconds

I opened the root in fresh Chromium contexts at 390 × 844 and 1440 × 900,
with no site data, and did not scroll before assessing it.

- **What it does:** records the route from a research search to a claim and supporting evidence.
- **For whom:** students and instructors.
- **What to click first:** **“Try it with sample data”**. Adjacent text says it opens one workbook with three completed research trails.

All three answers are visible on the first screen in **“Trace research claims to their sources”**, **“For students and instructors who need to show how a search became a claim.”**, and **“Try it with sample data”**. The mobile viewport had no horizontal overflow or console error. This passes the cold first-read test.

## Findings

None. No blocking, major, or minor finding remains.

## Copy audit

Counts treat hyphenated terms, product names, file names, keyboard chords, and version labels as one word. Labels and headings are included because they must also make sense out of context. I checked live landing copy against source and the README. No entry exceeds 22 words; no banned marketing adjective, undefined jargon, inconsistent term, context-free heading, or non-result-naming action was found.

### Landing page

| Text | Words | Result |
| --- | ---: | --- |
| This workbook needs JavaScript to save entries locally and export files. | 11 | Pass |
| Skip to main content | 4 | Pass |
| Source Trail Workbook | 3 | Product name |
| Home | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| A browser worksheet for research evidence | 6 | Clear context label |
| Trace research claims to their sources | 6 | Plain job headline; core-workflow claim |
| For students and instructors who need to show how a search became a claim. | 13 | Plain audience statement |
| Try it with sample data | 5 | Result-naming primary action |
| Opens a sample workbook with three completed research trails. | 9 | demo-isolation claim |
| Create a blank workbook | 4 | Result-naming action |
| Continue your workbook | 3 | Conditional, result-naming action |
| Create a new workbook | 4 | Conditional, result-naming action |
| Import JSON | 2 | Result-naming action |
| Install app | 2 | Conditional, result-naming action |
| Free to use. | 3 | free-use claim |
| Works offline after the first visit. | 6 | offline-reload claim |
| Workbook content stays in this browser. | 6 | privacy-local claim |
| See how a question becomes a supported claim. | 8 | core-workflow claim |
| Three steps | 2 | Clear context label |
| How to record a research trail | 6 | Clear heading |
| Record the search | 3 | Clear heading |
| Keep the exact query and one result you passed over. | 10 | core-workflow claim |
| Check the source | 3 | Clear heading |
| Name who made it, what supports it, and what limits it. | 11 | core-workflow claim |
| Connect evidence | 2 | Clear heading |
| Write the claim, a short quotation, and why the link holds. | 11 | core-workflow claim |
| For instructors | 2 | Clear context label |
| Give students a blank research-trail template | 6 | Clear heading |
| Add the course prompt and instructions, then export a blank template. | 11 | template-roundtrip claim |
| Students import it and return their completed workbook. | 8 | template-roundtrip claim |
| Record how a search supports a research claim. | 8 | core-workflow claim |
| Terms | 1 | Pass |
| Built by Param Factory (external site) | 6 | Destination is explicit |
| v1.2.0 · polish 2 | 3 | Build identifier |
| Original hero art generated for Source Trail Workbook. | 8 | hero-provenance claim |
| Offline mode — edits still save on this device. | 8 | Conditional; persistence/offline claims |
| A fresh app version is ready. | 6 | Conditional status |
| Update now | 2 | Conditional, result-naming action |

### README

| Text | Words | Result |
| --- | ---: | --- |
| Source Trail Workbook | 3 | Product name |
| Source Trail Workbook helps classes record how a search supports a claim. | 12 | core-workflow claim |
| It is for humanities instructors and undergraduate researchers who need to review the reasoning behind a bibliography. | 17 | Plain audience statement |
| Live site | 2 | Clear link label |
| Sample workbook | 2 | Clear link label |
| What it does | 3 | Clear heading |
| Each source trail keeps these parts together: | 7 | core-workflow claim |
| the exact query, search location, and reason for the wording; | 10 | core-workflow claim |
| one rejected result and the reason it was rejected; | 9 | core-workflow claim |
| source details plus notes about the creator, evidence, and limits; | 10 | core-workflow claim |
| a claim, its source relationship, a short quotation, and the student's explanation. | 12 | core-workflow claim |
| The index labels each trail as Started, Needs evidence, or Ready to review. | 13 | status-evaluation claim |
| It also identifies a claim whose evidence link is incomplete or malformed. | 12 | status-evaluation claim |
| Workbook edits stay in browser storage and persist across reloads. | 10 | local-persistence claim |
| Students can export workbook JSON, a CSV trail table, or draft citations. | 12 | Export claims |
| Instructors can export a blank assignment template for students to import. | 11 | template-roundtrip claim |
| No account is required, and workbook content is not uploaded. | 10 | free-use/privacy-local claims |
| The demo uses separate browser storage from your real workbook. | 10 | demo-isolation claim |
| Reset restores its three humanities trails. | 6 | demo-isolation claim |
| Starting for real clears the demo and opens your real workspace. | 11 | demo-isolation claim |
| Run locally | 2 | Clear heading |
| Use Node.js 20.19 or newer and npm. | 7 | Necessary developer instruction |
| Open the URL printed by Vite. | 6 | Necessary developer instruction |
| Build the production files with: | 5 | Clear instruction |
| The built site is in dist, with dist/index.html at its root. | 11 | build-output claim |
| Test | 1 | Clear heading |
| Keyboard and data ownership | 4 | Clear heading |
| Ctrl/Cmd + S: save now | 4 | keyboard-workflow claim |
| Ctrl/Cmd + Enter: add a trail | 5 | keyboard-workflow claim |
| Export JSON before clearing site data or moving to another device. | 11 | Clear advice |
| Importing a valid workbook asks before replacing the workbook saved in your browser. | 13 | json-import-replacement claim |
| Citation exports are drafts. | 4 | citation-export claim |
| Check them against the course style guide because formatting does not establish source quality. | 14 | Clear limitation |
| Deploy | 1 | Clear heading |
| Deploy dist to Azure Static Web Apps. | 7 | Necessary deployment instruction |
| The included host settings keep versioned asset files for one year. | 11 | deployment-policy claim |
| HTML and offline-app files check for updates instead of using that long-lived cache. | 13 | deployment-policy claim |
| The security settings block outside scripts and require secure connections. | 10 | deployment-policy claim |
| They also send missing routes to the designed 404.html page. | 10 | designed-404 claim |
| The researched scope is in .factory/brief.json. | 6 | Clear repository reference |
| The visual-system document records how the original image was made. | 10 | hero-provenance claim |
| License | 1 | Clear heading |
| MIT. | 1 | free-use claim |
| See LICENSE. | 2 | Clear link label |

## Demo and sandbox

**PASS.** One landing click opened ?demo=1; direct /demo/ also returned 200. The first demo screen was an in-use workbook, not setup: its heading was **“Review three completed research trails”** and it showed **“Coffeehouses and the public sphere”** with three ready trails: **“Coffeehouse discussion”**, **“News moved through rooms”**, and **“Access was unequal.”**

The persistent header banner reads **“Demo — sample data, nothing is saved to your real workbook.”** It has working **“Reset demo”** and **“Start for real”** controls. The live end-to-end isolation test creates a named real workbook first, changes and resets the demo, exits it, then confirms the named real workbook survives. It also confirms demo:current is removed while workbook:current remains. A fresh direct-demo probe found only demo:current.

The live suite service-worker-controlled the demo, set the context offline, reloaded it, and confirmed sample data plus the visible offline state. Request-interception coverage observed only same-origin requests, no tracking path, and no workbook text in a request body.

## Claims

**PASS.** .factory/claims.json lists 19 visitor-relevant claims. In a fresh temporary clone, npm ci completed without vulnerabilities and every listed command was run separately; all 19 passed. npm test passed 9 tests, and npm run build emitted dist/index.html with a 39.46 KB raw / 13.05 KB gzip JavaScript bundle.

The 27-test browser suite was rerun against the live URL with PLAYWRIGHT_BASE_URL=https://source-trail-workbook.sociobot.in; all 27 passed. It covers free use, isolation, complete workflow, exports/imports, offline reload, persistence/deletion, local privacy, shortcuts, URL validation, conditional install, art provenance, host policy, designed 404, and build output.

Every claim-like landing and README sentence in the audit maps to the inventory. Audience descriptions, direct instructions, and marked draft limitations are not runtime promises. No unlisted claim was found.

## Earlier finding verification

I read review-1.md, review-2.md, polish-1.md, polish-2.md, both verification reports, and the prior handoff, then checked live behavior and current source/tests rather than accepting their closed status.

| Earlier finding | Result now | Evidence |
| --- | --- | --- |
| F-1-1 — unclear first screen | Fixed | Cold screens provide job, audience, and sample action under one task h1. |
| F-1-2 — absent/unsafe demo | Fixed | Seeded three-trail demo, banner, reset/exit, separate keys, real-work preservation, and offline reload pass live. |
| F-1-3 — missing/incomplete claims | Fixed | 19-entry manifest has one unique tagged test per claim; clean-clone and live runs pass. |
| F-1-4 — no demo route/designed 404 | Fixed | /demo/ is 200; an unknown route is a product HTTP 404 with “This trail ends here” and a home link. |
| F-1-5 — metadata/shared-shell gaps | Fixed | Titles, descriptions, canonicals, social metadata, icons, sitemap, headers, footer, focus, and legal links pass. |
| F-1-6 — slogan/jargon/length defects | Fixed | The complete audit above has no remaining flag. |
| F-2-1 — unlisted claims/weak isolation test | Fixed | Core/import/install/art/host/404/build claims are inventoried; isolation starts with real work. |
| F-2-2 — README jargon | Fixed | README uses browser-storage/plain deployment wording; no internal key or unexplained hosting acronym remains. |
| F-2-3 — demo outcome lacked result | Fixed | The action promises a sample workbook with three completed trails. |
| F-2-4 — Param Factory label inconsistency | Fixed | App, legal, offline, and 404 shells use the same explicit external-site footer link. |
| Verification 1 M2 — malformed locator ready | Fixed | Live status evaluation leaves malformed URLs in Needs evidence with an announced repair and aria-invalid. |
| Verification 1 M2 — immutable cache gap | Fixed | Policy claim/live suite pass; hashed assets use one-year immutable caching. |
| Verification 1 M3 — CSP/HSTS/manifest gap | Fixed | Live root has self-only CSP and one-year preload HSTS; manifest policy passes. |

## Structure, links, accessibility, and visual identity

**PASS.** Root, demo, privacy, terms, robots, sitemap, SVG favicon, touch icon, social image, and manifest returned 200. The deliberate missing route returned 404, not a generic host document. Root, demo, privacy, terms, and 404 have route-specific plain titles, one h1, a main landmark, descriptions, canonicals, social metadata, and the shared navigation/footer. The live suite verifies route focus/back navigation and its 390 px axe checks reported no serious or critical issue.

The warm-paper, heavy-rule seminar-handout composition, hard shadows, purpose-made paper-trail illustration, and hand-drawn mark are product-specific. This is not a generic SaaS template. Loaded mobile and desktop screens showed the original illustration, visible focus/link affordances, and no mobile overflow.

## Missed leverage

None found. The brief expressly excludes AI research answers and asks for a small offline worksheet rather than a reference manager. The useful implied portability path is present: JSON, CSV, draft citation, and reusable template export/import. Sync would contradict the stated local-first privacy model.

## What would make this perfect

No product change is currently required. Keep the claim tests and one-click sample workbook in the release gate whenever workflow, storage, or landing copy changes; that preserves the conditions that make this pass.

