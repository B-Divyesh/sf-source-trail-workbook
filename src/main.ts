import './styles.css';
import { citationsText, workbookCsv } from './citations';
import { loadWorkbook, saveWorkbook as persistWorkbook } from './db';
import { createTrail, createWorkbook, isUnsupported, makeTemplate, now, parseWorkbook, trailName, trailStatus } from './model';
import type { Trail, TrailStatus, Workbook } from './types';

const app = document.querySelector<HTMLDivElement>('#app')!;
if (!app) throw new Error('App mount point is missing.');

let workbook: Workbook | null = null;
let currentTrailId = '';
let screen: 'start' | 'workbook' = 'start';
let saveTimer: number | undefined;
let storageAvailable = true;
let pendingInstall: BeforeInstallPromptEvent | null = null;
let allowUpdateReload = false;

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const escapeHtml = (value: unknown) => String(value ?? '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const statusLabel = (status: TrailStatus) => ({
  started: 'Started',
  'needs-evidence': 'Needs evidence',
  ready: 'Ready to review',
}[status]);

const mark = `<span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><b></b></span>`;

function header(): string {
  return `
    <a class="skip-link" href="#main-content">Skip to workbook</a>
    <div class="offline-strip" id="offline-strip" ${navigator.onLine ? 'hidden' : ''}>
      Offline mode — edits still save on this device.
    </div>
    <header class="site-header">
      <div class="identity">${mark}<h1>Source Trail Workbook</h1></div>
      <p class="tagline">Show the thinking between search and claim.</p>
      ${screen === 'workbook' ? `
        <nav class="header-actions" aria-label="Workbook actions">
          <button class="button button-quiet" data-action="close-workbook">Close</button>
          <details class="export-menu">
            <summary class="button button-ink">Export</summary>
            <div class="export-panel">
              <button data-action="export-json">Workbook JSON</button>
              <button data-action="export-template">Blank template JSON</button>
              <button data-action="export-csv">Trail table CSV</button>
              <button data-action="export-citations">Citations text</button>
            </div>
          </details>
        </nav>` : ''}
    </header>`;
}

function footer(): string {
  return `<footer class="site-footer">
    <p>Local-first. No account, analytics, or uploads.</p>
    <nav aria-label="Legal"><a href="/privacy/">Privacy</a><a href="/terms/">Terms</a></nav>
    <p class="image-note">Hero art generated for Source Trail Workbook.</p>
  </footer>`;
}

function startView(): string {
  const hasWorkbook = Boolean(workbook);
  return `${header()}
    <main id="main-content" class="landing" tabindex="-1">
      <section class="hero-copy" aria-labelledby="hero-heading">
        <p class="eyebrow">Offline research worksheet / v1</p>
        <h2 id="hero-heading">Don’t just list the source.<br><span>Show the trail.</span></h2>
        <p class="lede">Capture the query you tried, the result you rejected, the source you checked, and the evidence behind every claim. Your work stays in this browser until you export it.</p>
        <div class="hero-actions">
          ${hasWorkbook ? '<button class="button button-primary" data-action="continue-workbook">Continue workbook <span aria-hidden="true">→</span></button>' : '<button class="button button-primary" data-action="new-workbook">Start a workbook <span aria-hidden="true">→</span></button>'}
          ${hasWorkbook ? '<button class="button button-secondary" data-action="new-workbook">Start over</button>' : ''}
          <button class="button button-secondary" data-action="import">Import JSON</button>
          <button class="button button-quiet install-button" data-action="install" hidden>Install app</button>
        </div>
        <p class="privacy-note"><span aria-hidden="true">●</span> Autosaves locally. Nothing is sent to a server.</p>
      </section>
      <figure class="hero-figure">
        <picture>
          <source media="(max-width: 700px)" srcset="/assets/research-trail-hero-960.webp" />
          <img src="/assets/research-trail-hero-1536.webp" srcset="/assets/research-trail-hero-960.webp 960w, /assets/research-trail-hero-1536.webp 1536w" sizes="(max-width: 800px) 94vw, 48vw" width="1536" height="1024" alt="Five torn paper notes connected by blue arrows, moving from a question through search results and a source to a quotation and final claim." fetchpriority="high" decoding="async" />
        </picture>
        <figcaption>One visible path from question to defensible claim.</figcaption>
      </figure>
      <section class="method" aria-labelledby="method-heading">
        <p class="eyebrow">The classroom loop</p>
        <h2 id="method-heading">Three moves. Every trail.</h2>
        <ol class="method-list">
          <li><span>01</span><div><h3>Record the search</h3><p>Keep the exact query and one result you passed over.</p></div></li>
          <li><span>02</span><div><h3>Interrogate the source</h3><p>Name who made it, what supports it, and what limits it.</p></div></li>
          <li><span>03</span><div><h3>Connect evidence</h3><p>Write the claim, a short quotation, and why the link holds.</p></div></li>
        </ol>
      </section>
      <aside class="teacher-note">
        <p class="eyebrow">For instructors</p>
        <h2>Distribute the question, not the answers.</h2>
        <p>Start a workbook, add the course prompt and instructions, then export a blank template JSON. Students import it and return a complete workbook file.</p>
      </aside>
    </main>
    ${footer()}
    ${globalOverlays()}`;
}

