# Adversarial first-read review 2 — Source Trail Workbook

**Reviewed:** 2026-08-28  
**Candidate:** `ae4401325c2a1c5c1b9fd86ad7cc6f68211c31b3`  
**Live URL:** <https://source-trail-workbook.sociobot.in/>  
**Verdict: FAIL**

The product is clear, usable, visually distinct, and operational on the live
site. It still fails this review because the claims inventory is incomplete,
one safety claim is not fully exercised by its listed test, and an exact jargon
problem from review 1 remains. Under the supplied rules, an untested claim or
an earlier half-fixed finding prevents a pass.

## First 30 seconds

I opened the live root in new browser contexts at 390 × 844 and 1440 × 900,
without stored site data and before scrolling.

- **What it does:** records the path from a research search to a supported
  claim, including the source and evidence.
- **For whom:** students and instructors.
- **What to click first:** **“Try it with sample data”**, which says it opens a
  completed example.

All three answers are available above the fold at both sizes through the exact
text **“Trace research claims to their sources”**, **“For students and
instructors who need to show how a search became a claim.”**, and **“Try it
with sample data.”** There was no horizontal overflow or console error. The
hero image loaded with useful alt text. This part passes.

## Findings

### F-2-1 — BLOCKING — the claims contract is still incomplete (reopens F-1-3)

**Location / exact claims:** landing and README:

- **“Trace research claims to their sources”**, the four-part “Each source
  trail keeps these parts together” list, and **“Record how a search supports a
  research claim.”** There is no core-workflow claim entry. The only test that
  fills a complete trail is untagged `workbook.spec.ts`; the tagged
  `free-use` test fills only the research question before export.
- Landing action **“Import JSON”** and README **“Importing a valid workbook
  replaces the locally stored workbook after confirmation.”** The
  `template-roundtrip` claim imports into an empty real workspace; it does not
  test replacement of an existing workbook or the confirmation.
- Conditional landing action **“Install app”** has no claim entry or tagged
  install test.
- Landing/footer **“Original hero art generated for Source Trail Workbook.”**
  is a provenance claim with no claim entry, although repository provenance
  files exist.
- README **“The browser suite checks the full workflow, accessibility, mobile
  layout, privacy, downloads, routing, and offline reload.”**, the three
  response-policy sentences, and **“It serves the designed `404.html` for
  missing routes.”** are testable claims but are not listed. Their existing
  tests are untagged.
- README **“Every visitor-facing promise and its clean-state command are listed
  in `.factory/claims.json`.”** is therefore false.

The listed `demo-isolation` test has a second coverage gap. Its claim says the
demo **“never replaces a real workbook,”** but the test starts with no real
workbook, exits the demo, and then creates a real workbook. It never creates a
real workbook first, enters and edits the demo, exits, and checks that the
original real workbook survived. A manual live probe did confirm that the
implementation preserves a pre-existing workbook, but the required clean-state
claim test does not prove it.

**Why this fails:** a visitor is asked to rely on behavior that is either absent
from the manifest or broader than its tagged test. This is the same incomplete
claims-contract defect as F-1-3, not merely a documentation preference.

**Concrete fix:** add tagged manifest entries for the complete trail workflow,
general JSON import/replacement, install behavior, asset provenance, browser
coverage, and deployed response policy/404; or remove/narrow those sentences.
Extend `@claim:demo-isolation` to seed and save a named real workbook before
entering demo mode, then assert that exact workbook after reset and exit. Remove
the completeness sentence until a mechanical copy-to-manifest audit passes.

### F-2-2 — BLOCKING — the earlier README jargon remains (reopens F-1-6)

**Location / quote:** README: **“The sample demo uses a separate
`demo:current` IndexedDB key.”** Review 1 specifically flagged `IndexedDB` as
user-facing specialist wording. The repair moved it into a more detailed
sentence but did not remove or explain it. The same paragraph also exposes an
internal storage key that an instructor does not need.

