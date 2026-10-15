import React, { useState } from 'react';
import { X, KeyRound, UserPlus, LogIn, Sparkles } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (token: string, email: string) => void;
  apiUrl: string;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  apiUrl,
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await fetch(`${apiUrl}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || 'Registration failed');
        }

        const data = await res.json();
        onSuccess(data.access_token, email);
        onClose();
      } else {
        const formData = new URLSearchParams();
        formData.append('username', email);
        formData.append('password', password);

        const res = await fetch(`${apiUrl}/auth/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.detail || 'Invalid email or password');
        }

        const data = await res.json();
        onSuccess(data.access_token, email);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    setError(null);
    setLoading(true);

    try {
      const guestId = Math.random().toString(36).substring(2, 9);
      const guestEmail = `scholar_${guestId}@scholaris.engine`;
      const guestPassword = `guest_pass_${Math.random().toString(36).substring(2, 12)}`;

      const res = await fetch(`${apiUrl}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: guestEmail, password: guestPassword }),
      });

      if (!res.ok) {
        throw new Error('Could not initialize guest session. Is the backend running?');
      }

      const data = await res.json();
      onSuccess(data.access_token, guestEmail);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Guest session creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-md bg-surface-dark border border-gold-600/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden"
        style={{
          boxShadow: '0 20px 50px rgba(0,0,0,0.8), 0 0 30px rgba(201, 168, 76, 0.1)',
        }}
      >
        {/* Subtle background glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-gold-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-text-muted hover:text-text-primary rounded-lg transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gold-600/10 border border-gold-600/25 mb-3 text-gold-400">
            <KeyRound className="w-6 h-6" />
          </div>
          <h2
            className="text-2xl font-serif font-bold text-text-primary tracking-wide"
            style={{ fontFamily: 'var(--font-serif)' }}
          >
            {mode === 'signin' ? 'Scholar Access' : 'Enroll as Scholar'}
          </h2>
          <p className="text-xs text-text-muted mt-1 tracking-wider uppercase">
            Authentication for the Research Engine
          </p>
        </div>

        {/* Mode Toggle Tabs */}
        <div className="flex border-b border-gold-900/40 mb-6">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setError(null);
            }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${
              mode === 'signin' ? 'text-gold-400' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
            {mode === 'signin' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 shadow-[0_0_8px_rgba(201,168,76,0.6)]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setError(null);
            }}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2 ${
              mode === 'register' ? 'text-gold-400' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Register
            {mode === 'register' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold-500 shadow-[0_0_8px_rgba(201,168,76,0.6)]" />
            )}
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-800/40 text-red-200 text-xs flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-text-muted mb-1.5 font-medium">
              Scholar Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="scholar@academy.edu"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-card border border-gold-900/40 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-text-muted mb-1.5 font-medium">
              Secret Passphrase
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-4 py-2.5 rounded-xl bg-surface-card border border-gold-900/40 text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-gold-500/60 focus:ring-1 focus:ring-gold-500/30 transition-all text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 rounded-xl font-medium text-sm tracking-wide transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-500 hover:to-gold-400 text-surface-dark font-semibold shadow-lg shadow-gold-900/20 active:scale-[0.99]"
          >
            {loading
              ? 'Authenticating...'
              : mode === 'signin'
              ? 'Enter Research Archives'
              : 'Create Scholar Account'}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gold-900/30" />
          </div>
          <span className="relative px-3 text-xs uppercase tracking-widest text-text-muted bg-surface-dark">
            Or
          </span>
        </div>

        {/* Instant Guest Mode */}
        <button
          type="button"
          onClick={handleGuestAccess}
          disabled={loading}
          className="w-full py-2.5 px-4 rounded-xl border border-gold-600/30 hover:border-gold-500/60 hover:bg-gold-600/10 text-gold-400 text-xs font-medium tracking-wider transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Sparkles className="w-3.5 h-3.5" />
          Instant Guest Scholar Session
        </button>
      </div>
    </div>
  );
};