function statusBadge(trail: Trail): string {
  const status = trailStatus(trail);
  return `<span class="status status-${status}"><span aria-hidden="true"></span>${statusLabel(status)}</span>`;
}

function workbookSummary(): { ready: number; unsupported: number } {
  if (!workbook) return { ready: 0, unsupported: 0 };
  return {
    ready: workbook.trails.filter((trail) => trailStatus(trail) === 'ready').length,
    unsupported: workbook.trails.filter(isUnsupported).length,
  };
}

function trailList(): string {
  if (!workbook) return '';
  if (!workbook.trails.length) return '<p class="rail-empty">No trails yet. Add one when you begin searching.</p>';
  return `<ol class="trail-list">${workbook.trails.map((trail, index) => `
    <li>
      <button class="trail-link ${trail.id === currentTrailId ? 'is-current' : ''}" data-action="select-trail" data-id="${escapeHtml(trail.id)}" ${trail.id === currentTrailId ? 'aria-current="step"' : ''}>
        <span class="trail-number">${String(index + 1).padStart(2, '0')}</span>
        <span class="trail-link-copy"><strong>${escapeHtml(trailName(trail, index))}</strong>${statusBadge(trail)}${isUnsupported(trail) ? '<small>Claim needs a source link</small>' : ''}</span>
      </button>
    </li>`).join('')}</ol>`;
}

function field(id: string, label: string, value: string, options: { type?: string; hint?: string; placeholder?: string; required?: boolean; trail?: boolean } = {}): string {
  const hintId = options.hint ? `${id}-hint` : '';
  return `<div class="field">
    <label for="${id}">${label}${options.required ? ' <span class="required">Required for review</span>' : ''}</label>
    ${options.hint ? `<p class="field-hint" id="${hintId}">${options.hint}</p>` : ''}
    <input id="${id}" type="${options.type ?? 'text'}" value="${escapeHtml(value)}" ${options.placeholder ? `placeholder="${escapeHtml(options.placeholder)}"` : ''} ${hintId ? `aria-describedby="${hintId}"` : ''} ${options.trail ? `data-trail-field="${id.replace('trail-', '')}"` : `data-workbook-field="${id.replace('workbook-', '')}"`} />
  </div>`;
}

function area(id: string, label: string, value: string, options: { hint?: string; placeholder?: string; required?: boolean; rows?: number; max?: number; trail?: boolean } = {}): string {
  const hintId = options.hint ? `${id}-hint` : '';
  return `<div class="field">
    <label for="${id}">${label}${options.required ? ' <span class="required">Required for review</span>' : ''}</label>
    ${options.hint ? `<p class="field-hint" id="${hintId}">${options.hint}</p>` : ''}
    <textarea id="${id}" rows="${options.rows ?? 3}" ${options.max ? `maxlength="${options.max}"` : ''} ${options.placeholder ? `placeholder="${escapeHtml(options.placeholder)}"` : ''} ${hintId ? `aria-describedby="${hintId}"` : ''} ${options.trail ? `data-trail-field="${id.replace('trail-', '')}"` : `data-workbook-field="${id.replace('workbook-', '')}"`}>${escapeHtml(value)}</textarea>
    ${options.max ? `<span class="char-count" id="${id}-count">${value.length}/${options.max}</span>` : ''}
  </div>`;
}

