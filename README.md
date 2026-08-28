# Source Trail Workbook

Source Trail Workbook is a free, offline-first classroom worksheet for showing
the reasoning between a search and a claim. It is built for humanities
instructors and undergraduate researchers who need to review more than a final
bibliography.

Live site: <https://source-trail-workbook.sociobot.in>

## What it does

Each source trail keeps these parts together:

- the exact query, where it was run, and why it was worded that way;
- one rejected result and the reason it was rejected;
- source metadata plus notes about creator, evidence, and limitations;
- a claim, its relationship to the source, a short quotation or paraphrase, and
  the student's explanation of the connection.

The trail index labels entries as **Started**, **Needs evidence**, or **Ready to
review**, and separately calls out claims whose evidence link is incomplete.

Workbooks autosave to IndexedDB. Students can export a complete JSON workbook,
a CSV trail table, or draft citations as text. Instructors can set the question
and assignment instructions, then export a blank template JSON for students to
import. There is no account, sync service, analytics, or server-side workbook
storage.

## Run locally

Requirements: Node.js 20.19+ (Node 22 recommended) and npm.

```sh
npm install
npm run dev
```

Open the URL Vite prints. For a reproducible production build:

```sh
npm ci
npm run build
```

The exact deploy artifact is `dist/`, with `dist/index.html` at its root.

## Test

```sh
npm test          # model, import validation, citations, and CSV
npm run test:e2e  # builds, then exercises Chromium, axe, mobile, and offline
```

Playwright is pinned to 1.58.2. Browser binaries must be installed or supplied
through `PLAYWRIGHT_BROWSERS_PATH`.

## Keyboard and data ownership

- `Ctrl`/`Cmd` + `S`: save now
- `Ctrl`/`Cmd` + `Enter`: add a trail
- Standard Tab, Enter, and Space behavior works throughout.

Export JSON before clearing site data or moving to another device. Importing a
valid workbook replaces the one stored locally after confirmation. Citation
exports are intentionally labeled as drafts; formatting does not establish
source quality and should be checked against the course style guide.

## Deploy

Deploy `dist/` to Azure Static Web Apps. The built
`staticwebapp.config.json` sets the production response policy: content-addressed
files under `assets/` are cached for one year with `immutable`; HTML, the
manifest, and `sw.js` revalidate so updates can be discovered. It also enforces
a self-only CSP, one-year HSTS, and the manifest JSON media type. `/privacy/`
and `/terms/` are emitted as standalone pages.

The researched scope is recorded in [`.factory/brief.json`](.factory/brief.json)
and the product-specific visual system and generated-image provenance are in
[`.factory/design.md`](.factory/design.md).

## License

MIT. See [LICENSE](LICENSE).
