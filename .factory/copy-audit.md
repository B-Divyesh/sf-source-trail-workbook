# Copy audit — polish 2

Counts treat contractions, hyphenated terms, version numbers, and file names as
one word. No visitor-facing sentence exceeds 22 words or uses a banned marketing
word. Terminology stays consistent across the product and README.

## Landing page

| Visitor-facing text | Words | Result |
| --- | ---: | --- |
| This workbook needs JavaScript to save entries locally and export files. | 11 | Pass |
| Skip to main content | 4 | Pass |
| Source Trail Workbook | 3 | Product name |
| Home | 1 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| A browser worksheet for research evidence | 6 | Pass |
| Trace research claims to their sources | 6 | Pass; `@claim:core-workflow` |
| For students and instructors who need to show how a search became a claim. | 13 | Pass |
| Try it with sample data | 5 | Pass |
| Opens a sample workbook with three completed research trails. | 9 | Pass; `@claim:demo-isolation` |
| Create a blank workbook | 4 | Pass |
| Continue your workbook | 3 | Pass |
| Create a new workbook | 4 | Pass |
| Import JSON | 2 | Pass; `@claim:json-import-replacement` |
| Install app | 2 | Pass; `@claim:install-action` |
| Free to use. | 3 | Pass; `@claim:free-use` |
| Works offline after the first visit. | 6 | Pass; `@claim:offline-reload` |
| Workbook content stays in this browser. | 6 | Pass; `@claim:privacy-local` |
| See how a question becomes a supported claim. | 8 | Pass; `@claim:core-workflow` |
| Three steps | 2 | Context label |
| How to record a research trail | 6 | Pass |
| Record the search | 3 | Pass |
| Keep the exact query and one result you passed over. | 10 | Pass; `@claim:core-workflow` |
| Check the source | 3 | Pass |
| Name who made it, what supports it, and what limits it. | 11 | Pass; `@claim:core-workflow` |
| Connect evidence | 2 | Pass |
| Write the claim, a short quotation, and why the link holds. | 11 | Pass; `@claim:core-workflow` |
| For instructors | 2 | Context label |
| Give students a blank research-trail template | 6 | Pass |
| Add the course prompt and instructions, then export a blank template. | 11 | Pass; `@claim:template-roundtrip` |
| Students import it and return their completed workbook. | 8 | Pass; `@claim:template-roundtrip` |
| Record how a search supports a research claim. | 8 | Pass; `@claim:core-workflow` |
| Terms | 1 | Pass |
| Built by Param Factory (external site) | 6 | Pass; destination is explicit |
| v1.2.0 · polish 2 | 3 | Build identifier |
| Original hero art generated for Source Trail Workbook. | 8 | Pass; `@claim:hero-provenance` |

Conditional status text is also plain: “Offline mode — edits still save on this
device.” is eight words; “A fresh app version is ready.” is six words.

## README

| Sentence or label | Words | Result |
| --- | ---: | --- |
| Source Trail Workbook helps classes record how a search supports a claim. | 12 | Pass; `@claim:core-workflow` |
| It is for humanities instructors and undergraduate researchers who need to review the reasoning behind a bibliography. | 17 | Pass |
| Each source trail keeps these parts together. | 7 | Pass; list covered by `@claim:core-workflow` |
| The index labels each trail as Started, Needs evidence, or Ready to review. | 13 | Pass; `@claim:status-evaluation` |
| It also identifies a claim whose evidence link is incomplete or malformed. | 12 | Pass; `@claim:status-evaluation` |
| Workbook edits stay in browser storage and persist across reloads. | 10 | Pass; `@claim:local-persistence` |
| Students can export workbook JSON, a CSV trail table, or draft citations. | 12 | Pass; three export claims |
| Instructors can export a blank assignment template for students to import. | 11 | Pass; `@claim:template-roundtrip` |
| No account is required, and workbook content is not uploaded. | 10 | Pass; `@claim:free-use`, `@claim:privacy-local` |
| The demo uses separate browser storage from your real workbook. | 10 | Pass; `@claim:demo-isolation` |
| Reset restores its three humanities trails. | 6 | Pass; `@claim:demo-isolation` |
| Starting for real clears the demo and opens your real workspace. | 11 | Pass; `@claim:demo-isolation` |
| Use Node.js 20.19 or newer and npm. | 7 | Necessary tool names |
| Open the URL printed by Vite. | 6 | Necessary tool name |
| The built site is in dist, with dist/index.html at its root. | 11 | Pass; `@claim:build-output` |
| Importing a valid workbook asks before replacing the workbook saved in your browser. | 13 | Pass; `@claim:json-import-replacement` |
| Citation exports are drafts. | 4 | Pass; `@claim:citation-export` |
| Check them against the course style guide because formatting does not establish source quality. | 14 | Pass |
| The included host settings keep versioned asset files for one year. | 11 | Pass; `@claim:deployment-policy` |
| HTML and offline-app files check for updates instead of using that long-lived cache. | 13 | Pass; `@claim:deployment-policy` |
| The security settings block outside scripts and require secure connections. | 10 | Pass; `@claim:deployment-policy` |
| They also send missing routes to the designed 404.html page. | 10 | Pass; `@claim:designed-404` |
| The visual-system document records how the original image was made. | 10 | Pass; `@claim:hero-provenance` |

## Terminology

| Concept | One term used |
| --- | --- |
| Full assignment file | workbook |
| One search-to-claim record | trail |
| Pre-filled trial workspace | demo |
| Reusable response-free file | template |
| Source extract | quotation or paraphrase |
| Completion label | status |
| Device-only persistence | browser storage |