function select(id: string, label: string, value: string, values: Array<[string, string]>, trail = true): string {
  return `<div class="field"><label for="${id}">${label}</label><select id="${id}" ${trail ? `data-trail-field="${id.replace('trail-', '')}"` : `data-workbook-field="${id.replace('workbook-', '')}"`}>${values.map(([key, name]) => `<option value="${key}" ${value === key ? 'selected' : ''}>${name}</option>`).join('')}</select></div>`;
}

function trailEditor(trail: Trail, index: number): string {
  const unsupported = isUnsupported(trail);
  return `<article class="trail-sheet" aria-labelledby="trail-heading">
    <div class="sheet-heading">
      <div><p class="eyebrow">Trail ${String(index + 1).padStart(2, '0')}</p><h2 id="trail-heading">${escapeHtml(trailName(trail, index))}</h2></div>
      <div class="sheet-state">${statusBadge(trail)}<button class="text-button danger-link" data-action="delete-trail">Delete trail</button></div>
    </div>
    <div class="unsupported-note" ${unsupported ? '' : 'hidden'} id="unsupported-note" role="status"><strong>Claim check:</strong> Add a source title, short quotation, and explanation so an instructor can follow this claim.</div>
    <form id="trail-form" novalidate>
      <section class="form-section" aria-labelledby="section-search">
        <div class="section-marker">1</div><div class="section-body">
          <div class="section-heading"><div><p class="eyebrow">Search decision</p><h3 id="section-search">What path did you take?</h3></div><p>Preserve the choice, not just the result.</p></div>
          ${field('trail-label', 'Short label for this trail', trail.label, { hint: 'A private signpost, such as “Stoic grief claim”.', trail: true })}
          ${field('trail-query', 'Exact search query', trail.query, { placeholder: 'e.g. Seneca grief consolation primary source', required: true, trail: true })}
          <div class="field-grid">
            ${field('trail-searchLocation', 'Where did you search?', trail.searchLocation, { placeholder: 'Library catalog, Google Scholar…', trail: true })}
            ${area('trail-queryReason', 'Why this wording?', trail.queryReason, { rows: 2, placeholder: 'Terms added, removed, or narrowed…', trail: true })}
          </div>
          <div class="rejected-block">
            <p class="mini-title">One result you rejected</p>
            <div class="field-grid">
              ${field('trail-rejectedResult', 'Result title or URL', trail.rejectedResult, { trail: true })}
              ${area('trail-rejectionReason', 'Why did you pass it over?', trail.rejectionReason, { rows: 2, placeholder: 'Too general, unclear authorship, paywalled…', trail: true })}
            </div>
          </div>
        </div>
      </section>

      <section class="form-section" aria-labelledby="section-source">
        <div class="section-marker">2</div><div class="section-body">
          <div class="section-heading"><div><p class="eyebrow">Source record</p><h3 id="section-source">What did you inspect?</h3></div><p>Metadata helps locate a source; it does not prove quality.</p></div>
          ${field('trail-sourceTitle', 'Source title', trail.sourceTitle, { required: true, trail: true })}
          <div class="field-grid">
            ${field('trail-sourceAuthor', 'Author or creator', trail.sourceAuthor, { trail: true })}
            ${field('trail-sourcePublisher', 'Publisher, journal, or site', trail.sourcePublisher, { trail: true })}
            ${field('trail-sourceDate', 'Publication date', trail.sourceDate, { placeholder: 'YYYY, full date, or n.d.', trail: true })}
            ${field('trail-sourceType', 'Source type', trail.sourceType, { placeholder: 'Book, article, archive…', trail: true })}
          </div>
          ${field('trail-sourceUrl', 'Source URL or stable identifier', trail.sourceUrl, { type: 'url', required: true, trail: true, hint: 'Link to the source record; do not paste paywalled content.' })}
        </div>
      </section>

      <section class="form-section" aria-labelledby="section-credibility">
        <div class="section-marker">3</div><div class="section-body">
          <div class="section-heading"><div><p class="eyebrow">Credibility notes</p><h3 id="section-credibility">Why should this source carry weight?</h3></div><p>A formatted citation is not a quality check.</p></div>
          ${area('trail-credibilityCreator', 'Who made it—and what qualifies them?', trail.credibilityCreator, { rows: 3, trail: true })}
          ${area('trail-credibilityEvidence', 'What evidence, method, or editorial process supports it?', trail.credibilityEvidence, { rows: 3, trail: true })}
          ${area('trail-credibilityLimits', 'What perspective, gap, or limitation matters?', trail.credibilityLimits, { rows: 3, trail: true })}
        </div>
      </section>

      <section class="form-section claim-section" aria-labelledby="section-claim">
        <div class="section-marker">4</div><div class="section-body">
          <div class="section-heading"><div><p class="eyebrow">Claim ↔ evidence</p><h3 id="section-claim">What does this source let you say?</h3></div><p>Use a short quotation and explain the connection in your own words.</p></div>
          ${area('trail-claim', 'Your claim', trail.claim, { rows: 3, required: true, trail: true })}
          ${select('trail-relationship', 'This source…', trail.relationship, [['supports', 'Supports the claim'], ['contradicts', 'Contradicts the claim'], ['complicates', 'Complicates the claim']])}
          <div class="quote-field">
            ${area('trail-quote', 'Short quotation or paraphrase', trail.quote, { hint: 'Keep it brief. Do not copy substantial paywalled text.', rows: 4, max: 900, required: true, trail: true })}
          </div>
          ${field('trail-locator', 'Page, section, timestamp, or paragraph', trail.locator, { placeholder: 'p. 42, para. 6, 12:08…', trail: true })}
          ${area('trail-explanation', 'Explain the connection', trail.explanation, { hint: 'What does the evidence show, and how does it support, contradict, or complicate the claim?', rows: 4, required: true, trail: true })}
        </div>
      </section>
    </form>
    <div class="sheet-footer"><p><kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>S</kbd> save · <kbd>Ctrl</kbd>/<kbd>⌘</kbd> + <kbd>Enter</kbd> new trail</p><button class="button button-primary" data-action="add-trail">Add another trail <span aria-hidden="true">＋</span></button></div>
  </article>`;
}

