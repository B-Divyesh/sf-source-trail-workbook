# Demo sandbox

- Primary demo URL: <https://source-trail-workbook.sociobot.in/?demo=1>
- Direct route: <https://source-trail-workbook.sociobot.in/demo/>
- Local URL: <http://127.0.0.1:4173/?demo=1>

Both entries open the workbook immediately with three completed humanities trails about British coffeehouses and public debate.

Demo data is stored only under the `demo:current` key in the `workbooks` store of the `source-trail-workbook` IndexedDB database.
Real work uses `workbook:current`.
The app never reads or writes the real key while the demo banner is shown.

**Reset demo** deletes the demo key and recreates the original sample.
**Start for real** deletes the demo key and opens the real start screen.
No demo edits are copied into the real workbook.

The sample is packaged in the app bundle and remains available after the service worker controls the page.
