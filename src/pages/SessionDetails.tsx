import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, ChevronLeft, Loader2 } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';
import { sessionsApi, recordingsApi } from '../api/client';

interface SessionDetailsProps {
  setActiveTab: (tab: string) => void;
}

export const SessionDetails: React.FC<SessionDetailsProps> = ({ setActiveTab }) => {
  const { user, openPaymentModal, openAuthModal } = useApp();
  const [session, setSession] = useState<any>(null);
  const [recordings, setRecordings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      sessionsApi.getSessions().catch(() => []),
      recordingsApi.getSessionRecordings(1).catch(() => [])
    ]).then(([sessions, recs]) => {
      if (sessions && sessions.length > 0) {
        setSession(sessions[0]);
      }
      setRecordings(recs || []);
    }).finally(() => {
      setIsLoading(false);
    });
  }, []);

  const getDaysUntilStart = (startDateStr?: string) => {
    if (!startDateStr) return 'Starts Soon';
    const start = new Date(startDateStr);
    const now = new Date();
    const diffTime = start.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `● Starts in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    if (diffDays === 0) return '● Starts Today';
    return '● Current Active Batch';
  };

  const priceLive = session?.priceLive || 1111;
  const priceExtension = session?.priceExtension || 555;
  const priceRecordings = session?.priceRecordings || 1500;

  const handleEnrollLive = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: `session-live-${session?.id || 1}`,
      name: session?.title ? `${session.title} (Live Masterclass)` : "Hanuman Kriya: 11-Day Divine Awakening Masterclass",
      price: priceLive,
      type: 'live-session',
      details: `${session?.startDate || 'Monthly'} Batch • Daily 6:30 AM IST • WhatsApp Community Link Included`,
      sessionId: session?.id || 1
    });
  };

  const handleBuyExtension = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: `session-extension-${session?.id || 1}`,
      name: "30-Day Recording Extension (Loyalty Upgrade)",
      price: priceExtension,
      type: 'recording-extension',
      details: "Exclusive to Live Batch Seekers • 30 Days Extended Access",
      sessionId: session?.id || 1
    });
  };

  const handleBuyRecordingsOnly = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: `session-recordings-${session?.id || 1}`,
      name: session?.title ? `${session.title} (Recordings Pack)` : "Full 11-Day Recording Pack (30 Days Validity)",
      price: priceRecordings,
      type: 'recordings-only',
      details: "Complete 11-Day Video Recordings • 30 Days Access from Purchase Date",
      sessionId: session?.id || 1
    });
  };

  if (isLoading) {
    return (
      <div className="py-32 text-center">
        <Loader2 className="w-10 h-10 text-amber-700 animate-spin mx-auto" />
        <p className="text-stone-500 font-serif mt-2">Loading session details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fadeIn text-[#2C2421]">
      
      {/* Back button */}
      <button
        onClick={() => setActiveTab('sessions')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B5E34] hover:text-[#2C2421] transition"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to All Sessions</span>
      </button>

      {/* Header Info Banner */}
      <ScrollReveal variant="hero-zoom">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-200 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider font-mono">
                  {getDaysUntilStart(session?.startDate)}
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  Live Interactive Zoom Masterclass
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                {session?.title || 'Hanuman Kriya: 11-Day Divine Awakening Masterclass'}
              </h1>

              <p className="text-stone-600 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>{session?.startDate || 'Oct 1'} – {session?.endDate || 'Oct 11'} • Daily 6:30 AM – 7:30 AM IST</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
              <div className="text-center sm:text-right w-full sm:w-auto">
                <div className="flex items-baseline justify-center sm:justify-end gap-2">
                  <span className="font-serif font-bold text-3xl sm:text-4xl text-[#2C2421]">₹{priceLive}</span>
                  <span className="text-stone-500 line-through text-sm">₹{priceLive * 2}</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-bold block uppercase tracking-wider">All 11 Days Included</span>
              </div>

              <button
                onClick={handleEnrollLive}
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-widest uppercase shadow-lg transition"
              >
                Enroll in Live Masterclass
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Curriculum Grid */}
      <div className="space-y-4 pt-4">
        <h3 className="font-serif text-2xl font-bold text-stone-900">11-Day Sacred Curriculum Breakdown</h3>
        <p className="text-xs text-stone-600">Sequential inner transformation from breath awareness to non-dual stillness.</p>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" staggerDelay={60}>
          {recordings.map((rec) => (
            <div key={rec.id || rec.dayNumber} className="p-5 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold font-mono text-[#8B5E34] uppercase tracking-wider">Day {rec.dayNumber}</span>
                <span className="text-stone-400 font-mono text-[11px]">{rec.duration || '50 mins'}</span>
              </div>
              <h4 className="font-serif font-bold text-base text-stone-900 leading-snug">{rec.title}</h4>
              <p className="text-xs text-stone-600 line-clamp-2">{rec.description}</p>
            </div>
          ))}
        </StaggerContainer>
      </div>

      {/* Secondary purchase options */}
      <div className="p-8 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h4 className="font-serif text-lg font-bold text-stone-900">Need Flexible Learning or Missed the 1st?</h4>
          <p className="text-xs text-stone-600">Access the full 11-day recordings pack at your own pace or extend your live access.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBuyRecordingsOnly}
            className="px-5 py-2.5 rounded-xl bg-white border border-[#D8CFBF] hover:bg-[#EFE9DD] text-[#2C2421] font-bold text-xs transition"
          >
            Recordings Only (₹{priceRecordings})
          </button>
          <button
            onClick={handleBuyExtension}
            className="px-5 py-2.5 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs transition"
          >
            30-Day Extension (₹{priceExtension})
          </button>
        </div>
      </div>

    </div>
  );
};
