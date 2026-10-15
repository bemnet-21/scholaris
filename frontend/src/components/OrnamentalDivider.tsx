import React from 'react';

/**
 * Ornamental divider — a thin gold line with a diamond centerpiece.
 * Used as a visual separator between major sections.
 */
export const OrnamentalDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`flex items-center justify-center gap-3 select-none ${className}`}>
    <div className="h-px flex-1 max-w-32 bg-gradient-to-r from-transparent to-gold-600/40" />
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-gold-500/50">
      <path d="M7 0L9 5L14 7L9 9L7 14L5 9L0 7L5 5L7 0Z" fill="currentColor" />
    </svg>
    <div className="h-px flex-1 max-w-32 bg-gradient-to-l from-transparent to-gold-600/40" />
  </div>
);

export default OrnamentalDivider;
