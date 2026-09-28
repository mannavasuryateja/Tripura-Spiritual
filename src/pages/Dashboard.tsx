import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Lock, User, Calendar, MessageCircle, Sparkles, Clock, LogOut, CreditCard, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';
import { recordingsApi, sessionsApi, paymentsApi, mentorApi } from '../api/client';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { user, logout, openPaymentModal, openVideoModal, openAuthModal, t } = useApp();
  const [activePortalTab, setActivePortalTab] = useState<'recordings' | 'upcoming' | 'purchases' | 'bookings'>('recordings');

  // Dynamic server data with individual loading and error states
  const [recordings, setRecordings] = useState<any[]>([]);
  const [isLoadingRecordings, setIsLoadingRecordings] = useState(false);
  const [recordingsError, setRecordingsError] = useState<string | null>(null);

  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const [isLoadingSession, setIsLoadingSession] = useState(false);
  const [sessionError, setSessionError] = useState<string | null>(null);

  const [myPurchases, setMyPurchases] = useState<any[]>([]);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState(false);
  const [purchasesError, setPurchasesError] = useState<string | null>(null);

  const [myBookings, setMyBookings] = useState<any[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [bookingsError, setBookingsError] = useState<string | null>(null);

  const fetchRecordings = useCallback(async () => {
    setIsLoadingRecordings(true);
    setRecordingsError(null);
    try {
      const recs = await recordingsApi.getSessionRecordings(1);
      setRecordings(recs || []);
    } catch (err: any) {
      setRecordingsError(err?.message || 'Unable to load recordings.');
    } finally {
      setIsLoadingRecordings(false);
    }
  }, []);

  const fetchSession = useCallback(async () => {
    setIsLoadingSession(true);
    setSessionError(null);
    try {
      const sessions = await sessionsApi.getSessions();
      if (sessions && sessions.length > 0) {
        setSessionInfo(sessions[0]);
      }
    } catch (err: any) {
      setSessionError(err?.message || 'Unable to load session schedule.');
    } finally {
      setIsLoadingSession(false);
    }
  }, []);

  const fetchPurchases = useCallback(async () => {
    setIsLoadingPurchases(true);
    setPurchasesError(null);
    try {
      const purchases = await paymentsApi.getMyPurchases();
      setMyPurchases(purchases || []);
    } catch (err: any) {
      setPurchasesError(err?.message || 'Unable to load purchases.');
    } finally {
      setIsLoadingPurchases(false);
    }
  }, []);

  const fetchBookings = useCallback(async () => {
    setIsLoadingBookings(true);
    setBookingsError(null);
    try {
      const bookings = await mentorApi.getMyBookings();
      setMyBookings(bookings || []);
    } catch (err: any) {
      setBookingsError(err?.message || 'Unable to load 1-on-1 bookings.');
    } finally {
      setIsLoadingBookings(false);
    }
  }, []);

  useEffect(() => {
    if (user.isLoggedIn) {
      fetchRecordings();
      fetchSession();
      fetchPurchases();
      fetchBookings();
    }
  }, [user.isLoggedIn, fetchRecordings, fetchSession, fetchPurchases, fetchBookings]);

  if (!user.isLoggedIn) {
    return (
      <div className="section-container max-w-2xl py-20 text-center space-y-6 animate-fadeIn text-[#2C2421]">
        <ScrollReveal animation="hero-zoom">
          <div className="w-16 h-16 rounded-full bg-[#EFE9DD] text-[#3B234A] flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="heading-section font-bold text-[#2C2421]">Sign In to Access Your Portal</h2>
          <p className="text-stone-600 text-sm max-w-lg mx-auto">
            Please log in with your registered mobile number or email credentials to access your masterclass recordings and live classes.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={openAuthModal}
              className="btn-spiritual btn-primary px-8 py-3.5 rounded-full text-xs tracking-widest uppercase shadow-md transition"
            >
              Sign In with OTP
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className="btn-spiritual btn-outline px-8 py-3.5 rounded-full text-[#3B234A] border-[#3B234A] hover:bg-[#3B234A]/10 text-xs tracking-widest uppercase transition"
            >
              Email & Password Sign In
            </button>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  const handleJoinWhatsApp = () => {
    const link = user.subscription?.whatsappLink || sessionInfo?.whatsappCommunityUrl || 'https://chat.whatsapp.com/TripuraSpiritualCommunityLive2026';
    window.open(link, '_blank');
  };

  const handleBuyExtension = () => {
    openPaymentModal({
      id: 'hanuman-kriya-recording-extension',
      name: "30-Day Recording Extension (Live Seeker Loyalty Upgrade)",
      price: sessionInfo?.priceExtension || 555,
      type: 'recording-extension',
      details: "Exclusive to Live Batch Seekers • 30 Days Extended Access from Date of Purchase",
      sessionId: sessionInfo?.id || 1
    });
  };

  const currentRole = user.role || 'ROLE_SEEKER';

  const rolePillStyles: Record<string, { bg: string; text: string; label: string }> = {
    'ROLE_ADMIN': { bg: 'bg-purple-600 text-white', text: 'text-purple-700', label: 'Platform Admin' },
    'ROLE_MASTER': { bg: 'bg-amber-600 text-white', text: 'text-amber-700', label: 'Spiritual Master' },
    'ROLE_ENROLLED': { bg: 'bg-emerald-600 text-white', text: 'text-emerald-700', label: 'Enrolled Seeker' },
    'ROLE_SEEKER': { bg: 'bg-stone-600 text-white', text: 'text-stone-700', label: 'Guest Seeker' }
  };

  // Helper to test if user has access to day recording
  const isRecordingUnlocked = (dayNum: number) => {
    if (currentRole === 'ROLE_ADMIN' || currentRole === 'ROLE_MASTER') return true;
    if (dayNum === 1 || dayNum === 2) return true; // Free orientation / introductory
    if (user.subscription.hasActivePlan) return true;
    return user.subscription.unlockedDays?.includes(dayNum);
  };

  return (
    <div className="section-container py-10 space-y-8 animate-fadeIn text-[#2C2421]">
      
      {/* 1. Welcome Banner & Active Enrollment Status */}
      <ScrollReveal animation="hero-zoom">
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#E6E0D2] shadow-lg space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <span className="section-eyebrow">
                  {t.dashboard.welcome}
                </span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${rolePillStyles[currentRole]?.bg || 'bg-stone-600 text-white'}`}>
                  {rolePillStyles[currentRole]?.label || currentRole}
                </span>
              </div>
              <h1 className="heading-section font-bold text-[#2C2421]">
                {user.name}
              </h1>
              <p className="text-xs text-stone-500 font-mono">
                {user.email ? `Email: ${user.email}` : `Mobile: +91 ${user.phone}`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab('profile')}
                className="btn-spiritual px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
              >
                Account Details
              </button>
              <button
                onClick={() => { logout(); setActiveTab('home'); }}
                className="btn-spiritual px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          </div>

          {/* Active Enrollment Card */}
          <div className={`p-6 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
            user.subscription.hasActivePlan
              ? 'bg-gradient-to-r from-emerald-500/10 via-amber-500/10 to-teal-500/10 border-emerald-300'
              : 'bg-stone-100 border-stone-200'
          }`}>
            <div className="space-y-1.5">
              <span className="text-xs text-stone-500 uppercase font-bold tracking-wider">{t.dashboard.activePlan}</span>
              <h3 className="font-serif font-bold text-xl text-stone-900 flex items-center gap-2">
                <span>{user.subscription.planName}</span>
                {user.subscription.hasActivePlan ? (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] uppercase font-bold tracking-wider">
                    Full Access Granted
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-stone-500 text-white text-[10px] uppercase font-bold tracking-wider">
                    Free Orientation Mode
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-700 font-medium">
                Validity: <strong className="text-stone-900 font-mono">{user.subscription.validUntil}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {user.subscription.hasActivePlan ? (
                <>
                  <button
                    onClick={handleJoinWhatsApp}
                    className="btn-spiritual px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>WhatsApp Community</span>
                  </button>
                  <button
                    onClick={handleBuyExtension}
                    className="btn-spiritual px-4 py-2.5 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                    title="Extend recordings for 30 days"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>30-Day Extension (₹{sessionInfo?.priceExtension || 555})</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setActiveTab('sessions')}
                  className="btn-spiritual btn-primary px-6 py-3 rounded-xl font-bold text-xs shadow-md transition uppercase tracking-wider"
                >
                  Enroll in Masterclass (₹{sessionInfo?.priceLive || 1111})
                </button>
              )}
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* 2. TAB NAVIGATION */}
      <div className="space-y-6">
        
        {/* Navigation Switcher with ARIA Tablist Roles */}
        <div role="tablist" aria-label="Seeker Portal Tabs" className="flex flex-wrap border-b border-[#E6E0D2] gap-1">
          <button
            role="tab"
            id="tab-recordings"
            aria-selected={activePortalTab === 'recordings'}
            aria-controls="panel-recordings"
            onClick={() => setActivePortalTab('recordings')}
            className={`px-5 py-3 font-serif text-base sm:text-lg font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activePortalTab === 'recordings'
                ? 'border-[#3B234A] text-[#3B234A]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>Recorded Classes</span>
          </button>

          <button
            role="tab"
            id="tab-upcoming"
            aria-selected={activePortalTab === 'upcoming'}
            aria-controls="panel-upcoming"
            onClick={() => setActivePortalTab('upcoming')}
            className={`px-5 py-3 font-serif text-base sm:text-lg font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activePortalTab === 'upcoming'
                ? 'border-[#3B234A] text-[#3B234A]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Live Classes</span>
          </button>

          <button
            role="tab"
            id="tab-purchases"
            aria-selected={activePortalTab === 'purchases'}
            aria-controls="panel-purchases"
            onClick={() => setActivePortalTab('purchases')}
            className={`px-5 py-3 font-serif text-base sm:text-lg font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activePortalTab === 'purchases'
                ? 'border-[#3B234A] text-[#3B234A]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>My Purchases ({myPurchases.length})</span>
          </button>

          <button
            role="tab"
            id="tab-bookings"
            aria-selected={activePortalTab === 'bookings'}
            aria-controls="panel-bookings"
            onClick={() => setActivePortalTab('bookings')}
            className={`px-5 py-3 font-serif text-base sm:text-lg font-bold transition border-b-2 flex items-center gap-2 cursor-pointer ${
              activePortalTab === 'bookings'
                ? 'border-[#3B234A] text-[#3B234A]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>1-on-1 Bookings ({myBookings.length})</span>
          </button>
        </div>

        {/* TAB 1: RECORDED CLASSES */}
        {activePortalTab === 'recordings' && (
          <div role="tabpanel" id="panel-recordings" aria-labelledby="tab-recordings" className="space-y-6 animate-fadeIn">
            
            {/* Policy Bar */}
            <ScrollReveal animation="fade-up">
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs">
                <div className="flex items-center gap-2 text-stone-700">
                  <Clock className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>
                    <strong>Recording Policy:</strong> Available next day by 12:00 PM until the 13th day.
                  </span>
                </div>

                {user.subscription.hasActivePlan && (
                  <button
                    onClick={handleBuyExtension}
                    className="btn-spiritual px-4 py-1.5 rounded-lg bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs shadow-xs transition shrink-0 flex items-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Keep for 30 Days (₹{sessionInfo?.priceExtension || 555} Loyalty Upgrade)</span>
                  </button>
                )}
              </div>
            </ScrollReveal>

            {/* Error & Retry State */}
            {recordingsError && (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{recordingsError}</span>
                </div>
                <button
                  onClick={fetchRecordings}
                  className="btn-spiritual btn-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Loading Recordings</span>
                </button>
              </div>
            )}

            {/* Loading */}
            {isLoadingRecordings && (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-amber-700 motion-safe:animate-spin mx-auto" />
                <p className="text-xs text-stone-500 mt-2 font-serif">Loading recordings...</p>
              </div>
            )}

            {/* Recordings Grid */}
            {!isLoadingRecordings && !recordingsError && (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-4" staggerDelay={80}>
                {recordings.map((rec) => {
                  const isUnlocked = isRecordingUnlocked(rec.dayNumber);

                  return (
                    <div
                      key={rec.id || rec.dayNumber}
                      className={`p-5 rounded-2xl border transition-all ${
                        isUnlocked
                          ? 'bg-white border-[#E6E0D2] shadow-xs hover:shadow-md hover:border-[#8B5E34]'
                          : 'bg-stone-50 border-stone-200 opacity-80'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider font-mono ${
                              isUnlocked ? 'bg-amber-100 text-[#8B5E34]' : 'bg-stone-200 text-stone-600'
                            }`}>
                              Day {rec.dayNumber}
                            </span>
                            <span className="text-[11px] text-stone-400 font-mono">
                              ⏱ {rec.duration || '50 mins'}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-base text-stone-900 leading-snug">
                            {rec.title}
                          </h4>

                          <p className="text-xs text-stone-500 line-clamp-2">
                            {rec.description || 'Sacred guided meditation, pranayama, and awakening inquiry.'}
                          </p>
                        </div>

                        <div className="shrink-0 self-center">
                          {isUnlocked ? (
                            <button
                              onClick={() => {
                                openVideoModal({
                                  day: rec.dayNumber,
                                  title: rec.title,
                                  duration: rec.duration,
                                  desc: rec.description,
                                  streamUrl: rec.bunnyVideoId ? `/api/media/stream/${rec.bunnyVideoId}` : undefined
                                });
                              }}
                              className="btn-spiritual p-3 rounded-2xl bg-[#8B5E34] hover:bg-[#6e4623] text-white shadow-md transition transform hover:scale-105"
                              title="Play Recording"
                            >
                              <Play className="w-5 h-5 fill-white" />
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                openPaymentModal({
                                  id: 'hanuman-kriya-live-1111',
                                  name: "Hanuman Kriya 11-Day Live Masterclass",
                                  price: sessionInfo?.priceLive || 1111,
                                  type: 'live-session',
                                  details: "Unlock all 11 daily recordings & live zoom classes"
                                });
                              }}
                              className="btn-spiritual p-3 rounded-2xl bg-stone-200 hover:bg-stone-300 text-stone-500 transition"
                              title="Locked - Enroll to Access"
                            >
                              <Lock className="w-5 h-5" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </StaggerContainer>
            )}
          </div>
        )}

        {/* TAB 2: UPCOMING LIVE CLASSES */}
        {activePortalTab === 'upcoming' && (
          <div role="tabpanel" id="panel-upcoming" aria-labelledby="tab-upcoming" className="space-y-6 animate-fadeIn">
            {sessionError && (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{sessionError}</span>
                </div>
                <button
                  onClick={fetchSession}
                  className="btn-spiritual btn-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Loading Schedule</span>
                </button>
              </div>
            )}

            {isLoadingSession ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-amber-700 motion-safe:animate-spin mx-auto" />
                <p className="text-xs text-stone-500 mt-2 font-serif">Loading live schedule...</p>
              </div>
            ) : (
              <div className="p-6 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] space-y-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#E6E0D2] pb-4">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-[#2C2421]">
                      {sessionInfo?.title || 'Hanuman Kriya 11-Day Live Masterclass'}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Daily Schedule: 6:30 AM – 7:30 AM IST • Live on Zoom with Master Gorli Peddi Raju Garu
                    </p>
                  </div>
                  <button
                    onClick={handleJoinWhatsApp}
                    className="btn-spiritual px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Join Live Community</span>
                  </button>
                </div>

                <div className="divide-y divide-[#E6E0D2]">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((dayNum) => (
                    <div key={dayNum} className="py-3 flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-full bg-[#EFE9DD] text-[#3B234A] font-mono font-bold flex items-center justify-center shrink-0">
                          {dayNum}
                        </span>
                        <div>
                          <span className="font-bold text-stone-800 block">Day {dayNum} Live Guided Practice</span>
                          <span className="text-[10px] text-stone-500 font-mono">6:30 AM – 7:30 AM IST</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                        {user.subscription.hasActivePlan ? 'Confirmed' : 'Enrollment Required'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY PURCHASES */}
        {activePortalTab === 'purchases' && (
          <div role="tabpanel" id="panel-purchases" aria-labelledby="tab-purchases" className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2C2421]">My Purchases & Invoices</h3>
              <p className="text-xs text-stone-500">Official ledger of your active entitlements and transactions.</p>
            </div>

            {purchasesError && (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{purchasesError}</span>
                </div>
                <button
                  onClick={fetchPurchases}
                  className="btn-spiritual btn-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Loading Purchases</span>
                </button>
              </div>
            )}

            {isLoadingPurchases ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-amber-700 motion-safe:animate-spin mx-auto" />
                <p className="text-xs text-stone-500 mt-2 font-serif">Loading purchase history...</p>
              </div>
            ) : (
              <div className="rounded-3xl bg-white border border-[#E6E0D2] overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F0] text-stone-500 uppercase tracking-wider text-[10px] border-b border-[#E6E0D2]">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Product / Purpose</th>
                      <th className="p-4">Amount Paid</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E6E0D2]">
                    {myPurchases.map((p, idx) => (
                      <tr key={idx} className="hover:bg-amber-50/30">
                        <td className="p-4 font-mono text-stone-500">{p.razorpayOrderId}</td>
                        <td className="p-4 font-medium text-stone-900">{p.purpose}</td>
                        <td className="p-4 font-bold text-stone-900">₹{p.amount}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-stone-500 font-mono">
                          {p.createdAt ? String(p.createdAt).substring(0, 10) : 'Recent'}
                        </td>
                      </tr>
                    ))}
                    {myPurchases.length === 0 && (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-stone-500">
                          No purchases found. Explore our sacred sessions or book library to enroll.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: 1-ON-1 BOOKINGS */}
        {activePortalTab === 'bookings' && (
          <div role="tabpanel" id="panel-bookings" aria-labelledby="tab-bookings" className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-serif text-xl font-bold text-[#2C2421]">1-on-1 Guidance Appointments</h3>
                <p className="text-xs text-stone-500">Your direct mentoring inquiries with Master Gorli Peddi Raju Garu.</p>
              </div>
              <button
                onClick={() => setActiveTab('onetoone')}
                className="btn-spiritual px-4 py-2 rounded-xl bg-[#3B234A] text-white font-bold text-xs uppercase tracking-wider"
              >
                Book New Session
              </button>
            </div>

            {bookingsError && (
              <div className="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-center space-y-3">
                <div className="flex items-center justify-center gap-2 text-rose-700 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{bookingsError}</span>
                </div>
                <button
                  onClick={fetchBookings}
                  className="btn-spiritual btn-primary px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Loading Bookings</span>
                </button>
              </div>
            )}

            {isLoadingBookings ? (
              <div className="py-12 text-center">
                <Loader2 className="w-8 h-8 text-amber-700 motion-safe:animate-spin mx-auto" />
                <p className="text-xs text-stone-500 mt-2 font-serif">Loading guidance bookings...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {myBookings.map((b) => (
                  <div key={b.id} className="p-5 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-bold text-[#8B5E34] uppercase tracking-wider font-mono">
                          Booking #{b.id}
                        </span>
                        <h4 className="font-serif font-bold text-base text-stone-900">{b.category}</h4>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1 font-mono">
                      <p>Primary Date: <strong>{b.primaryDate}</strong></p>
                      {b.secondaryDate && <p>Alternative Date: {b.secondaryDate}</p>}
                      <p>Time Slot: {b.preferredTimeSlot || '6:30 AM IST'}</p>
                      <p>Duration: {b.durationMinutes} Minutes</p>
                    </div>
                  </div>
                ))}
                {myBookings.length === 0 && (
                  <div className="col-span-2 p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs">
                    You have not scheduled any 1-on-1 guidance appointments yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
