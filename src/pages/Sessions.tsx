import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, Sparkles, CheckCircle2, Calendar, MessageCircle, ArrowRight, AlertCircle, Layers } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';
import { sessionsApi, productsApi, settingsApi } from '../api/client';

interface SessionsProps {
  setActiveTab: (tab: string) => void;
}

export const Sessions: React.FC<SessionsProps> = ({ setActiveTab }) => {
  const { user, openPaymentModal, openVideoModal, openAuthModal, t } = useApp();
  const [sessionsList, setSessionsList] = useState<any[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orientationUrl, setOrientationUrl] = useState<string>('');

  useEffect(() => {
    sessionsApi.getSessions().then(res => {
      const list = Array.isArray(res) ? res : res.data || [];
      setSessionsList(list);
      if (list.length > 0) {
        setSelectedSessionId(list[0].id);
      }
    }).catch(() => {
      // Fallback
    });

    productsApi.getActiveProducts().then(res => {
      const list = Array.isArray(res) ? res : res.data || [];
      if (list.length > 0) setProducts(list);
    }).catch(() => {});

    settingsApi.getPublicSettings().then(res => {
      const data = res.data || res;
      if (data?.free_orientation_video_url) {
        setOrientationUrl(data.free_orientation_video_url);
      }
    }).catch(() => {});
  }, []);

  const getProductPrice = (slug: string, fallback: number) => {
    const p = products.find(prod => prod.slug === slug);
    return p ? Number(p.price) : fallback;
  };

  const selectedSession = sessionsList.find(s => String(s.id) === String(selectedSessionId)) || sessionsList[0] || null;

  const priceLive = selectedSession?.priceLive || getProductPrice('live-masterclass', getProductPrice('live-session', 1111));
  const priceRecordings = selectedSession?.priceRecordings || getProductPrice('recordings-only', 1500);
  const priceExtension = selectedSession?.priceExtension || getProductPrice('recording-extension', 555);

  const handleEnrollLiveForSession = (targetSession?: any) => {
    const sess = targetSession || selectedSession;
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    const sessionPrice = sess?.priceLive || priceLive;
    const sessionTitle = sess?.title || "Hanuman Kriya: 11-Day Live Masterclass (Monthly Batch)";
    const sessionDates = sess?.startDate && sess?.endDate ? `${sess.startDate} to ${sess.endDate}` : 'Monthly 1st to 11th Batch';
    
    openPaymentModal({
      id: `session-live-${sess?.id || 1}`,
      name: `${sessionTitle} (Live Masterclass)`,
      price: sessionPrice,
      type: 'live-session',
      details: `${sessionDates} • Daily 6:30 AM IST • WhatsApp Community Link Included`,
      sessionId: sess?.id || 1
    });
  };

  const handleBuyRecordingsOnly = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    const sessionTitle = selectedSession?.title || "Hanuman Kriya Masterclass";
    openPaymentModal({
      id: `session-recordings-${selectedSession?.id || 1}`,
      name: `${sessionTitle} (Full Recordings Pack)`,
      price: priceRecordings,
      type: 'recordings-only',
      details: "Complete High-Definition Video Recordings via Private Stream • 30 Days Access from Purchase Date",
      sessionId: selectedSession?.id || 1
    });
  };

  const handleBuyExtension = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: `session-recording-extension-${selectedSession?.id || 1}`,
      name: "30-Day Recording Extension (Live Seeker Loyalty Upgrade)",
      price: priceExtension,
      type: 'recording-extension',
      details: "Exclusive to Live Batch Seekers • 30 Days Extended Recording Access",
      sessionId: selectedSession?.id || 1
    });
  };

  const handlePlayOrientation = () => {
    // 100% Free Orientation — Reliable preview stream, no login required!
    openVideoModal({
      day: 0,
      title: "Orientation Class: Introduction to Inner Silence & Prana",
      duration: "45 mins",
      desc: "Full free orientation session introducing Tripura Spiritual guided meditation, pranayama, and teaching methodology.",
      streamUrl: orientationUrl || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    });
  };

  return (
    <div className="section-container py-10 space-y-14 text-[#2C2421]">
      
      {/* Short Page Header Band */}
      <div className="card-spiritual bg-gradient-to-r from-[#FAF7F0] via-[#F5EFE6] to-[#FAF7F0] mandala-bg py-10 px-6 sm:px-12 text-center shadow-xs">
        <ScrollReveal animation="fade-up">
          <div className="section-header">
            <span className="section-eyebrow">
              Live Immersions & Masterclasses
            </span>
            <h1 className="heading-section text-[#2C2421]">
              {t.nav.sessions}
            </h1>
            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
              Structured live spiritual immersions, flexible 30-day recording packages, and private community guidance led directly by <strong>Master Gorli Peddi Raju Garu</strong>.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* ALL ACTIVE MASTERCLASSES & BATCHES SELECTOR (DYNAMIIC FROM ADMIN PORTAL) */}
      {sessionsList.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div>
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#8B5E34]" />
                <span className="text-xs font-bold uppercase tracking-widest text-[#8B5E34]">
                  Explore Masterclasses
                </span>
              </div>
              <h2 className="heading-card text-2xl text-[#2C2421] font-bold">
                Available Live Batches & Immersions
              </h2>
            </div>
            <span className="badge-spiritual py-1 px-3 text-xs font-semibold">
              {sessionsList.length} Active Masterclass{sessionsList.length > 1 ? 'es' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sessionsList.map((sess) => {
              const isSelected = String(sess.id) === String(selectedSession?.id);
              return (
                <div
                  key={sess.id}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`card-spiritual p-6 flex flex-col justify-between space-y-5 transition cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'border-2 border-[#D1A559] bg-[#FAF8F5] shadow-xl ring-2 ring-[#D1A559]/30'
                      : 'hover:border-[#D1A559]/60 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-0 right-0 bg-[#D1A559] text-stone-950 text-[10px] font-bold uppercase tracking-wider py-1 px-3 rounded-bl-xl shadow-xs">
                      Selected
                    </span>
                  )}

                  <div className="space-y-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-200 text-[10px] font-bold uppercase tracking-wider">
                        {sess.active ? 'Active Batch' : 'Scheduled'}
                      </span>
                      {sess.startDate && sess.endDate && (
                        <span className="text-[11px] font-mono text-stone-500">
                          {sess.startDate} → {sess.endDate}
                        </span>
                      )}
                    </div>

                    <h3 className="heading-card text-lg text-[#2C2421] font-bold leading-snug">
                      {sess.title}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {sess.description || "Awaken subtle energy, mental resilience, and pure consciousness through sacred movement, pranayama, and mantra frequencies."}
                    </p>
                  </div>

                  <div className="space-y-4 pt-3 border-t border-[#E6E0D2]">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div className="p-2 rounded-xl bg-white border border-[#E6E0D2]">
                        <span className="text-[9px] text-stone-500 block uppercase font-bold">Live Batch</span>
                        <span className="font-bold text-[#2C2421] text-sm">₹{sess.priceLive || 1111}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#E6E0D2]">
                        <span className="text-[9px] text-stone-500 block uppercase font-bold">Extension</span>
                        <span className="font-bold text-[#8B5E34] text-sm">₹{sess.priceExtension || 555}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-white border border-[#E6E0D2]">
                        <span className="text-[9px] text-stone-500 block uppercase font-bold">Recordings</span>
                        <span className="font-bold text-[#2C2421] text-sm">₹{sess.priceRecordings || 1500}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnrollLiveForSession(sess);
                        }}
                        className="btn-spiritual btn-primary flex-1 py-2.5 text-xs font-bold tracking-wider uppercase shadow-xs min-h-[40px]"
                      >
                        Enroll (₹{sess.priceLive || 1111})
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSessionId(sess.id);
                        }}
                        className={`btn-spiritual px-3.5 py-2.5 text-xs font-semibold rounded-full border transition min-h-[40px] ${
                          isSelected ? 'bg-[#3B234A] text-white border-[#3B234A]' : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                        }`}
                      >
                        {isSelected ? 'Viewing' : 'Select'}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* FEATURED BANNER: SELECTED MASTERCLASS */}
      <ScrollReveal animation="hero-zoom" duration={850}>
        <div className="bg-gradient-to-br from-[#3B234A] via-[#2A1836] to-[#1C0F24] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden border border-white/10">
          
          {/* Background Aura */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#D1A559]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-[#D1A559] text-stone-950 text-xs font-bold uppercase tracking-wider shadow-sm motion-safe:animate-pulse">
                  {selectedSession?.startDate && selectedSession?.endDate ? `${selectedSession.startDate} to ${selectedSession.endDate}` : 'Monthly Live Batch'}
                </span>
                <span className="px-3.5 py-1 rounded-full bg-white/10 text-[#D1A559] text-xs font-mono border border-white/15">
                  Daily 6:30 AM – 7:30 AM IST
                </span>
              </div>

              <h2 className="heading-hero text-white leading-tight font-serif text-2xl sm:text-4xl">
                {selectedSession?.title || "Hanuman Kriya: 11-Day Divine Awakening Masterclass"}
              </h2>

              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                {selectedSession?.description || "Awaken subtle energy, mental resilience, and pure consciousness through sacred movement, pranayama, and mantra frequencies. Live classes run interactively on Zoom with daily HD recordings uploaded to your seeker portal."}
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-light text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D1A559] shrink-0" />
                  <span>Live Interactive Zoom Masterclasses & Daily Guidance</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D1A559] shrink-0" />
                  <span>Daily HD Recordings via Private Stream</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D1A559] shrink-0" />
                  <span>Instant Private WhatsApp Community Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#D1A559] shrink-0" />
                  <span>30-Day Recording Extension for Live Seekers @ ₹{priceExtension}</span>
                </div>
              </div>
            </div>

            {/* Pricing & Enrollment Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-center space-y-4">
              <span className="text-[11px] uppercase tracking-widest text-[#D1A559] font-bold block">
                Live Immersion Pass
              </span>
              
              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-bold font-serif text-white">
                  ₹{priceLive.toLocaleString('en-IN')}
                </div>
                <p className="text-xs text-stone-300">Live Zoom Classes + WhatsApp Community</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => handleEnrollLiveForSession()}
                  className="btn-spiritual btn-gold w-full py-4 font-bold text-xs tracking-widest uppercase shadow-xl flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enroll for ₹{priceLive} & Join WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('session-details')}
                  className="btn-spiritual w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase border border-white/30 cursor-pointer min-h-[44px]"
                >
                  View Masterclass Curriculum
                </button>
              </div>

              <p className="text-[10px] text-stone-300 italic pt-1">
                Recordings valid during session. Extend anytime for 30 days @ ₹{priceExtension}.
              </p>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 4 SCENARIOS GRID BASED ON SEEKER TIMING & NEEDS */}
      <div className="space-y-6">
        <ScrollReveal animation="fade-up">
          <div className="text-center space-y-1">
            <h3 className="heading-section text-[#2C2421]">
              Which Pathway Suits You Best?
            </h3>
            <p className="text-xs text-stone-500">Structured pathways designed for both scheduled live seekers and mid-month self-paced learners</p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={120} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Scenario 1 - Live Masterclass */}
          <div className="card-spiritual p-6 border-2 border-[#3B234A] shadow-lg flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#3B234A] text-white text-[10px] font-bold uppercase tracking-wider">
              {selectedSession?.startDate && selectedSession?.endDate ? `${selectedSession.startDate}` : 'Live Batch'}
            </span>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E34] block">
                Scenario 1: Live Batch
              </span>
              <h4 className="heading-card text-[#2C2421]">
                {selectedSession?.title || "Hanuman Kriya Live Batch"}
              </h4>
              <p className="text-xs text-stone-700 font-light leading-relaxed">
                Join live Zoom sessions daily (6:30 AM IST). WhatsApp community link provided immediately upon enrollment.
              </p>

              <div className="pt-2 border-t border-[#E6E0D2]">
                <div className="text-2xl font-bold text-[#2C2421] font-serif">₹{priceLive.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-emerald-800 font-semibold">Includes WhatsApp Community + Live Zoom</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleEnrollLiveForSession()}
              className="btn-spiritual btn-primary w-full py-3.5 font-bold text-xs tracking-wider uppercase shadow-sm flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <span>Enroll for Live (₹{priceLive})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Scenario 1 Extension - 30-Day Recording Extension for Live Attendees */}
          <div className="card-spiritual p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E34]">
                  Live Seeker Extension
                </span>
                <span className="px-2 py-0.5 rounded-full bg-[#EFE9DD] text-[#8B5E34] border border-[#D8CFBF] text-[10px] font-bold">
                  Loyalty Rate
                </span>
              </div>

              <h4 className="heading-card text-[#2C2421]">
                30-Day Recording Extension
              </h4>
              <p className="text-xs text-stone-700 font-light leading-relaxed">
                Attending or completed your ₹{priceLive} live batch? Retain all daily masterclass recordings for <strong>30 full days from date of purchase</strong> to deepen your sadhana.
              </p>

              <div className="pt-2 border-t border-[#E6E0D2]">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#2C2421] font-serif">₹{priceExtension}</span>
                  <span className="text-xs text-stone-600 line-through">₹{priceLive}</span>
                </div>
                <span className="text-[10px] text-stone-600 font-medium">Valid 30 Days from Purchase Date</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyExtension}
              className="btn-spiritual btn-secondary w-full py-3.5 font-bold text-xs tracking-wider uppercase shadow-xs cursor-pointer min-h-[44px]"
            >
              Extend 30 Days (₹{priceExtension})
            </button>
          </div>

          {/* Card 3: Scenario 2 - Mid-Month Joiner (Full Recordings Pack) */}
          <div className="card-spiritual bg-[#FAF8F5] p-6 border-2 border-[#D1A559] shadow-md hover:shadow-lg transition flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#8B5E34] text-white text-[10px] font-bold uppercase tracking-wider">
              Discovered Mid-Month?
            </span>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 text-[#8B5E34] text-[10px] font-bold uppercase tracking-widest">
                <AlertCircle className="w-3.5 h-3.5 text-[#8B5E34] shrink-0" />
                <span>Scenario 2: Mid-Month Joiner</span>
              </div>

              <h4 className="heading-card text-[#2C2421]">
                Full Recordings Pack
              </h4>
              
              <p className="text-xs text-stone-700 font-light leading-relaxed">
                Found us mid-month? Since spiritual techniques build sequentially, access the <strong>complete recordings pack for 30 days</strong>, then join the upcoming live batch!
              </p>

              <div className="pt-2 border-t border-[#E6E0D2]">
                <div className="text-2xl font-bold text-[#2C2421] font-serif">₹{priceRecordings.toLocaleString('en-IN')}</div>
                <span className="text-[10px] text-[#8B5E34] font-semibold">Valid 30 Days from Date of Purchase</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyRecordingsOnly}
              className="btn-spiritual btn-secondary w-full py-3.5 font-bold text-xs tracking-wider uppercase shadow-sm cursor-pointer min-h-[44px]"
            >
              Get Recordings Pack (₹{priceRecordings})
            </button>
          </div>

          {/* Card 4: Free Orientation Class */}
          <div className="card-spiritual p-6 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider inline-block">
                Zero Cost • No Login
              </span>
              <h4 className="heading-card text-[#2C2421]">
                Free Orientation Class
              </h4>
              <p className="text-xs text-stone-700 font-light leading-relaxed">
                Experience Master Peddi Raju Garu's guided meditation, breath awareness, and teaching style at zero cost before enrolling.
              </p>

              <div className="pt-2 border-t border-[#E6E0D2]">
                <div className="text-2xl font-bold text-emerald-900 font-serif">FREE</div>
                <span className="text-[10px] text-emerald-800 font-semibold">45 Mins Full Video Preview</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handlePlayOrientation}
              className="btn-spiritual w-full py-3.5 rounded-full bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs tracking-wider uppercase shadow-sm flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Free Orientation</span>
            </button>
          </div>

        </StaggerContainer>
      </div>

      {/* MID-MONTH JOINER ADVISORY BANNER */}
      <ScrollReveal animation="fade-up">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#3B234A] to-[#251530] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D1A559]">
              <Calendar className="w-4 h-4 text-[#D1A559]" />
              <span>Mid-Month Discovery Policy</span>
            </div>
            <h4 className="heading-card text-xl sm:text-2xl font-bold text-white">
              Joined After the Batch Start Date?
            </h4>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              Masterclass techniques build progressively day by day. To ensure your foundational understanding, mid-month arrivals can access the complete recordings pack (₹{priceRecordings.toLocaleString('en-IN')} with 30-day access). After completing the recordings, you are eligible to join the next live batch!
            </p>
          </div>

          <button
            type="button"
            onClick={handleBuyRecordingsOnly}
            className="btn-spiritual btn-gold px-6 py-3.5 font-bold text-xs tracking-widest uppercase shadow-lg shrink-0 cursor-pointer min-h-[44px]"
          >
            Get ₹{priceRecordings.toLocaleString('en-IN')} Recordings Pack
          </button>
        </div>
      </ScrollReveal>

      {/* WhatsApp Community Direct Guidance Info */}
      <ScrollReveal animation="fade-up">
        <div className="card-spiritual p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B5E34]">
              <MessageCircle className="w-4 h-4 text-[#8B5E34]" />
              <span>Direct WhatsApp Community Integration</span>
            </div>
            <h4 className="heading-card text-xl font-bold text-[#2C2421]">
              How Live Sessions & Daily Links Work
            </h4>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              Upon completing your ₹{priceLive.toLocaleString('en-IN')} enrollment, you will be instantly provided with your private WhatsApp community invitation. Daily live Zoom links are shared every morning at 6:15 AM (15 minutes prior to 6:30 AM start). Daily session recordings are uploaded to the website by 12:00 PM next day.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleEnrollLiveForSession()}
            className="btn-spiritual btn-primary px-6 py-3.5 font-bold text-xs tracking-widest uppercase shadow-md shrink-0 cursor-pointer min-h-[44px]"
          >
            Enroll for ₹{priceLive.toLocaleString('en-IN')}
          </button>
        </div>
      </ScrollReveal>

    </div>
  );
};
