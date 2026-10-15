/* ============================================================================
   Scholaris — Shared TypeScript Types
   ============================================================================ */

// --- Backend API types ---

export type ResearchStatus = 'pending' | 'running' | 'done' | 'failed';

export interface CitationDTO {
  source_url_or_id: string;
  source_name: string;
  retrieved_at: string;
}

export interface ReportSectionDTO {
  title: string;
  content: string;
  citation_ids: string[];
}

export interface ReportDTO {
  query_id: string;
  sections: ReportSectionDTO[];
  citations: CitationDTO[];
  generated_at: string;
}

export interface JobStatusResponse {
  job_id: string;
  status: ResearchStatus;
  error?: string | null;
}

// --- Pipeline stage tracking ---

export type PipelineStage =
  | 'idle'
  | 'planning'
  | 'routing'
  | 'retrieving'
  | 'critiquing'
  | 'synthesizing'
  | 'complete'
  | 'error';

export const PIPELINE_STAGES: { key: PipelineStage; label: string }[] = [
  { key: 'planning', label: 'Planning' },
  { key: 'routing', label: 'Routing' },
  { key: 'retrieving', label: 'Retrieving' },
  { key: 'critiquing', label: 'Critiquing' },
  { key: 'synthesizing', label: 'Synthesizing' },
];

// Maps backend status → pipeline stage (for the progress bar)
export function statusToPipelineStage(status: ResearchStatus): PipelineStage {
  switch (status) {
    case 'pending':
      return 'planning';
    case 'running':
      return 'retrieving'; // running is the bulk of the pipeline
    case 'done':
      return 'complete';
    case 'failed':
      return 'error';
    default:
      return 'idle';
  }
}