function workbookView(): string {
  if (!workbook) return startView();
  const summary = workbookSummary();
  const current = workbook.trails.find((trail) => trail.id === currentTrailId) ?? workbook.trails[0];
  if (current) currentTrailId = current.id;
  const currentIndex = current ? workbook.trails.indexOf(current) : -1;
  const history = workbook.history.slice(-3).reverse();
  return `${header()}
    <main id="main-content" class="workspace" tabindex="-1">
      <aside class="workbook-rail" aria-label="Workbook setup and trail index">
        <div class="rail-top">
          <p class="eyebrow">Workbook setup</p>
          ${field('workbook-title', 'Workbook title', workbook.title)}
          ${field('workbook-studentName', 'Student name', workbook.studentName, { placeholder: 'Leave blank in a template' })}
          ${field('workbook-course', 'Course or section', workbook.course)}
          ${area('workbook-researchQuestion', 'Research question', workbook.researchQuestion, { rows: 3, hint: 'The question every trail should help answer.' })}
          <details class="assignment-details" ${workbook.assignmentNotes ? 'open' : ''}>
            <summary>Assignment instructions</summary>
            ${area('workbook-assignmentNotes', 'Instructions for this workbook', workbook.assignmentNotes, { rows: 4 })}
          </details>
          ${select('workbook-citationStyle', 'Citation export style', workbook.citationStyle, [['MLA', 'MLA (basic)'], ['APA', 'APA (basic)'], ['Chicago', 'Chicago (basic)']], false)}
          <p class="citation-caveat">Draft formatting only—verify against your course guide.</p>
        </div>
        <section class="index-section" aria-labelledby="trail-index-heading">
          <div class="index-heading"><div><p class="eyebrow">Trail index</p><h2 id="trail-index-heading">${workbook.trails.length} ${workbook.trails.length === 1 ? 'trail' : 'trails'}</h2></div><button class="icon-button" data-action="add-trail" aria-label="Add a trail">＋</button></div>
          <div class="progress-strip" aria-label="Workbook progress"><span><b id="ready-count">${summary.ready}</b> ready</span><span><b id="unsupported-count">${summary.unsupported}</b> unsupported</span></div>
          <div id="trail-list-region">${trailList()}</div>
        </section>
        <section class="activity" aria-labelledby="activity-heading"><h2 id="activity-heading">Recent activity</h2>${history.length ? `<ul>${history.map((item) => `<li><span>${escapeHtml(item.action)}</span><time datetime="${escapeHtml(item.at)}">${escapeHtml(formatTime(item.at))}</time></li>`).join('')}</ul>` : '<p>No recorded changes yet.</p>'}</section>
      </aside>
      <section class="editor-region" aria-label="Current source trail">
        ${current ? trailEditor(current, currentIndex) : `<div class="empty-trails"><p class="eyebrow">Empty workbook</p><h2>Start the first trail.</h2><p>Record one real search decision, then follow it to a claim.</p><button class="button button-primary" data-action="add-trail">Add a trail</button></div>`}
      </section>
    </main>
    ${footer()}
    ${globalOverlays()}`;
}