The deploy section adds unexplained **“immutable cache,” “revalidate,” “CSP,”
“HSTS,” “manifest media type,”** and **“original-image provenance.”** These are
appropriate implementation concepts, but the attached plain-words rule applies
to the README and requires unfamiliar terms to be removed or explained.

**Why this fails:** the README switches from instructor-facing language to raw
browser and hosting terminology without defining it. Because the exact
`IndexedDB` issue from F-1-6 remains, the history rule makes it blocking again.

**Concrete fix:** replace the demo sentence with **“The demo uses separate
browser storage from your real workbook.”** Suggested deploy rewrites:

- **“The host keeps versioned asset files for one year.”**
- **“HTML and offline-app files check for updates instead of using that
  long-lived cache.”**
- **“The security policy blocks outside scripts and requires secure
  connections.”** Put the CSP/HSTS names in parentheses only if maintainers
  need them.
- **“The visual-system document records how the original image was made.”**

### F-2-3 — MINOR — the demo action names the wrong result

**Location / quote:** beside the primary landing action: **“Opens a completed
class research trail.”** The demo actually opens one sample workbook containing
three completed trails. The README and the product terminology correctly use
“workbook” for the full file and “trail” for one record.

**Why this fails:** the first action's outcome contradicts the product's own
terms and understates what appears after the click.

**Concrete fix:** use **“Opens a sample workbook with three completed research
trails.”** Add that exact seeded-demo outcome to the claims manifest.

### F-2-4 — MINOR — external footer links are not identified consistently

**Location / quote:** Privacy, Terms, and 404 footers link **“Built by Param
Factory”** to `https://sociobot.in` with only `rel="external"`. That attribute
does not tell a visitor or assistive technology that the destination leaves the
site. The app-rendered landing footer includes a visually hidden **“(external
site)”**, so the shared shell is inconsistent.

**Why this fails:** the site-structure contract says external links identify
themselves, and the same footer behaves differently by route.

**Concrete fix:** use the same accessible label on every route, preferably
visible copy: **“Built by Param Factory (external site)”**.

## Copy audit

Counts treat hyphenated terms, version numbers, paths, and file-format names as
one word. URLs and the decorative arrow/step numerals are not counted. No item
exceeds 22 words, and no banned marketing adjective appears. “Pass” here means
the sentence itself meets the length/style rule; claim coverage is noted
separately.

### Landing page

| Sentence, heading, or action | Words | Result |
| --- | ---: | --- |
| This workbook needs JavaScript to save entries locally and export files. | 11 | Pass; no-script recovery copy. |
| Skip to main content | 4 | Pass. |
| Source Trail Workbook | 3 | Pass; product name. |
| Home | 1 | Pass. |
| Demo | 1 | Pass. |
| Privacy | 1 | Pass. |
| A browser worksheet for research evidence | 6 | Pass. |
| Trace research claims to their sources | 6 | **F-2-1:** unlisted core capability. |
| For students and instructors who need to show how a search became a claim. | 13 | Pass. |
| Try it with sample data | 5 | Pass; permitted primary-action wording. |
| Opens a completed class research trail. | 6 | **F-2-1, F-2-3:** unlisted and wrong unit/count. Rewrite above. |
| Create a blank workbook | 4 | Pass; result-naming verb. |
| Continue your workbook | 3 | Pass; conditional action. |
| Create a new workbook | 4 | Pass; conditional action. |
| Import JSON | 2 | **F-2-1:** result-naming verb, but the general import promise is unlisted. |
| Install app | 2 | **F-2-1:** result-naming verb, but unlisted and untested. |
| Free to use. | 3 | Pass; `free-use`. |
| Works offline after the first visit. | 6 | Pass; `offline-reload`. |
| Workbook content stays in this browser. | 6 | Pass; `privacy-local`. |
| See how a question becomes a supported claim. | 8 | **F-2-1:** part of the unlisted core workflow. |
| Three steps | 2 | Pass; contextual eyebrow, not a heading. |
| How to record a research trail | 6 | Pass. |
| Record the search | 3 | Pass. |
| Keep the exact query and one result you passed over. | 10 | **F-2-1:** unlisted core workflow. |
| Check the source | 3 | Pass. |
| Name who made it, what supports it, and what limits it. | 11 | **F-2-1:** unlisted core workflow. |
| Connect evidence | 2 | Pass. |
| Write the claim, a short quotation, and why the link holds. | 11 | **F-2-1:** unlisted core workflow. |
| For instructors | 2 | Pass; contextual eyebrow. |
| Give students a blank research-trail template | 6 | Pass; `template-roundtrip`. |
| Add the course prompt and instructions, then export a blank template. | 11 | Pass; `template-roundtrip`. |
| Students import it and return their completed workbook. | 8 | Pass; `template-roundtrip`. |
| Record how a search supports a research claim. | 8 | **F-2-1:** unlisted core capability. |
| Privacy | 1 | Pass. |
| Terms | 1 | Pass. |
| Built by Param Factory | 4 | **F-2-4** on static routes; identify the external destination. |
| (external site) | 2 | Pass on the app-rendered landing footer; missing on static routes per F-2-4. |
| v1.1.0 · polish 1 | 3 | Pass as the required build identifier. |
| Original hero art generated for Source Trail Workbook. | 8 | **F-2-1:** unlisted provenance claim. |
| Offline mode — edits still save on this device. | 8 | Pass; conditional copy covered by persistence/offline claims. |
| A fresh app version is ready. | 6 | Pass; conditional update notice. |
| Update now | 2 | Pass; result-naming action. |

