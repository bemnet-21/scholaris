import { useState, useEffect, useRef, useCallback } from 'react';
import { BackgroundAmbience } from './components/BackgroundAmbience';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { PipelineTracker } from './components/PipelineTracker';
import { ReportViewer } from './components/ReportViewer';
import { AuthModal } from './components/AuthModal';
import {
  JobStatusResponse,
  ReportDTO,
  PipelineStage,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export default function App() {
  // --- Auth State ---
  const [authToken, setAuthToken] = useState<string | null>(
    () => localStorage.getItem('scholaris_token') || localStorage.getItem('alie_token')
  );
  const [userEmail, setUserEmail] = useState<string | null>(
    () => localStorage.getItem('scholaris_email') || localStorage.getItem('alie_email')
  );
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // --- Research State ---
  const [pipelineStage, setPipelineStage] = useState<PipelineStage>('idle');
  const [report, setReport] = useState<ReportDTO | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const pollInterval = useRef<number | null>(null);

  // Save auth state changes
  const handleAuthSuccess = (token: string, email: string) => {
    setAuthToken(token);
    setUserEmail(email);
    localStorage.setItem('scholaris_token', token);
    localStorage.setItem('scholaris_email', email);
  };

  const handleSignOut = () => {
    setAuthToken(null);
    setUserEmail(null);
    localStorage.removeItem('scholaris_token');
    localStorage.removeItem('scholaris_email');
    localStorage.removeItem('alie_token');
    localStorage.removeItem('alie_email');
  };

  // Helper to ensure an auth token exists (auto-guest enrollment if none)
  const getOrEnrollToken = async (): Promise<string> => {
    if (authToken) return authToken;

    // Try auto-enrolling a guest session
    try {
      const guestId = Math.random().toString(36).substring(2, 9);
      const guestEmail = `scholar_${guestId}@scholaris.engine`;
      const guestPassword = `guest_pass_${Math.random().toString(36).substring(2, 12)}`;

      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: guestEmail, password: guestPassword }),
      });

      if (res.ok) {
        const data = await res.json();
        handleAuthSuccess(data.access_token, guestEmail);
        return data.access_token;
      }
    } catch {
      // Backend may not be reachable or doesn't support register
    }

    return '';
  };

  // --- Verify token on mount ---
  useEffect(() => {
    if (!authToken) return;

    fetch(`${API_BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => {
        if (!res.ok) {
          // Token expired or invalid
          handleSignOut();
        }
      })
      .catch(() => {
        // Backend not currently reachable
      });
  }, [authToken]);

  // --- Simulate pipeline progression during 'running' status ---
  const runningTimerRef = useRef<number | null>(null);
  const runningStartRef = useRef<number>(0);

  const startRunningSimulation = useCallback(() => {
    runningStartRef.current = Date.now();

    const tick = () => {
      const elapsed = (Date.now() - runningStartRef.current) / 1000;

      if (elapsed < 6) {
        setPipelineStage('routing');
      } else if (elapsed < 14) {
        setPipelineStage('retrieving');
      } else if (elapsed < 22) {
        setPipelineStage('critiquing');
      } else {
        setPipelineStage('synthesizing');
      }

      runningTimerRef.current = window.setTimeout(tick, 2000);
    };

    tick();
  }, []);

  const stopRunningSimulation = useCallback(() => {
    if (runningTimerRef.current) {
      window.clearTimeout(runningTimerRef.current);
      runningTimerRef.current = null;
    }
  }, []);

  // --- Start research ---
  const startResearch = async (query: string) => {
    setReport(null);
    setError(null);
    setCurrentQuery(query);
    setIsLoading(true);
    setPipelineStage('planning');

    try {
      const token = await getOrEnrollToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/research`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ topic: query }),
      });

      if (response.status === 401) {
        // Token invalid: open auth modal so user can sign in
        setIsAuthOpen(true);
        throw new Error('Please sign in or enroll as a scholar to initiate research.');
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Failed to start research: ${response.statusText}`);
      }

      const data: JobStatusResponse = await response.json();
      setActiveJobId(data.job_id);

      if (data.status === 'running') {
        startRunningSimulation();
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
      setPipelineStage('error');
      setIsLoading(false);
    }
  };

  // --- Poll for job status ---
  useEffect(() => {
    if (!activeJobId) return;

    const poll = async () => {
      try {
        const headers: Record<string, string> = {};
        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        const response = await fetch(`${API_BASE_URL}/research/${activeJobId}`, { headers });
        if (!response.ok) return;

        const data: JobStatusResponse = await response.json();

        if (data.status === 'running' && pipelineStage === 'planning') {
          startRunningSimulation();
        }

        if (data.status === 'done') {
          stopRunningSimulation();
          setPipelineStage('complete');

          // Fetch the final scholarly report
          try {
            const reportRes = await fetch(`${API_BASE_URL}/research/${activeJobId}/report`, { headers });
            if (reportRes.ok) {
              const reportData: ReportDTO = await reportRes.json();
              setReport(reportData);
            } else {
              setError('Research completed but failed to retrieve the report.');
              setPipelineStage('error');
            }
          } catch {
            setError('Research completed but failed to retrieve the report.');
            setPipelineStage('error');
          }

          setIsLoading(false);
          setActiveJobId(null);
          if (pollInterval.current) {
            window.clearInterval(pollInterval.current);
            pollInterval.current = null;
          }
          return;
        }

        if (data.status === 'failed') {
          stopRunningSimulation();
          setError(data.error || 'Research failed. Please try again.');
          setPipelineStage('error');
          setIsLoading(false);
          setActiveJobId(null);
          if (pollInterval.current) {
            window.clearInterval(pollInterval.current);
            pollInterval.current = null;
          }
          return;
        }
      } catch (err) {
        console.error('Poll failed:', err);
      }
    };

    poll();
    pollInterval.current = window.setInterval(poll, 2000);

    return () => {
      if (pollInterval.current) {
        window.clearInterval(pollInterval.current);
        pollInterval.current = null;
      }
    };
  }, [activeJobId, authToken, pipelineStage, startRunningSimulation, stopRunningSimulation]);

  useEffect(() => {
    return () => stopRunningSimulation();
  }, [stopRunningSimulation]);

  const reportRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (report && reportRef.current) {
      reportRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [report]);

  return (
    <div className="min-h-screen relative">
      <BackgroundAmbience />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero section: Header + Search */}
        <div className="flex-shrink-0">
          <Header
            userEmail={userEmail}
            onOpenAuth={() => setIsAuthOpen(true)}
            onSignOut={handleSignOut}
          />

          <div className="px-4 sm:px-6 pb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <SearchBar onSubmit={startResearch} isLoading={isLoading} />
          </div>
        </div>

        {/* Pipeline + Report area */}
        <div className="flex-1 px-4 sm:px-6 pb-16 space-y-8">
          {pipelineStage !== 'idle' && (
            <div className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <PipelineTracker currentStage={pipelineStage} />
            </div>
          )}

          <div ref={reportRef}>
            <ReportViewer report={report} error={error} query={currentQuery} />
          </div>
        </div>

        {/* Footer */}
        <footer className="flex-shrink-0 py-6 text-center border-t border-border-subtle/30">
          <p className="text-text-faint text-body-sm">
            Scholaris — Intelligent Autonomous Literature & Fact Engine
          </p>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={handleAuthSuccess}
        apiUrl={API_BASE_URL}
      />
    </div>
  );
}