function globalOverlays(): string {
  return `<input class="visually-hidden" type="file" id="import-file" aria-label="Choose a workbook JSON file" accept="application/json,.json" />
    <div class="live-region" id="live-region" aria-live="polite" aria-atomic="true"></div>
    <div class="save-state" id="save-state" role="status">${storageAvailable ? 'Saved locally' : 'Local save unavailable — export to keep your work'}</div>
    <div class="update-toast" id="update-toast" hidden><span>A fresh app version is ready.</span><button class="button button-small" data-action="apply-update">Update now</button></div>`;
}

function render(): void {
  app.innerHTML = screen === 'workbook' && workbook ? workbookView() : startView();
  app.setAttribute('aria-busy', 'false');
  reflectConnectivity();
  reflectInstall();
}

function formatTime(timestamp: string): string {
  const date = new Date(timestamp);
  return Number.isNaN(date.getTime()) ? 'Recently' : date.toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
}

function announce(message: string, error = false): void {
  const region = document.querySelector<HTMLElement>('#live-region');
  if (region) {
    region.textContent = message;
    region.classList.toggle('is-error', error);
  }
}

function saveIndicator(message: string): void {
  const indicator = document.querySelector<HTMLElement>('#save-state');
  if (indicator) indicator.textContent = message;
}

function record(action: string): void {
  if (!workbook) return;
  workbook.history = [...workbook.history.slice(-29), { at: now(), action }];
}

async function saveNow(action?: string): Promise<void> {
  if (!workbook) return;
  if (saveTimer) window.clearTimeout(saveTimer);
  if (action) record(action);
  workbook.updatedAt = now();
  saveIndicator('Saving…');
  try {
    await persistWorkbook(workbook);
    storageAvailable = true;
    saveIndicator(`Saved locally · ${new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}`);
  } catch {
    storageAvailable = false;
    saveIndicator('Local save unavailable — export to keep your work');
    announce('This browser blocked local saving. Export the workbook JSON to keep your work.', true);
  }
}

function scheduleSave(): void {
  saveIndicator('Saving…');
  if (saveTimer) window.clearTimeout(saveTimer);
  saveTimer = window.setTimeout(() => void saveNow(), 450);
}

function refreshDerived(): void {
  if (!workbook || screen !== 'workbook') return;
  const region = document.querySelector('#trail-list-region');
  if (region) region.innerHTML = trailList();
  const summary = workbookSummary();
  const ready = document.querySelector('#ready-count');
  const unsupported = document.querySelector('#unsupported-count');
  if (ready) ready.textContent = String(summary.ready);
  if (unsupported) unsupported.textContent = String(summary.unsupported);
  const trail = workbook.trails.find((item) => item.id === currentTrailId);
  if (!trail) return;
  const note = document.querySelector<HTMLElement>('#unsupported-note');
  if (note) note.hidden = !isUnsupported(trail);
  const heading = document.querySelector('#trail-heading');
  const index = workbook.trails.indexOf(trail);
  if (heading) heading.textContent = trailName(trail, index);
  const state = document.querySelector('.sheet-state .status');
  if (state) state.outerHTML = statusBadge(trail);
}

