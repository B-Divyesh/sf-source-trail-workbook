import type { CitationStyle, Relationship, Trail, TrailStatus, Workbook } from './types';

export const now = () => new Date().toISOString();
export const makeId = () => crypto.randomUUID();

export function createTrail(): Trail {
  const timestamp = now();
  return {
    id: makeId(),
    label: '',
    query: '',
    searchLocation: '',
    queryReason: '',
    rejectedResult: '',
    rejectionReason: '',
    sourceTitle: '',
    sourceAuthor: '',
    sourcePublisher: '',
    sourceDate: '',
    sourceUrl: '',
    sourceType: '',
    credibilityCreator: '',
    credibilityEvidence: '',
    credibilityLimits: '',
    claim: '',
    relationship: 'supports',
    quote: '',
    locator: '',
    explanation: '',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function createWorkbook(): Workbook {
  const timestamp = now();
  return {
    kind: 'source-trail-workbook',
    schemaVersion: 1,
    id: makeId(),
    title: 'My research workbook',
    studentName: '',
    course: '',
    researchQuestion: '',
    assignmentNotes: '',
    citationStyle: 'MLA',
    trails: [createTrail()],
    history: [{ at: timestamp, action: 'Workbook created' }],
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function trailStatus(trail: Trail): TrailStatus {
  const hasAny = [trail.query, trail.sourceTitle, trail.claim, trail.quote].some((value) => value.trim());
  if (!hasAny) return 'started';
  const core = [trail.query, trail.sourceTitle, trail.sourceUrl, trail.claim, trail.quote, trail.explanation];
  const credibility = [trail.credibilityCreator, trail.credibilityEvidence, trail.credibilityLimits].some((value) => value.trim());
  return core.every((value) => value.trim()) && credibility ? 'ready' : 'needs-evidence';
}

export function isUnsupported(trail: Trail): boolean {
  return Boolean(trail.claim.trim()) && (!trail.quote.trim() || !trail.explanation.trim() || !trail.sourceTitle.trim());
}

export function trailName(trail: Trail, index: number): string {
  return trail.label.trim() || trail.claim.trim() || trail.sourceTitle.trim() || trail.query.trim() || `Untitled trail ${index + 1}`;
}

const text = (value: unknown, max = 10_000) => typeof value === 'string' ? value.slice(0, max) : '';
const allowedStyle = (value: unknown): CitationStyle => ['MLA', 'APA', 'Chicago'].includes(String(value)) ? value as CitationStyle : 'MLA';
const allowedRelationship = (value: unknown): Relationship => ['supports', 'contradicts', 'complicates'].includes(String(value)) ? value as Relationship : 'supports';

function readTrail(raw: unknown): Trail {
  if (!raw || typeof raw !== 'object') throw new Error('A trail entry is not an object.');
  const data = raw as Record<string, unknown>;
  const base = createTrail();
  return {
    ...base,
    id: text(data.id, 100) || base.id,
    label: text(data.label, 160),
    query: text(data.query, 1000),
    searchLocation: text(data.searchLocation, 300),
    queryReason: text(data.queryReason, 3000),
    rejectedResult: text(data.rejectedResult, 1000),
    rejectionReason: text(data.rejectionReason, 3000),
    sourceTitle: text(data.sourceTitle, 1000),
    sourceAuthor: text(data.sourceAuthor, 500),
    sourcePublisher: text(data.sourcePublisher, 500),
    sourceDate: text(data.sourceDate, 100),
    sourceUrl: text(data.sourceUrl, 3000),
    sourceType: text(data.sourceType, 200),
    credibilityCreator: text(data.credibilityCreator, 3000),
    credibilityEvidence: text(data.credibilityEvidence, 3000),
    credibilityLimits: text(data.credibilityLimits, 3000),
    claim: text(data.claim, 3000),
    relationship: allowedRelationship(data.relationship),
    quote: text(data.quote, 900),
    locator: text(data.locator, 300),
    explanation: text(data.explanation, 4000),
    createdAt: text(data.createdAt, 100) || base.createdAt,
    updatedAt: text(data.updatedAt, 100) || base.updatedAt,
  };
}

export function parseWorkbook(raw: unknown): Workbook {
  const candidate = raw && typeof raw === 'object' && 'workbook' in raw
    ? (raw as { workbook: unknown }).workbook
    : raw;
  if (!candidate || typeof candidate !== 'object') throw new Error('This file does not contain a workbook.');
  const data = candidate as Record<string, unknown>;
  if (data.kind !== 'source-trail-workbook') throw new Error('This is not a Source Trail Workbook file.');
  if (data.schemaVersion !== 1) throw new Error('This workbook version is not supported yet.');
  if (!Array.isArray(data.trails)) throw new Error('The workbook is missing its trail list.');
  if (data.trails.length > 250) throw new Error('This workbook has more than 250 trails and cannot be imported safely.');
  const base = createWorkbook();
  return {
    ...base,
    id: text(data.id, 100) || base.id,
    title: text(data.title, 300) || 'Imported workbook',
    studentName: text(data.studentName, 300),
    course: text(data.course, 300),
    researchQuestion: text(data.researchQuestion, 5000),
    assignmentNotes: text(data.assignmentNotes, 5000),
    citationStyle: allowedStyle(data.citationStyle),
    trails: data.trails.map(readTrail),
    history: Array.isArray(data.history)
      ? data.history.slice(-30).flatMap((item) => item && typeof item === 'object'
        ? [{ at: text((item as Record<string, unknown>).at, 100), action: text((item as Record<string, unknown>).action, 300) }]
        : [])
      : [],
    createdAt: text(data.createdAt, 100) || base.createdAt,
    updatedAt: text(data.updatedAt, 100) || base.updatedAt,
  };
}

export function makeTemplate(workbook: Workbook): Workbook {
  const blank = createTrail();
  return {
    ...workbook,
    id: makeId(),
    studentName: '',
    trails: [blank],
    history: [{ at: now(), action: 'Template opened' }],
    createdAt: now(),
    updatedAt: now(),
  };
}