### README

| Sentence, heading, or label | Words | Result |
| --- | ---: | --- |
| Source Trail Workbook | 3 | Pass; product name. |
| Source Trail Workbook helps classes record how a search supports a claim. | 12 | **F-2-1:** unlisted core capability. |
| It is for humanities instructors and undergraduate researchers who need to review the reasoning behind a bibliography. | 17 | Pass. |
| Live site | 2 | Pass; link label. |
| Sample workbook | 2 | Pass; link label. |
| What it does | 3 | Pass. |
| Each source trail keeps these parts together: | 7 | **F-2-1:** introduces unlisted capability claims. |
| the exact query, search location, and reason for the wording; | 10 | **F-2-1:** unlisted core workflow. |
| one rejected result and the reason it was rejected; | 9 | **F-2-1:** unlisted core workflow. |
| source details plus notes about the creator, evidence, and limits; | 10 | **F-2-1:** unlisted core workflow. |
| a claim, its source relationship, a short quotation, and the student's explanation. | 12 | **F-2-1:** unlisted core workflow. |
| The index labels each trail as Started, Needs evidence, or Ready to review. | 13 | Pass; `status-evaluation`. |
| It also identifies a claim whose evidence link is incomplete or malformed. | 12 | Pass; `status-evaluation`. |
| Workbook edits stay in browser storage and persist across reloads. | 10 | Pass; `local-persistence`. |
| Students can export workbook JSON, a CSV trail table, or draft citations. | 12 | Pass; three export claims. |
| Instructors can export a blank assignment template for students to import. | 11 | Pass; `template-roundtrip`. |
| No account is required, and workbook content is not uploaded. | 10 | Pass; `free-use` and `privacy-local`. |
| The sample demo uses a separate `demo:current` IndexedDB key. | 9 | **F-2-2:** unexplained jargon; rewrite above. |
| Reset restores its three humanities trails. | 6 | Pass; `demo-isolation`. |
| Starting for real deletes the demo key and opens the separate real workspace. | 13 | Claim is listed, but **F-2-1** identifies incomplete test coverage. |
| Run locally | 2 | Pass. |
| Use Node.js 20.19 or newer and npm. | 7 | Pass; necessary tool names. |
| Open the URL printed by Vite. | 6 | Pass; necessary tool name. |
| Build the production files with: | 5 | Pass. |
| The deploy artifact is `dist/`, with `dist/index.html` at its root. | 10 | **F-2-2:** “deploy artifact” is unexplained; use “The built site is in `dist/`.” |
| Test | 1 | Pass. |
| The browser suite checks the full workflow, accessibility, mobile layout, privacy, downloads, routing, and offline reload. | 16 | **F-2-1, F-2-2:** unlisted claim; “routing” is unexplained. |
| Playwright is pinned to 1.58.2. | 5 | Pass; necessary tool/version name. |
| Every visitor-facing promise and its clean-state command are listed in `.factory/claims.json`. | 11 | **F-2-1:** contradicted by this audit; remove until true. |
| Keyboard and data ownership | 4 | Pass. |
| Ctrl/Cmd + S: save now | 4 | Pass; `keyboard-workflow`. |
| Ctrl/Cmd + Enter: add a trail | 5 | Pass; `keyboard-workflow`. |
| Export JSON before clearing site data or moving to another device. | 11 | Pass. |
| Importing a valid workbook replaces the locally stored workbook after confirmation. | 11 | **F-2-1:** unlisted and not tested as written. |
| Citation exports are drafts. | 4 | Pass; `citation-export`. |
| Check them against the course style guide because formatting does not establish source quality. | 14 | Pass; warning asserted by `citation-export`. |
| Deploy | 1 | Pass. |
| Deploy `dist/` to Azure Static Web Apps. | 7 | Pass; necessary platform name. |
| The response policy gives hashed assets a one-year immutable cache. | 10 | **F-2-1, F-2-2:** unlisted claim and unexplained jargon. |
| HTML, the manifest, and the service worker revalidate so updates can appear. | 12 | **F-2-1, F-2-2:** unlisted claim and unexplained jargon. |
| The policy also sets a self-only CSP, one-year HSTS, and the manifest media type. | 14 | **F-2-1, F-2-2:** unlisted claim and unexplained acronyms. |
| It serves the designed `404.html` for missing routes. | 8 | **F-2-1:** unlisted deployed-behavior claim. |
| The researched scope is in `.factory/brief.json`. | 6 | Pass. |
| The visual system and original-image provenance are in `.factory/design.md`. | 9 | **F-2-2:** “provenance” is unexplained; rewrite above. |
| License | 1 | Pass. |
| MIT. | 1 | Pass. |
| See LICENSE. | 2 | Pass. |

