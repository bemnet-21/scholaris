import React from 'react';
import { ReportDTO } from '../types';

interface ReportViewerProps {
  report: ReportDTO | null;
  error?: string | null;
  query?: string;
}

/**
 * Renders the full research report in an elegant, scholarly layout.
 * When no report exists, shows an atmospheric empty state.
 */
export const ReportViewer: React.FC<ReportViewerProps> = ({ report, error, query }) => {
  // --- Empty state ---
  if (!report && !error) {
    return (
      <div
        id="report-empty-state"
        className="
          w-full max-w-3xl mx-auto
          rounded-xl border border-border-subtle
          bg-bg-card/30
          py-16 px-8
          flex flex-col items-center justify-center
          text-center
        "
      >
        {/* Book icon */}
        <div className="mb-6 opacity-20">
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1" className="text-gold-600">
            <path d="M8 8h20a8 8 0 0 1 8 8v36a6 6 0 0 0-6-6H8V8z" />
            <path d="M56 8H36a8 8 0 0 0-8 8v36a6 6 0 0 1 6-6h22V8z" />
            <line x1="20" y1="20" x2="24" y2="20" opacity="0.5" />
            <line x1="20" y1="26" x2="24" y2="26" opacity="0.5" />
            <line x1="40" y1="20" x2="44" y2="20" opacity="0.5" />
            <line x1="40" y1="26" x2="44" y2="26" opacity="0.5" />
          </svg>
        </div>

        <p className="text-text-muted text-body-md mb-1">
          Your research report will appear here
        </p>
        <p className="text-text-faint text-body-sm">
          Enter a query above and begin your investigation
        </p>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div
        id="report-error-state"
        className="
          w-full max-w-3xl mx-auto
          rounded-xl border border-status-error/20
          bg-status-error/5
          py-10 px-8
          flex flex-col items-center justify-center text-center
          animate-fade-in
        "
      >
        <span className="material-symbols-outlined text-status-error text-3xl mb-3">error_outline</span>
        <h3 className="text-heading-sm text-status-error mb-2">Research Failed</h3>
        <p className="text-text-muted text-body-sm max-w-md">{error}</p>
      </div>
    );
  }

  // --- Report display ---
  return (
    <div id="report-viewer" className="w-full max-w-3xl mx-auto space-y-6 animate-fade-in-up">
      {/* Report header */}
      <div className="rounded-xl border border-border-gold bg-bg-card/60 backdrop-blur-sm px-8 py-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="material-symbols-outlined text-gold-500 text-[18px]">auto_stories</span>
          <span className="text-label text-gold-500/80">Research Report</span>
        </div>

        {query && (
          <h2 className="text-heading-lg text-text-primary mb-3" style={{ fontFamily: 'var(--font-serif)' }}>
            {query}
          </h2>
        )}

        <div className="flex items-center gap-4 text-text-faint text-body-sm">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            {new Date(report!.generated_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">format_list_numbered</span>
            {report!.sections.length} sections
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[14px]">link</span>
            {report!.citations.length} sources
          </span>
        </div>
      </div>

      {/* Report sections */}
      {report!.sections.map((section, idx) => (
        <div
          key={idx}
          className="
            rounded-xl border border-border-subtle
            bg-bg-card/40
            px-8 py-6
            animate-fade-in-up
          "
          style={{ animationDelay: `${idx * 0.1}s` }}
        >
          <h3 className="text-heading-md text-gold-300 mb-4 pb-3 border-b border-border-subtle" style={{ fontFamily: 'var(--font-serif)' }}>
            {section.title}
          </h3>

          <div className="text-body-lg text-text-secondary leading-relaxed whitespace-pre-wrap">
            {section.content}
          </div>

          {/* Inline citation pills */}
          {section.citation_ids && section.citation_ids.length > 0 && (
            <div className="mt-5 pt-4 border-t border-border-subtle/50 flex flex-wrap items-center gap-2">
              <span className="text-label text-text-faint text-[10px] mr-1">Sources:</span>
              {section.citation_ids.map((cid) => (
                <CitationPill key={cid} id={cid} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* All references section */}
      {report!.citations && report!.citations.length > 0 && (
        <div className="rounded-xl border border-border-subtle bg-bg-card/40 px-8 py-6 animate-fade-in-up" style={{ animationDelay: `${report!.sections.length * 0.1}s` }}>
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-gold-600 text-[18px]">menu_book</span>
            <h3 className="text-heading-sm text-text-primary">References</h3>
          </div>

          <div className="space-y-3">
            {report!.citations.map((cite, idx) => (
              <div
                key={idx}
                className="
                  flex flex-col sm:flex-row sm:items-start justify-between gap-2
                  rounded-lg border border-border-subtle/50
                  bg-bg-elevated/30 px-5 py-3.5
                  text-body-sm
                "
              >
                <div className="flex-1 min-w-0">
                  <p className="text-text-secondary font-medium truncate">{cite.source_name}</p>
                  <a
                    href={cite.source_url_or_id.startsWith('http') ? cite.source_url_or_id : undefined}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gold-500/70 hover:text-gold-400 text-mono text-[12px] break-all transition-colors"
                  >
                    {cite.source_url_or_id}
                  </a>
                </div>
                <span className="text-text-faint text-[11px] whitespace-nowrap flex-shrink-0">
                  {new Date(cite.retrieved_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/** Citation pill — small gold tag for inline references */
const CitationPill: React.FC<{ id: string }> = ({ id }) => (
  <span className="
    inline-flex items-center justify-center
    text-mono text-[10px]
    px-2.5 py-0.5 rounded-full
    bg-gold-900/50 border border-gold-700/30
    text-gold-400/80
    hover:bg-gold-800/50 hover:text-gold-300
    transition-colors cursor-default
  ">
    [{id.substring(0, 8)}]
  </span>
);

export default ReportViewer;