function filename(suffix: string): string {
  const base = (workbook?.title || 'source-trail-workbook').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'source-trail-workbook';
  return `${base}.${suffix}`;
}

function download(content: string, name: string, type: string): void {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function exportFile(kind: 'json' | 'template' | 'csv' | 'citations'): Promise<void> {
  if (!workbook) return;
  await saveNow();
  if (kind === 'json') download(JSON.stringify({ exportedAt: now(), workbook }, null, 2), filename('json'), 'application/json');
  if (kind === 'template') download(JSON.stringify({ exportedAt: now(), workbook: makeTemplate(workbook) }, null, 2), filename('template.json'), 'application/json');
  if (kind === 'csv') download(workbookCsv(workbook.trails), filename('csv'), 'text/csv;charset=utf-8');
  if (kind === 'citations') {
    const content = citationsText(workbook.trails, workbook.citationStyle);
    if (!content) { announce('Add a source title or URL before exporting citations.', true); return; }
    download(`${workbook.title}\n${workbook.citationStyle} draft citations — verify against your course guide.\n\n${content}\n`, filename('citations.txt'), 'text/plain;charset=utf-8');
  }
  announce(`${kind === 'template' ? 'Blank template' : kind === 'citations' ? 'Citations' : kind.toUpperCase()} exported.`);
}

async function importFromFile(file: File): Promise<void> {
  if (file.size > 5_000_000) throw new Error('That file is larger than 5 MB. Choose a workbook JSON file.');
  let data: unknown;
  try { data = JSON.parse(await file.text()); }
  catch { throw new Error('That file is not valid JSON. Export it again and retry.'); }
  const imported = parseWorkbook(data);
  if (workbook && !window.confirm(`Import “${imported.title}”? It will replace the workbook currently stored on this device.`)) return;
  workbook = imported;
  record(`Imported ${workbook.trails.length} ${workbook.trails.length === 1 ? 'trail' : 'trails'}`);
  currentTrailId = workbook.trails[0]?.id ?? '';
  screen = 'workbook';
  await saveNow();
  render();
  announce('Workbook imported and saved locally.');
}

function addTrail(): void {
  if (!workbook) return;
  const trail = createTrail();
  workbook.trails.push(trail);
  currentTrailId = trail.id;
  record(`Added trail ${workbook.trails.length}`);
  render();
  void saveNow();
  document.querySelector<HTMLInputElement>('#trail-label')?.focus();
}

function newWorkbook(): void {
  if (workbook && !window.confirm('Start a new workbook? Export the current workbook first if you need a copy.')) return;
  workbook = createWorkbook();
  currentTrailId = workbook.trails[0].id;
  screen = 'workbook';
  render();
  void saveNow();
  document.querySelector<HTMLInputElement>('#workbook-title')?.select();
}

async function handleAction(action: string, element: HTMLElement): Promise<void> {
  if (action === 'new-workbook') newWorkbook();
  if (action === 'continue-workbook' && workbook) { screen = 'workbook'; currentTrailId ||= workbook.trails[0]?.id ?? ''; render(); }
  if (action === 'close-workbook') { await saveNow(); screen = 'start'; render(); }
  if (action === 'add-trail') addTrail();
  if (action === 'select-trail') { currentTrailId = element.dataset.id ?? ''; render(); document.querySelector('#trail-heading')?.scrollIntoView({ block: 'start' }); }
  if (action === 'delete-trail' && workbook) {
    const trail = workbook.trails.find((item) => item.id === currentTrailId);
    if (!trail) return;
    const index = workbook.trails.indexOf(trail);
    if (!window.confirm(`Delete “${trailName(trail, index)}”? This cannot be undone.`)) return;
    workbook.trails.splice(index, 1);
    currentTrailId = workbook.trails[Math.min(index, workbook.trails.length - 1)]?.id ?? '';
    record(`Deleted trail ${index + 1}`);
    render();
    await saveNow();
  }
  if (action === 'import') document.querySelector<HTMLInputElement>('#import-file')?.click();
  if (action === 'export-json') await exportFile('json');
  if (action === 'export-template') await exportFile('template');
  if (action === 'export-csv') await exportFile('csv');
  if (action === 'export-citations') await exportFile('citations');
  if (action === 'install' && pendingInstall) { await pendingInstall.prompt(); await pendingInstall.userChoice; pendingInstall = null; reflectInstall(); }
  if (action === 'apply-update') {
    const registration = await navigator.serviceWorker?.getRegistration();
    allowUpdateReload = true;
    registration?.waiting?.postMessage({ type: 'SKIP_WAITING' });
  }
}

document.addEventListener('click', (event) => {
  const element = (event.target as HTMLElement).closest<HTMLElement>('[data-action]');
  if (!element) return;
  const action = element.dataset.action;
  if (action) void handleAction(action, element);
});

document.addEventListener('input', (event) => {
  const target = event.target as HTMLInputElement | HTMLTextAreaElement;
  if (!workbook) return;
  const workbookField = target.dataset.workbookField;
  const trailField = target.dataset.trailField;
  if (workbookField) (workbook as unknown as Record<string, string>)[workbookField] = target.value;
  if (trailField) {
    const trail = workbook.trails.find((item) => item.id === currentTrailId);
    if (trail) {
      (trail as unknown as Record<string, string>)[trailField] = target.value;
      trail.updatedAt = now();
    }
  }
  if (target.maxLength > 0) {
    const counter = document.querySelector(`#${CSS.escape(target.id)}-count`);
    if (counter) counter.textContent = `${target.value.length}/${target.maxLength}`;
  }
  workbook.updatedAt = now();
  refreshDerived();
  scheduleSave();
});

document.addEventListener('change', (event) => {
  const target = event.target as HTMLInputElement | HTMLSelectElement;
  if (target.id === 'import-file' && target instanceof HTMLInputElement && target.files?.[0]) {
    importFromFile(target.files[0]).catch((error: unknown) => announce(error instanceof Error ? error.message : 'The workbook could not be imported.', true));
    target.value = '';
    return;
  }
  if (!workbook) return;
  const workbookField = target.dataset.workbookField;
  const trailField = target.dataset.trailField;
  if (workbookField) (workbook as unknown as Record<string, string>)[workbookField] = target.value;
  if (trailField) {
    const trail = workbook.trails.find((item) => item.id === currentTrailId);
    if (trail) (trail as unknown as Record<string, string>)[trailField] = target.value;
  }
  refreshDerived();
  scheduleSave();
});

document.addEventListener('keydown', (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
    event.preventDefault();
    void saveNow('Manual save');
    announce('Workbook saved locally.');
  }
  if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && screen === 'workbook') {
    event.preventDefault();
    addTrail();
  }
});

