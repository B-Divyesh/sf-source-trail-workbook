# Source Trail Workbook

Source Trail Workbook helps classes record how a search supports a claim.
It is for humanities instructors and undergraduate researchers who need to review the reasoning behind a bibliography.

Live site: <https://source-trail-workbook.sociobot.in>

Sample workbook: <https://source-trail-workbook.sociobot.in/?demo=1>

## What it does

Each source trail keeps these parts together:

- the exact query, search location, and reason for the wording;
- one rejected result and the reason it was rejected;
- source details plus notes about the creator, evidence, and limits;
- a claim, its source relationship, a short quotation, and the student's explanation.

The index labels each trail as **Started**, **Needs evidence**, or **Ready to review**.
It also identifies a claim whose evidence link is incomplete or malformed.

Workbook edits stay in browser storage and persist across reloads.
Students can export workbook JSON, a CSV trail table, or draft citations.
Instructors can export a blank assignment template for students to import.
No account is required, and workbook content is not uploaded.

The sample demo uses a separate `demo:current` IndexedDB key.
Reset restores its three humanities trails.
Starting for real deletes the demo key and opens the separate real workspace.

## Run locally

Use Node.js 20.19 or newer and npm.

```sh
npm install
npm run dev
```

Open the URL printed by Vite.

Build the production files with:

```sh
npm ci
npm run build
```

The deploy artifact is `dist/`, with `dist/index.html` at its root.

## Test

```sh
npm test
npm run test:e2e
npm run test:claims
```

The browser suite checks the full workflow, accessibility, mobile layout, privacy, downloads, routing, and offline reload.
Playwright is pinned to 1.58.2.

Every visitor-facing promise and its clean-state command are listed in [`.factory/claims.json`](.factory/claims.json).

## Keyboard and data ownership

- `Ctrl`/`Cmd` + `S`: save now
- `Ctrl`/`Cmd` + `Enter`: add a trail

Export JSON before clearing site data or moving to another device.
Importing a valid workbook replaces the locally stored workbook after confirmation.

Citation exports are drafts.
Check them against the course style guide because formatting does not establish source quality.

## Deploy

Deploy `dist/` to Azure Static Web Apps.
The response policy gives hashed assets a one-year immutable cache.
HTML, the manifest, and the service worker revalidate so updates can appear.

The policy also sets a self-only CSP, one-year HSTS, and the manifest media type.
It serves the designed `404.html` for missing routes.

The researched scope is in [`.factory/brief.json`](.factory/brief.json).
The visual system and original-image provenance are in [`.factory/design.md`](.factory/design.md).

## License

MIT. See [LICENSE](LICENSE).
