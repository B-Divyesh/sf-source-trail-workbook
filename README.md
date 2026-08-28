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

The demo uses separate browser storage from your real workbook.
Reset restores its three humanities trails.
Starting for real clears the demo and opens your real workspace.

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

The built site is in `dist/`, with `dist/index.html` at its root.

## Test

```sh
npm test
npm run test:e2e
npm run test:claims
```

## Keyboard and data ownership

- `Ctrl`/`Cmd` + `S`: save now
- `Ctrl`/`Cmd` + `Enter`: add a trail

Export JSON before clearing site data or moving to another device.
Importing a valid workbook asks before replacing the workbook saved in your browser.

Citation exports are drafts.
Check them against the course style guide because formatting does not establish source quality.

## Deploy

Deploy `dist/` to Azure Static Web Apps.
The included host settings keep versioned asset files for one year.
HTML and offline-app files check for updates instead of using that long-lived cache.

The security settings block outside scripts and require secure connections.
They also send missing routes to the designed `404.html` page.

The researched scope is in [`.factory/brief.json`](.factory/brief.json).
The visual-system document records how the original image was made.

## License

MIT. See [LICENSE](LICENSE).