## Demo and sandbox

**Runtime result: PASS.** One click from the root opened `/?demo=1`. At
390 × 844, the first demo screen already showed the banner, a completed sample
workbook title, a realistic student, course, and research question. The three
trail names were “Coffeehouse discussion,” “News moved through rooms,” and
“Access was unequal,” and all three were ready to review.

Reset restored **“Coffeehouses and the public sphere.”** A manual stronger
isolation probe created and saved **“REAL WORKBOOK MUST SURVIVE”** first, entered
and changed the demo, reset it, exited, and confirmed the exact real title was
still present. IndexedDB contained `workbook:current` before entry, both keys
inside the demo, and only `workbook:current` after exit. No off-origin request or
upload occurred. The automated coverage defect remains F-2-1.

The controlled live demo reloaded offline with its sample title, an active
service-worker controller, and the visible offline state.

## Claims results

Every command below was run separately after `npm ci` in a fresh clone at
`ae44013`. Every command exited successfully.

| Claim | Result | Observed assertion |
| --- | --- | --- |
| `free-use` | PASS | Create, edit, and JSON export required no account, login, billing, or payment request. |
| `demo-isolation` | PASS command / incomplete coverage | Reset and exit passed, but no pre-existing real workbook is seeded by the test; see F-2-1. |
| `json-export` | PASS | Parsed JSON contained three populated trails. |
| `csv-export` | PASS | CSV contained the header and three sample rows. |
| `citation-export` | PASS | Text contained the draft warning and all three sources. |
| `template-roundtrip` | PASS | Template retained the question, cleared student work, and imported. |
| `offline-reload` | PASS | Service-worker-controlled demo reloaded offline with sample data. |
| `local-persistence` | PASS | Edited demo title survived reload. |
| `privacy-local` | PASS | Captured requests were same-origin and contained no workbook text in request bodies. |
| `keyboard-workflow` | PASS | Save announced success; add shortcut created and focused trail four. |
| `status-evaluation` | PASS | Three sample trails were ready; malformed URL changed the state and announced repair. |

