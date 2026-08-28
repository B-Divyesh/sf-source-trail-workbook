import { describe, expect, it } from 'vitest';
import { citationsText, formatCitation, workbookCsv } from '../src/citations';
import { createTrail, createWorkbook, isUnsupported, makeTemplate, parseWorkbook, trailStatus } from '../src/model';

describe('trail readiness', () => {
  it('distinguishes an empty, unsupported, and review-ready trail', () => {
    const trail = createTrail();
    expect(trailStatus(trail)).toBe('started');

    trail.claim = 'The letter frames grief as a social duty.';
    expect(trailStatus(trail)).toBe('needs-evidence');
    expect(isUnsupported(trail)).toBe(true);

    Object.assign(trail, {
      query: 'Seneca grief consolation primary source',
      sourceTitle: 'Moral Letters to Lucilius',
      sourceUrl: 'https://example.edu/seneca',
      quote: 'A short quotation.',
      explanation: 'The quoted imperative supplies the basis for the claim.',
      credibilityCreator: 'A university classics collection.',
    });
    expect(trailStatus(trail)).toBe('ready');
    expect(isUnsupported(trail)).toBe(false);
  });
});

describe('portable workbook files', () => {
  it('round-trips a workbook and makes a response-free template', () => {
    const workbook = createWorkbook();
    workbook.studentName = 'Student Name';
    workbook.researchQuestion = 'How do letters shape public grief?';
    workbook.trails[0].claim = 'A claim';
    const parsed = parseWorkbook(JSON.parse(JSON.stringify({ workbook })));
    expect(parsed.researchQuestion).toBe(workbook.researchQuestion);
    expect(parsed.trails).toHaveLength(1);

    const template = makeTemplate(parsed);
    expect(template.studentName).toBe('');
    expect(template.researchQuestion).toBe(workbook.researchQuestion);
    expect(template.trails[0].claim).toBe('');
  });

  it('rejects unrelated JSON', () => {
    expect(() => parseWorkbook({ hello: 'world' })).toThrow(/not a Source Trail Workbook/i);
  });
});

describe('exports', () => {
  it('formats citations and escapes spreadsheet cells', () => {
    const trail = createTrail();
    Object.assign(trail, {
      sourceAuthor: 'Rivera, Ana',
      sourceTitle: 'Reading, Slowly',
      sourcePublisher: 'Open Press',
      sourceDate: '2025',
      sourceUrl: 'https://example.org',
      claim: 'A "quoted" claim',
    });
    expect(formatCitation(trail, 'MLA')).toContain('Rivera, Ana.');
    expect(citationsText([trail], 'APA')).toContain('(2025).');
    expect(workbookCsv([trail])).toContain('"A ""quoted"" claim"');
  });
});
