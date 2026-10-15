import React from 'react';
import { PIPELINE_STAGES, PipelineStage } from '../types';

interface PipelineTrackerProps {
  currentStage: PipelineStage;
}

function getStageState(stageKey: string, currentStage: PipelineStage): 'completed' | 'active' | 'idle' {
  if (currentStage === 'idle') return 'idle';
  if (currentStage === 'error') return 'idle';

  const stageOrder = PIPELINE_STAGES.map(s => s.key);
  const currentIdx = currentStage === 'complete'
    ? stageOrder.length
    : stageOrder.indexOf(currentStage as any);
  const stageIdx = stageOrder.indexOf(stageKey as any);

  if (stageIdx < 0) return 'idle';
  if (stageIdx < currentIdx) return 'completed';
  if (stageIdx === currentIdx) return 'active';
  return 'idle';
}

/**
 * Horizontal pipeline progress tracker.
 * Shows the 5 stages of the research pipeline: Planning → Routing → Retrieving → Critiquing → Synthesizing
 */
export const PipelineTracker: React.FC<PipelineTrackerProps> = ({ currentStage }) => {
  const isActive = currentStage !== 'idle';

  return (
    <div
      id="pipeline-tracker"
      className={`
        w-full max-w-3xl mx-auto
        rounded-xl border
        px-6 sm:px-8 py-5
        transition-all duration-700 ease-out
        ${isActive
          ? 'bg-bg-card/80 backdrop-blur-sm border-border-gold shadow-[0_0_30px_rgba(201,168,76,0.06)]'
          : 'bg-bg-card/40 border-border-subtle'
        }
      `}
    >
      {/* Stage indicators */}
      <div className="flex items-center justify-between relative">
        {/* Connecting line (behind nodes) */}
        <div className="absolute top-[13px] left-6 right-6 h-px bg-border-default z-0" />

        {/* Progress fill line */}
        {isActive && (
          <div
            className="absolute top-[13px] left-6 h-px bg-gradient-to-r from-gold-500 to-gold-500/60 z-0 transition-all duration-1000 ease-out"
            style={{
              width: (() => {
                if (currentStage === 'complete') return 'calc(100% - 48px)';
                const stageOrder = PIPELINE_STAGES.map(s => s.key);
                const idx = stageOrder.indexOf(currentStage as any);
                if (idx < 0) return '0%';
                const pct = (idx / (stageOrder.length - 1)) * 100;
                return `calc(${pct}% - ${48 * (1 - pct / 100)}px)`;
              })(),
            }}
          />
        )}

        {PIPELINE_STAGES.map((stage) => {
          const state = getStageState(stage.key, currentStage);
          return (
            <div key={stage.key} className="flex flex-col items-center z-10 relative">
              {/* Node circle */}
              <div
                className={`
                  w-[26px] h-[26px] rounded-full
                  flex items-center justify-center
                  border-2 transition-all duration-500
                  ${state === 'completed'
                    ? 'bg-gold-500 border-gold-400 shadow-[0_0_12px_rgba(201,168,76,0.3)]'
                    : state === 'active'
                      ? 'bg-gold-500/20 border-gold-400 animate-pulse-gold'
                      : 'bg-bg-elevated border-border-default'
                  }
                `}
              >
                {state === 'completed' ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2.5 6L5 8.5L9.5 3.5" stroke="#0D0B08" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : state === 'active' ? (
                  <div className="w-2 h-2 rounded-full bg-gold-400" />
                ) : (
                  <div className="w-1.5 h-1.5 rounded-full bg-text-faint/50" />
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-2.5 text-label text-[10px] tracking-widest
                  transition-colors duration-500
                  ${state === 'completed'
                    ? 'text-gold-400'
                    : state === 'active'
                      ? 'text-gold-300'
                      : 'text-text-faint'
                  }
                `}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>

      {/* Status text */}
      {currentStage === 'error' && (
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center gap-2 text-status-error text-body-sm animate-fade-in">
          <span className="material-symbols-outlined text-[16px]">error</span>
          <span>An error occurred during research. Please try again.</span>
        </div>
      )}

      {currentStage === 'complete' && (
        <div className="mt-4 pt-3 border-t border-border-subtle flex items-center gap-2 text-status-success text-body-sm animate-fade-in">
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span>Research complete — your report is ready below.</span>
        </div>
      )}
    </div>
  );
};

export default PipelineTracker;