Additional clean-clone gates passed: `npm test` (7/7), `npm run build`,
`npm run test:e2e` (18/18), and `npm audit --omit=dev` (0 vulnerabilities).
The build emitted `dist/`; JavaScript was 39.47 KB raw / 13.05 KB gzip.

## Earlier finding verification

I read every earlier review, polish report, verification report, and handoff,
then checked the live behavior and source rather than accepting their status.

| Earlier finding | Current result | Evidence |
| --- | --- | --- |
| F-1-1 — unclear first screen | Fixed | Live mobile and desktop first screens name the job, audience, and primary demo action; one task `h1`. |
| F-1-2 — no isolated one-click demo | Fixed in runtime | Live demo is seeded, resettable, offline, separately keyed, and preserves pre-existing real work. |
| F-1-3 — absent/incomplete claims contract | **Half-fixed; BLOCKING again** | Eleven entries and tests now exist, but F-2-1 lists unlisted claims and the incomplete real-data isolation test. |
| F-1-4 — missing demo route/designed 404 | Fixed | `/demo/` is 200; an unknown path is a styled product 404 with status 404 and a return link. |
| F-1-5 — metadata/site shell gaps | Fixed | Route titles, one `h1`, descriptions, canonicals, OG/Twitter image, icons, sitemap, deep links, focus handling, and shared core shell are present. F-2-4 is a new consistency detail. |
| F-1-6 — jargon/copy defects | **Half-fixed; BLOCKING again** | Length, hero copy, and terminology improved, but the specifically flagged word `IndexedDB` remains in README; see F-2-2. |
| Verification-1 M2 — malformed URL marked ready | Fixed | Unit, claim, and full-browser tests pass; live invalid URLs report the repair and remain “Needs evidence.” |
| Verification-1 M2 — immutable caching absent | Fixed | Live hashed assets return one-year immutable caching; deployment-policy test passes. |
| Verification-1 M3 — response-policy gaps | Fixed | Live CSP, one-year HSTS, `nosniff`, referrer policy, and manifest media type are present. |

## Structure, accessibility, links, and visual identity

- Root, demo, privacy, terms, and 404 each have a route-specific title, one
  `h1`, one `main`, description, canonical, Open Graph/Twitter data, favicon,
  and shared core navigation/footer. Root and demo History API navigation works;
  the clean browser test confirms back navigation restores and focuses the root
  `h1`.
- Root, demo, privacy, terms, 404, favicon, touch icon, social image,
  `robots.txt`, `sitemap.xml`, and the external Param Factory destination all
  returned 200. An unknown path returned the designed page with HTTP 404.
- Live axe checks found zero serious or critical violations on root, demo,
  privacy, terms, and 404 at 390 px. There was no horizontal overflow.
- The seminar-handout palette, hard rules/shadows, torn-paper source trail art,
  square controls, and serif/sans pairing are recognisably product-specific.
  This is not a generic SaaS-template finding.
- F-2-4 is the only remaining structure issue found.

## Missed leverage

No additional feature is justified by the brief. JSON/CSV/citation export,
template import/export, and offline use cover the obvious portability needs.
The brief explicitly makes AI research answers a non-goal, so adding a gateway
feature would dilute the teaching purpose. Sync would conflict with the stated
local-first scope unless separately designed and consented to. No embedded
provider key or decorative AI feature exists.

## What would make this perfect

Close F-2-1 by making the claims file genuinely exhaustive and by testing demo
isolation against pre-existing real work. Replace the remaining unexplained
README terms, correct the demo outcome sentence to name one workbook with three
trails, and identify the external footer link consistently. Then rerun every
claim command from a clean clone and repeat the cold live audit. At that point,
this review found no other product, demo, route, accessibility, privacy,
offline, visual, or missed-feature work to request.
