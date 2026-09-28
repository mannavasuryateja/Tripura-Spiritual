import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, ChevronLeft, AlertCircle, RefreshCw } from 'lucide-react';
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
  const [error, setError] = useState<string | null>(null);

  const fetchSessionDetails = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [sessions, recs] = await Promise.all([
        sessionsApi.getSessions(),
        recordingsApi.getSessionRecordings(1)
      ]);
      if (sessions && sessions.length > 0) {
        setSession(sessions[0]);
      }
      setRecordings(recs || []);
    } catch (err: any) {
      setError(err?.message || 'Unable to load curriculum details. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionDetails();
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
      <>
        <span className="sr-only" role="status">Loading session details</span>
        <div aria-hidden="true" className="section-container py-10 space-y-8 motion-safe:animate-pulse text-[#2C2421]">
          {/* Back Button Skeleton */}
          <div className="w-36 h-4 bg-[#EFE9DD] rounded-full"></div>

          {/* Hero Card Skeleton */}
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-amber-100/60 shadow-md space-y-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="space-y-3 flex-1">
                <div className="flex gap-2">
                  <div className="w-28 h-6 bg-[#EFE9DD] rounded-full"></div>
                  <div className="w-44 h-6 bg-[#EFE9DD] rounded-full"></div>
                </div>
                <div className="w-3/4 h-9 bg-[#EFE9DD] rounded-xl"></div>
                <div className="w-1/2 h-5 bg-[#EFE9DD] rounded-lg"></div>
              </div>
              <div className="flex items-center gap-4 w-full lg:w-auto">
                <div className="w-24 h-10 bg-[#EFE9DD] rounded-xl"></div>
                <div className="w-48 h-12 bg-[#EFE9DD] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Curriculum Grid Skeleton */}
          <div className="space-y-4 pt-4">
            <div className="w-64 h-7 bg-[#EFE9DD] rounded-xl"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="p-5 rounded-2xl bg-white/70 border border-[#E6E0D2] space-y-3 shadow-xs">
                  <div className="flex justify-between">
                    <div className="w-16 h-4 bg-[#EFE9DD] rounded"></div>
                    <div className="w-12 h-4 bg-[#EFE9DD] rounded"></div>
                  </div>
                  <div className="w-3/4 h-5 bg-[#EFE9DD] rounded"></div>
                  <div className="w-full h-4 bg-[#EFE9DD] rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <div className="section-container py-12 space-y-6 text-[#2C2421]">
        <button
          onClick={() => setActiveTab('sessions')}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B5E34] hover:text-[#2C2421] transition cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to All Sessions</span>
        </button>

        <div className="p-8 sm:p-12 rounded-3xl bg-rose-50 border border-rose-200 text-center space-y-4 max-w-lg mx-auto shadow-sm">
          <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-xl font-bold text-stone-900">Unable to Load Curriculum</h3>
          <p className="text-xs text-stone-600 leading-relaxed">{error}</p>
          <button
            onClick={fetchSessionDetails}
            className="btn-spiritual btn-primary px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="section-container py-10 space-y-10 animate-fadeIn text-[#2C2421]">
      
      {/* Short Page Header Band */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FAF7F0] via-[#F5EFE6] to-[#FAF7F0] mandala-bg border border-[#E6E0D2] py-8 px-6 sm:px-12 text-center shadow-xs">
        <ScrollReveal animation="fade-up">
          <div className="section-header">
            <span className="section-eyebrow">
              Detailed Curriculum & Schedule
            </span>
            <h1 className="heading-section font-bold text-[#2C2421]">
              11-Day Sacred Curriculum
            </h1>
            <p className="text-stone-600 text-sm font-light max-w-xl mx-auto">
              Sequential inner transformation from foundational breath awareness to non-dual stillness led by Master Gorli Peddi Raju Garu.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Back button */}
      <button
        onClick={() => setActiveTab('sessions')}
        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B5E34] hover:text-[#2C2421] transition cursor-pointer"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to All Sessions</span>
      </button>

      {/* Header Info Banner */}
      <ScrollReveal animation="hero-zoom">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#E6E0D2] shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3.5 py-1 rounded-full bg-[#EFE9DD] text-[#8B5E34] border border-[#D8CFBF] text-xs font-bold uppercase tracking-wider font-mono">
                  {getDaysUntilStart(session?.startDate)}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-semibold">
                  Live Interactive Zoom Masterclass
                </span>
              </div>

              <h2 className="heading-serif text-3xl sm:text-4xl font-bold text-[#2C2421] leading-tight">
                {session?.title || 'Hanuman Kriya: 11-Day Divine Awakening Masterclass'}
              </h2>

              <p className="text-stone-700 text-sm flex items-center gap-2 font-light">
                <Calendar className="w-4 h-4 text-[#8B5E34]" />
                <span>{session?.startDate || 'Oct 1'} – {session?.endDate || 'Oct 11'} • Daily 6:30 AM – 7:30 AM IST</span>
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0 w-full lg:w-auto">
              <div className="text-center sm:text-right w-full sm:w-auto">
                <div className="flex items-baseline justify-center sm:justify-end gap-2">
                  <span className="font-serif font-bold text-3xl sm:text-4xl text-[#2C2421]">₹{priceLive.toLocaleString('en-IN')}</span>
                  <span className="text-stone-600 line-through text-sm">₹{(priceLive * 2).toLocaleString('en-IN')}</span>
                </div>
                <span className="text-[10px] text-emerald-800 font-bold block uppercase tracking-wider">All 11 Days Included</span>
              </div>

              <button
                onClick={handleEnrollLive}
                className="btn-spiritual btn-primary w-full sm:w-auto px-8 py-4 rounded-full font-bold text-xs tracking-widest uppercase shadow-lg transition cursor-pointer"
              >
                Enroll in Live Masterclass
              </button>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Curriculum Grid */}
      <div className="space-y-4 pt-2">
        <h3 className="heading-card font-serif text-2xl font-bold text-[#2C2421]">11-Day Sacred Curriculum Breakdown</h3>
        <p className="text-xs text-stone-700">Sequential inner transformation from breath awareness to non-dual stillness.</p>

        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2" staggerDelay={60}>
          {recordings.map((rec) => (
            <div key={rec.id || rec.dayNumber} className="p-5 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold font-mono text-[#8B5E34] uppercase tracking-wider">Day {rec.dayNumber}</span>
                <span className="text-stone-600 font-mono text-[11px] font-medium">{rec.duration || '50 mins'}</span>
              </div>
              <h4 className="font-serif font-bold text-base text-[#2C2421] leading-snug">{rec.title}</h4>
              <p className="text-xs text-stone-700 line-clamp-2 font-light leading-relaxed">{rec.description}</p>
            </div>
          ))}
        </StaggerContainer>
      </div>

      {/* Secondary purchase options */}
      <div className="p-8 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="space-y-1">
          <h4 className="heading-card font-serif text-lg font-bold text-[#2C2421]">Need Flexible Learning or Missed the 1st?</h4>
          <p className="text-xs text-stone-700 font-light">Access the full 11-day recordings pack at your own pace or extend your live access.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleBuyRecordingsOnly}
            className="btn-spiritual px-5 py-2.5 rounded-xl bg-white border border-[#D8CFBF] hover:bg-[#EFE9DD] text-[#2C2421] font-bold text-xs transition cursor-pointer"
          >
            Recordings Only (₹{priceRecordings.toLocaleString('en-IN')})
          </button>
          <button
            onClick={handleBuyExtension}
            className="btn-spiritual px-5 py-2.5 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs transition cursor-pointer"
          >
            30-Day Extension (₹{priceExtension.toLocaleString('en-IN')})
          </button>
        </div>
      </div>

    </div>
  );
};
