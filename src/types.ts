export type CitationStyle = 'MLA' | 'APA' | 'Chicago';
export type Relationship = 'supports' | 'contradicts' | 'complicates';

export interface Trail {
  id: string;
  label: string;
  query: string;
  searchLocation: string;
  queryReason: string;
  rejectedResult: string;
  rejectionReason: string;
  sourceTitle: string;
  sourceAuthor: string;
  sourcePublisher: string;
  sourceDate: string;
  sourceUrl: string;
  sourceType: string;
  credibilityCreator: string;
  credibilityEvidence: string;
  credibilityLimits: string;
  claim: string;
  relationship: Relationship;
  quote: string;
  locator: string;
  explanation: string;
  createdAt: string;
  updatedAt: string;
}

export interface HistoryEntry {
  at: string;
  action: string;
}

export interface Workbook {
  kind: 'source-trail-workbook';
  schemaVersion: 1;
  id: string;
  title: string;
  studentName: string;
  course: string;
  researchQuestion: string;
  assignmentNotes: string;
  citationStyle: CitationStyle;
  trails: Trail[];
  history: HistoryEntry[];
  createdAt: string;
  updatedAt: string;
}

export type TrailStatus = 'started' | 'needs-evidence' | 'ready';
