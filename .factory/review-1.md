# Adversarial first-read review 1 — Source Trail Workbook

**Reviewed:** 2026-08-28  
**Live URL:** https://source-trail-workbook.sociobot.in/  
**Verdict: FAIL**

## First 30 seconds

I could infer that this records the steps between a web search and a research
claim. I could not tell who it is for before scrolling: the visible hero never
names students, teachers, a class, or humanities research. The only visible
first action is **“Start a workbook”**, which says that it creates something,
not what the visitor will get. The first-screen text that fails the test is:

> “Don’t just list the source. Show the trail.”

> “Capture the query you tried, the result you rejected, the source you
> checked, and the evidence behind every claim.”

These explain fields, but not the audience or the immediate outcome. At 390 px
the instructor audience appears only below the hero art and the three-step
section. Desktop shows the same ordering. There was no horizontal overflow at
390 px.

## Findings

### F-1-1 — BLOCKING — first screen does not name the visitor or a clear first result

**Location / quote:** landing hero, quoted above; primary action **“Start a
workbook”**.

**Why this fails:** a cold visitor cannot answer all three mandatory questions
(what, for whom, and what to click first) from the first screen. The wordmark
is the only \`h1\`; the task headline is a lower-level \`h2\`, so the semantic
headline is also wrong.

**Concrete fix:** make the sole \`h1\` a plain job headline, for example **“Trace
research claims to their sources”**. Replace the supporting copy with **“For
students and instructors who need to show how a search became a claim.”** Put
**“Try it with sample data”** first, with adjacent outcome text such as
**“Opens a completed class research trail.”**

### F-1-2 — BLOCKING — no one-click sample-data demo and no isolated sandbox

**Location / evidence:** the landing page has no **“Try it with sample data”**
action. \`GET /demo\` returned the Azure default 404. \`/?demo=1\` returned the
ordinary empty start screen; clicking **“Start a workbook”** opens blank fields,
not a realistic completed trail. No persistent **“Demo — sample data, nothing
is saved”** banner, **“Reset demo”**, or **“Start for real”** control exists.

Code confirms the isolation failure: \`src/db.ts\` uses the single IndexedDB
database \`source-trail-workbook\`, store \`workbooks\`, and key \`current\`; there
is no \`demo:\` namespace or URL-mode branch. A demo could therefore write the
same record as real work. This also makes the required demo offline/privacy
test impossible to perform.

**Concrete fix:** implement \`/demo\` (and make \`?demo=1\` enter the same mode)
with three or more realistic humanities claim-to-source trails already visible
on entry. Persist only in a separate \`demo:\` IndexedDB namespace. Show the
specified persistent banner with working reset and exit actions; discard the
namespace on exit. Document the URL, sample, reset behavior, and namespace in
\`.factory/demo.md\`; test it offline with request interception.

### F-1-3 — BLOCKING — claims contract is absent; visitor-relevant claims are unlisted and untested

**Location / evidence:** \`.factory/claims.json\` does not exist. A repository
search for \`@claim:\`, \`claims.json\`, and \`demo\` found no claim tags. There were
zero listed claim commands to run from the clean install. \`npm test\`, \`npm run
build\`, and \`npm run test:e2e\` passed (7 unit and 4 browser tests), but that is
not a substitute for the required manifest and tagged observable tests.

With no manifest, every claim-like statement is unlisted, including landing
**“Autosaves locally.”**, **“Nothing is sent to a server.”**, **“Your work stays
in this browser until you export it.”**, and the README promises about IndexedDB,
exports, accounts, sync, analytics, server storage, keyboard, and offline use.

**Concrete fix:** add \`.factory/claims.json\`. Give each reliable claim one
\`@claim:<id>\` test which starts from the demo URL and observes the result. At
minimum cover demo isolation/reset, JSON/CSV/citation/template export, offline
reload after first demo visit, local persistence, and no off-origin
network/workbook upload. Remove or narrow anything that cannot be tested.

### F-1-4 — BLOCKING — required product routes and designed 404 are missing

**Location / evidence:** \`/demo\` is a server 404; an arbitrary deep link
\`/this-route-should-not-exist\` produces the generic **“Azure Static Web Apps -
404: Not found”** document, with no \`h1\`, no product styling, and no way back.
There is no product 404 source in \`public/\`. The lack of \`/demo\` also means the
address bar and back button cannot represent the required demo state.

**Concrete fix:** ship a designed product 404 with one \`h1\` and a home link,
and configure it as the static host's 404 route. Add the real \`/demo\` route and
route-aware title, focus-to-\`h1\`, announcement, deep-link reload, and back/
forward behavior.

### F-1-5 — MAJOR — route metadata and standard site skeleton are incomplete

**Location / evidence:** the root has a valid title, description, favicon PNG,
and one \`main\`, but no canonical link, Open Graph tags, Twitter card, SVG
favicon, or 180 px Apple touch icon. \`/sitemap.xml\` and \`/favicon.svg\` return
404. The legal pages have descriptions and titles but likewise lack canonical,
OG/Twitter, and icon metadata.

The legal pages use only **“← Back to Source Trail Workbook”** as a header and
a text-only footer. They lack the shared wordmark, skip link, navigation,
Privacy/Terms links, **“Built by Param Factory”**, and a version/build id. The
landing footer also omits the latter two required items. Browser navigation to
Privacy left focus on the document body rather than its \`h1\`.

**Concrete fix:** add per-route canonical, complete OG/Twitter metadata using a
1200×630 product-art image, an SVG favicon and 180 px Apple icon, and a sitemap
listing \`/\`, \`/demo\`, \`/privacy/\`, \`/terms/\`, and the 404 route. Use the same
header/footer skeleton on every route; manage focus and \`aria-live\` text on
client-side route changes (or ensure equivalent focus on full-page navigation).

### F-1-6 — MINOR — copy is slogan-first, contains jargon, and has overlong sentences

**Location / evidence:** see the complete audit below. Notable failures are
**“Show the trail.”** and **“Distribute the question, not the answers.”**
(headings that do not stand alone), **“Interrogate the source”** (jargon),
**“defensible claim”**, **“local-first”**, and **“offline-first”** (jargon),
plus the 23- and 29-word README sentences.

**Concrete fix:** use the rewrite in F-1-1; change **“Interrogate the source”**
to **“Check the source”**, **“One visible path from question to defensible
claim.”** to **“See how a question becomes a supported claim.”**, and
**“Local-first”** to **“Stored only in this browser.”** Split the two long
sentences as shown in the audit.

## Demo and claims result

**Demo: FAIL.** A fresh browser context at both 390×844 and 1440×900 found no
demo entry point. \`/?demo=1\` did not seed data or display a demo banner. The
normal offline test included in \`npm run test:e2e\` passed, but it cannot prove
the required demo's offline behavior or isolation.

**Claims: FAIL.** \`.factory/claims.json\` is absent, so every listed claim test
is absent and cannot be run. There is no basis to validate privacy/offline
claims with the required demo-based network interception.

## Copy audit

Word counts treat contractions, hyphenated compounds, version numbers, and
technical labels as one word. This includes headings and action labels so that
out-of-context copy is checked; URLs and shell commands are not sentences.
An exclamation marker means a finding and gives the proposed replacement.

### Landing page

| Visitor-facing sentence or label | Words | Review |
| --- | ---: | --- |
| Source Trail Workbook | 3 | Product name, not task headline; see F-1-1. |
| Show the thinking between search and claim. | 7 | ! Abstract; use “Record how a search supports a research claim.” |
| Offline research worksheet / v1 | 4 | ! “Offline” is a claim and “v1” is unexplained; use “A browser worksheet for research evidence.” |
| Don’t just list the source. | 5 | ! Slogan; replace with F-1-1 headline. |
| Show the trail. | 3 | ! Undefined “trail”; replace with F-1-1 headline. |
| Capture the query you tried, the result you rejected, the source you checked, and the evidence behind every claim. | 19 | Clear but makes an unlisted capability claim. |
| Your work stays in this browser until you export it. | 11 | Unlisted privacy/storage claim. |
| Start a workbook | 3 | ! Does not name a result; use “Try it with sample data” / “Create a blank workbook.” |
| Import JSON | 2 | Result-naming verb; import support must be claimed/tested. |
| Install app | 2 | Result-naming verb; advertised feature needs a claim/test. |
| Autosaves locally. | 2 | Unlisted claim. |
| Nothing is sent to a server. | 6 | Unlisted privacy claim. |
| One visible path from question to defensible claim. | 8 | ! “Defensible” is jargon; use “See how a question becomes a supported claim.” |
| The classroom loop | 3 | ! Context-poor heading; use “How to record a research trail.” |
| Three moves. | 2 | ! Context-poor fragment; use the preceding rewrite. |
| Every trail. | 2 | ! Context-poor fragment; remove. |
| Record the search | 3 | Clear heading. |
| Keep the exact query and one result you passed over. | 11 | Clear. |
| Interrogate the source | 3 | ! Jargon; use “Check the source.” |
| Name who made it, what supports it, and what limits it. | 11 | Clear. |
| Connect evidence | 2 | Clear heading. |
| Write the claim, a short quotation, and why the link holds. | 11 | Clear. |
| For instructors | 2 | Audience arrives too late; move to hero support copy. |
| Distribute the question, not the answers. | 6 | ! Slogan; use “Give students a blank research-trail template.” |
| Start a workbook, add the course prompt and instructions, then export a blank template JSON. | 14 | Clear, but unlisted feature claim. |
| Students import it and return a complete workbook file. | 9 | Clear, but unlisted feature claim. |
| Local-first. | 1 | ! Jargon; use “Stored only in this browser.” |
| No account, analytics, or uploads. | 5 | Unlisted privacy claim. |
| Hero art generated for Source Trail Workbook. | 7 | Clear provenance note. |

### README

| README sentence or prose label | Words | Review |
| --- | ---: | --- |
| Source Trail Workbook | 3 | Product name only. |
| Source Trail Workbook is a free, offline-first classroom worksheet for showing the reasoning between a search and a claim. | 19 | ! “offline-first” is jargon and a claim; use “Source Trail Workbook helps classes record how a search supports a claim.” |
| It is built for humanities instructors and undergraduate researchers who need to review more than a final bibliography. | 16 | Clear audience. |
| What it does | 4 | Clear heading. |
| Each source trail keeps these parts together: | 7 | Clear. |
| the exact query, where it was run, and why it was worded that way; | 13 | Clear list item. |
| one rejected result and the reason it was rejected; | 9 | Clear list item. |
| source metadata plus notes about creator, evidence, and limitations; | 9 | ! “metadata” is specialist wording; use “source details.” |
| a claim, its relationship to the source, a short quotation or paraphrase, and the student's explanation of the connection. | 17 | Clear. |
| The trail index labels entries as Started, Needs evidence, or Ready to review, and separately calls out claims whose evidence link is incomplete. | 23 | ! Over 22 words; split after “Ready to review.” |
| Workbooks autosave to IndexedDB. | 4 | Unlisted storage claim; “IndexedDB” is technical in user-facing copy. |
| Students can export a complete JSON workbook, a CSV trail table, or draft citations as text. | 15 | Unlisted feature claim. |
| Instructors can set the question and assignment instructions, then export a blank template JSON for students to import. | 18 | Unlisted feature claim. |
| There is no account, sync service, analytics, or server-side workbook storage. | 10 | Unlisted privacy claim. |
| Run locally | 2 | Clear heading. |
| Requirements: Node.js 20.19+ (Node 22 recommended) and npm. | 7 | Clear. |
| Open the URL Vite prints. | 5 | Clear. |
| For a reproducible production build: | 6 | Clear label. |
| The exact deploy artifact is dist/, with dist/index.html at its root. | 10 | Clear developer guidance. |
| Test | 1 | Clear heading. |
| model, import validation, citations, and CSV | 6 | Clear command comment. |
| builds, then exercises Chromium, axe, mobile, and offline | 8 | ! “axe” is unexplained; use “checks accessibility, mobile layout, and offline reload.” |
| Playwright is pinned to 1.58.2. | 5 | Clear developer claim. |
| Browser binaries must be installed or supplied through PLAYWRIGHT_BROWSERS_PATH. | 8 | Clear developer guidance. |
| Keyboard and data ownership | 4 | Clear heading. |
| Standard Tab, Enter, and Space behavior works throughout. | 7 | Unlisted accessibility claim. |
| Export JSON before clearing site data or moving to another device. | 11 | Clear. |
| Importing a valid workbook replaces the one stored locally after confirmation. | 11 | Unlisted feature claim. |
| Citation exports are intentionally labeled as drafts; formatting does not establish source quality and should be checked against the course style guide. | 20 | Clear, but split for easier scanning. |
| Deploy | 1 | Clear heading. |
| Deploy dist/ to Azure Static Web Apps. | 6 | Clear. |
| The built staticwebapp.config.json sets the production response policy: content-addressed files under assets/ are cached for one year with immutable; HTML, the manifest, and sw.js revalidate so updates can be discovered. | 29 | ! Over 22 words; split after “immutable.” |
| It also enforces a self-only CSP, one-year HSTS, and the manifest JSON media type. | 15 | Technical developer language; clear enough for this section. |
| /privacy/ and /terms/ are emitted as standalone pages. | 6 | Clear. |
| The researched scope is recorded in .factory/brief.json | 7 | Clear developer guidance. |
| and the product-specific visual system and generated-image provenance are in .factory/design.md. | 11 | Sentence fragment; join to preceding sentence. |
| License | 1 | Clear heading. |
| MIT. | 1 | Clear. |
| See LICENSE. | 2 | Clear. |

| Non-claim local gate | Result | Evidence |
| --- | --- | --- |
| \`npm test\` | PASS | 7 tests passed. |
| \`npm run build\` | PASS | \`dist/\` emitted. |
| \`npm run test:e2e\` | PASS | 4 tests passed. |

## Earlier-review / handoff regression check

There are no earlier .factory/review-*.md or .factory/polish-*.md files. I read
both prior verification reports and the previous handoff. Their reported defects
were rechecked against the live page and source:

| Earlier ID | Current result | Evidence |
| --- | --- | --- |
| Verification-1 M2 — invalid locator labelled ready | Fixed | Current trailStatus calls isAuditableSourceUrl; the existing Playwright case passed. |
| Verification-1 M2 — hashed assets not immutable | Fixed | Live assets/index-DpOqpYg7.js returns cache-control: public, max-age=31536000, immutable. |
| Verification-1 M3 — CSP/HSTS/manifest policy gaps | Fixed | Live root sends self-only CSP and one-year preload HSTS; manifest is application/manifest+json. |

Those fixes are real and are not re-raised. The new findings above result from
the separate first-read/demo/claims/site-structure contract.

## Structure, link, and visual checks

- The visual identity is distinct and follows the documented seminar-handout
  direction; this was not a generic SaaS-template finding.
- Root and legal direct links returned 200. The skip hash is valid. The root
  links to /privacy/ and /terms/; their mailto contacts are explicit.
- The root title is under 60 characters and follows the desired product/what
  pattern. Root has one h1, but it is the name rather than the job headline.
- robots.txt returns 200; sitemap.xml, /demo, and /favicon.svg return 404. The
  generic 404 logs a browser console error for its failed response.

## What would make this perfect

Put an immediately usable, isolated completed classroom trail behind a plainly
named demo action; make the first h1 say who can use it and what changes; back
every observable promise with a demo-based claims test; and finish the
route/metadata/footer/404 skeleton. Then repeat this complete audit from a
fresh browser context until the claims manifest, demo flow, and every listed
route pass with no remaining findings.