function reflectConnectivity(): void {
  const strip = document.querySelector<HTMLElement>('#offline-strip');
  if (strip) strip.hidden = navigator.onLine;
}

function reflectInstall(): void {
  document.querySelectorAll<HTMLElement>('.install-button').forEach((button) => { button.hidden = !pendingInstall; });
}

window.addEventListener('online', () => { reflectConnectivity(); announce('Back online. Your local workbook did not need to sync.'); });
window.addEventListener('offline', () => { reflectConnectivity(); announce('You are offline. The workbook remains available and saves locally.'); });
window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); pendingInstall = event as BeforeInstallPromptEvent; reflectInstall(); });

async function registerServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) return;
  const registration = await navigator.serviceWorker.register('/sw.js');
  const showUpdate = () => {
    const toast = document.querySelector<HTMLElement>('#update-toast');
    if (toast) toast.hidden = false;
  };
  if (registration.waiting && navigator.serviceWorker.controller) showUpdate();
  registration.addEventListener('updatefound', () => {
    const worker = registration.installing;
    worker?.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) showUpdate();
    });
  });
  let updating = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (updating || !allowUpdateReload) return;
    updating = true;
    window.location.reload();
  });
}

async function init(): Promise<void> {
  try {
    const saved = await loadWorkbook();
    workbook = saved ? parseWorkbook(saved) : null;
    currentTrailId = workbook?.trails[0]?.id ?? '';
  } catch {
    storageAvailable = false;
  }
  render();
  if (!storageAvailable) announce('Local storage is unavailable. You can still work, but export JSON before closing.', true);
  registerServiceWorker().catch(() => announce('Offline installation is not available in this browser.', true));
}

void init();
