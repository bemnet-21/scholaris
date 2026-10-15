import React, { useState } from 'react';

interface SearchBarProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
}

/**
 * The main research query input — centered, elegant, with a warm gold accent.
 */
export const SearchBar: React.FC<SearchBarProps> = ({ onSubmit, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto" id="search-bar-form">
      <div
        className={`
          relative flex items-center
          bg-bg-input/80 backdrop-blur-sm
          border rounded-xl
          transition-all duration-500 ease-out
          ${isLoading
            ? 'border-gold-500/30 shadow-[0_0_24px_rgba(201,168,76,0.08)]'
            : 'border-border-default hover:border-gold-700/50 focus-within:border-gold-500/50 focus-within:shadow-[0_0_32px_rgba(201,168,76,0.1)]'
          }
        `}
      >
        {/* Book icon */}
        <div className="pl-5 pr-1 flex items-center justify-center text-text-muted">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
        </div>

        <textarea
          id="research-query-input"
          className="
            flex-1 bg-transparent border-none outline-none
            text-text-primary text-body-md
            placeholder:text-text-faint
            resize-none max-h-28 min-h-[52px]
            py-4 px-3
            leading-relaxed
          "
          placeholder="What would you like to research?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
        />

        <div className="pr-3 flex-shrink-0">
          <button
            id="begin-research-btn"
            type="submit"
            disabled={isLoading || !query.trim()}
            className={`
              h-10 px-5 rounded-lg
              text-label tracking-wider
              transition-all duration-300 ease-out
              flex items-center justify-center gap-2
              ${isLoading
                ? 'bg-gold-600/20 text-gold-400/70 cursor-wait border border-gold-500/20'
                : 'bg-gold-600/15 border border-gold-500/30 text-gold-300 hover:bg-gold-600/25 hover:border-gold-400/50 hover:text-gold-200 hover:shadow-[0_0_20px_rgba(201,168,76,0.15)] disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gold-600/15 disabled:hover:border-gold-500/30 disabled:hover:shadow-none'
              }
            `}
          >
            {isLoading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" opacity="0.25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <span className="hidden sm:inline">Researching</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-[18px]">search</span>
                <span className="hidden sm:inline">Begin Research</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hint text */}
      <p className="text-center text-text-faint text-body-sm mt-3 opacity-0 animate-fade-in" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
        Press <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-muted text-[11px] font-mono">Enter</kbd> to submit · <kbd className="px-1.5 py-0.5 rounded bg-bg-elevated border border-border-subtle text-text-muted text-[11px] font-mono">Shift+Enter</kbd> for new line
      </p>
    </form>
  );
};

export default SearchBar;
