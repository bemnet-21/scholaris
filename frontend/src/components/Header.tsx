import React from 'react';
import { User, LogOut, ShieldCheck } from 'lucide-react';
import OrnamentalDivider from './OrnamentalDivider';

interface HeaderProps {
  userEmail?: string | null;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
}

/**
 * The hero/header section with the A.L.I.E. branding and Scholar session badge.
 * Elegant serif title with warm gold gradient.
 */
export const Header: React.FC<HeaderProps> = ({ userEmail, onOpenAuth, onSignOut }) => (
  <header id="app-header" className="text-center pt-8 sm:pt-12 pb-6 sm:pb-8 relative z-10">
    {/* Top Bar with Session info */}
    <div className="max-w-4xl mx-auto px-4 flex items-center justify-end mb-6">
      {userEmail ? (
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-card/80 border border-gold-900/40 text-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-text-secondary max-w-[150px] sm:max-w-[200px] truncate">
            {userEmail}
          </span>
          {onSignOut && (
            <button
              onClick={onSignOut}
              title="Sign Out"
              className="ml-1 text-text-muted hover:text-red-400 transition-colors p-0.5"
            >
              <LogOut className="w-3 h-3" />
            </button>
          )}
        </div>
      ) : (
        onOpenAuth && (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-card/60 hover:bg-gold-600/10 border border-gold-900/30 hover:border-gold-600/40 text-xs text-gold-400 transition-all"
          >
            <User className="w-3.5 h-3.5" />
            <span>Scholar Login</span>
          </button>
        )
      )}
    </div>

    {/* Top ornamental line */}
    <div className="w-24 h-px mx-auto mb-6 bg-gradient-to-r from-transparent via-gold-600/40 to-transparent" />

    {/* Main title */}
    <h1
      className="text-display tracking-tight mb-3"
      style={{
        fontFamily: 'var(--font-serif)',
        background: 'linear-gradient(135deg, #D4B86A 0%, #C9A84C 30%, #E8D09E 50%, #C9A84C 70%, #9A7B2E 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        filter: 'drop-shadow(0 2px 12px rgba(201, 168, 76, 0.15))',
      }}
    >
      Scholaris
    </h1>

    {/* Subtitle */}
    <p className="text-label tracking-[0.2em] text-text-muted mb-2">
      Intelligent Autonomous Literature & Fact Engine
    </p>

    <OrnamentalDivider className="mt-6" />
  </header>
);

export default Header;
