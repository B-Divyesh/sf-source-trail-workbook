import type { CitationStyle, Trail } from './types';

const clean = (value: string) => value.trim().replace(/\s+/g, ' ');

export function formatCitation(trail: Trail, style: CitationStyle): string {
  const author = clean(trail.sourceAuthor);
  const title = clean(trail.sourceTitle) || 'Untitled source';
  const publisher = clean(trail.sourcePublisher);
  const date = clean(trail.sourceDate);
  const url = clean(trail.sourceUrl);

  if (style === 'APA') {
    return [author || title, `(${date || 'n.d.'}).`, author ? `${title}.` : '', publisher ? `${publisher}.` : '', url]
      .filter(Boolean).join(' ');
  }
  if (style === 'Chicago') {
    return [author ? `${author}.` : '', `“${title}.”`, publisher ? `${publisher},` : '', date ? `${date}.` : '', url]
      .filter(Boolean).join(' ');
  }
  return [author ? `${author}.` : '', `“${title}.”`, publisher ? `${publisher},` : '', date ? `${date}.` : '', url]
    .filter(Boolean).join(' ');
}

export function citationsText(trails: Trail[], style: CitationStyle): string {
  return trails
    .filter((trail) => trail.sourceTitle.trim() || trail.sourceUrl.trim())
    .map((trail) => formatCitation(trail, style))
    .join('\n\n');
}

const csvCell = (value: string) => `"${value.replace(/"/g, '""')}"`;

export function workbookCsv(trails: Trail[]): string {
  const keys: (keyof Trail)[] = [
    'label', 'query', 'searchLocation', 'queryReason', 'rejectedResult', 'rejectionReason',
    'sourceTitle', 'sourceAuthor', 'sourcePublisher', 'sourceDate', 'sourceUrl', 'sourceType',
    'credibilityCreator', 'credibilityEvidence', 'credibilityLimits', 'claim', 'relationship',
    'quote', 'locator', 'explanation',
  ];
  return [keys.join(','), ...trails.map((trail) => keys.map((key) => csvCell(String(trail[key]))).join(','))].join('\r\n');
}
