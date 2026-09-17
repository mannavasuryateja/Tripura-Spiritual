import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';

interface SessionsProps {
  setActiveTab: (tab: string) => void;
}

export const Sessions: React.FC<SessionsProps> = ({ setActiveTab }) => {
  const { user, openPaymentModal, openVideoModal, openAuthModal, t } = useApp();

  const handleEnrollLive = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: 'hanuman-kriya-live',
      name: "Hanuman Kriya: 11-Day Divine Awakening Masterclass",
      price: 1111,
      type: 'live-session',
      details: "Oct 1 – Oct 11 • Daily 6:30 AM IST • WhatsApp Community Live Link Included"
    });
  };

  const handleBuyRecordingsOnly = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: 'hanuman-kriya-recordings-only',
      name: "Hanuman Kriya: Full 11-Day Recording Pack (21 Days Validity)",
      price: 1500,
      type: 'recordings-only',
      details: "Complete 11-Day Video Recordings • 21 Days Access from Purchase Date"
    });
  };

  const handleBuyExtension = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: 'hanuman-kriya-recording-extension',
      name: "21-Day Recording Extension (49% Live Seeker Discount)",
      price: 555,
      type: 'recording-extension',
      details: "Exclusive to Live Batch Seekers • 21 Days Extended Access"
    });
  };

  const handlePlayOrientation = () => {
    // 100% Free Orientation — No login or payment required!
    openVideoModal({
      day: 0,
      title: "Orientation Class: Introduction to Inner Silence & Prana",
      duration: "45 mins",
      desc: "Full free orientation session introducing Tripura Spiritual guided meditation, pranayama, and teaching methodology."
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fadeIn text-[#2C2421]">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B5E34]">
          Live Immersions & Masterclasses
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2421]">
          {t.nav.sessions}
        </h1>
        <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
          Structured 11-day spiritual immersions, flexible recording packages, and private community guidance led directly by <strong>Gorli Peddi Raju Garu</strong>.
        </p>
      </div>

      {/* FEATURED BANNER: HANUMAN KRIYA (OCTOBER 1 TO 11) */}
      <div className="bg-gradient-to-br from-[#3B234A] via-[#2A1836] to-[#1C0F24] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
        
        {/* Background Aura */}
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          <div className="lg:col-span-8 space-y-5">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
                Starts in 5 Days • Coming Soon
              </span>
              <span className="px-3.5 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-mono">
                October 1 – October 11, 2026
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
              Hanuman Kriya: 11-Day Divine Awakening Masterclass
            </h2>

            <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
              Awaken subtle energy, mental resilience, and pure consciousness through sacred movement, pranayama, and mantra frequencies. Live classes held daily at <strong>6:30 AM IST</strong> with direct daily guidance in our private WhatsApp community.
            </p>

            {/* Features List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-light text-stone-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Daily 6:30 AM Live Interactive Zoom Sessions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Automatic Next-Day 12 PM HD Recordings (Till Day 13)</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Direct WhatsApp Community Links & Master Support</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Dual Language Instruction (English & Telugu)</span>
              </div>
            </div>
          </div>

          {/* Pricing & Enrollment Card */}
          <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-center space-y-4">
            <span className="text-[11px] uppercase tracking-widest text-amber-300 font-bold block">
              11-Day Live Immersion Pass
            </span>
            
            <div className="space-y-1">
              <div className="text-4xl sm:text-5xl font-bold font-sans text-white">
                ₹1,111
              </div>
              <p className="text-xs text-stone-300">Complete 11 Days Live + WhatsApp Access</p>
            </div>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleEnrollLive}
                className="w-full py-4 rounded-full bg-[#D1A559] hover:bg-[#C29548] text-[#201812] font-bold text-xs tracking-widest uppercase shadow-xl transition transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Enroll Now & Join WhatsApp</span>
              </button>

              <button
                onClick={() => setActiveTab('session-details')}
                className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase border border-white/30 transition"
              >
                View 11-Day Curriculum
              </button>
            </div>

            <p className="text-[10px] text-stone-300 italic pt-1">
              Includes live access + recordings available till the 13th day.
            </p>
          </div>

        </div>
      </div>

      {/* 4 CORE SCENARIO CARDS GRID */}
      <div className="space-y-6">
        <div className="text-center space-y-1">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2421]">
            Flexible Pathways for Every Seeker
          </h3>
          <p className="text-xs text-stone-500">Choose the option that fits your schedule and spiritual journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: 11-Day Live Masterclass */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#3B234A] shadow-lg flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#3B234A] text-white text-[10px] font-bold uppercase tracking-wider">
              Starts Oct 1 (In 5 Days)
            </span>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E34] block">
                Live Masterclass
              </span>
              <h4 className="font-serif text-xl font-bold text-[#2C2421]">
                Hanuman Kriya Live Batch
              </h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Join live Zoom sessions daily from Oct 1 to Oct 11. Recordings available until Day 13 at 12:00 PM.
              </p>

              <div className="pt-2 border-t border-[#F0EBE1]">
                <div className="text-2xl font-bold text-[#2C2421] font-sans">₹1,111</div>
                <span className="text-[10px] text-emerald-700 font-semibold">Includes WhatsApp Community</span>
              </div>
            </div>

            <button
              onClick={handleEnrollLive}
              className="w-full py-3 rounded-xl bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-wider uppercase transition shadow-sm"
            >
              Enroll for Live (₹1,111)
            </button>
          </div>

          {/* Card 2: Scenario 1 - 21-Day Recording Extension for Live Attendees */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E0D2] shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  Scenario 1: Live Attendee
                </span>
                <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold">
                  49% OFF
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-[#2C2421]">
                21-Day Recording Extension
              </h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Because live practices can take time to fully absorb, live attendees can retain all 11 daily recordings for 21 days from purchase date.
              </p>

              <div className="pt-2 border-t border-[#F0EBE1]">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#2C2421] font-sans">₹555</span>
                  <span className="text-xs text-stone-400 line-through">₹1,111</span>
                </div>
                <span className="text-[10px] text-stone-500 font-medium">For Live Batch Seekers</span>
              </div>
            </div>

            <button
              onClick={handleBuyExtension}
              className="w-full py-3 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs tracking-wider uppercase transition shadow-xs"
            >
              Extend 21 Days (₹555)
            </button>
          </div>

          {/* Card 3: Scenario 2 - Recordings Only for Late Joiners */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E0D2] shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A7067] block">
                Scenario 2: Post-Day 13 / New
              </span>
              <h4 className="font-serif text-xl font-bold text-[#2C2421]">
                Full 11-Day Recordings Pack
              </h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Discovered the session after completion or on/after the 13th day? Access all 11 high-definition recordings for 21 days from purchase date.
              </p>

              <div className="pt-2 border-t border-[#F0EBE1]">
                <div className="text-2xl font-bold text-[#2C2421] font-sans">₹1,500</div>
                <span className="text-[10px] text-stone-500 font-medium">21-Day Recording Access</span>
              </div>
            </div>

            <button
              onClick={handleBuyRecordingsOnly}
              className="w-full py-3 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs tracking-wider uppercase transition shadow-xs"
            >
              Get Recordings Pack (₹1,500)
            </button>
          </div>

          {/* Card 4: Free Orientation Class */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase tracking-wider inline-block">
                No Login Required
              </span>
              <h4 className="font-serif text-xl font-bold text-emerald-950">
                Free Orientation Class
              </h4>
              <p className="text-xs text-emerald-800 font-light leading-relaxed">
                Experience Master Peddi Raju Garu's guided meditation, breath awareness, and teaching style at zero cost before joining.
              </p>

              <div className="pt-2 border-t border-emerald-200">
                <div className="text-2xl font-bold text-emerald-900 font-sans">FREE</div>
                <span className="text-[10px] text-emerald-700 font-semibold">45 Mins Full Video</span>
              </div>
            </div>

            <button
              onClick={handlePlayOrientation}
              className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wider uppercase transition shadow-sm flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Free Orientation</span>
            </button>
          </div>

        </div>
      </div>

      {/* WhatsApp Community Direct Guidance Info */}
      <div className="p-8 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B5E34]">
            <ShieldCheck className="w-4 h-4 text-[#8B5E34]" />
            <span>Direct WhatsApp Community Integration</span>
          </div>
          <h4 className="font-serif text-xl font-bold text-[#2C2421]">
            How Live Sessions & Daily Links Work
          </h4>
          <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
            Upon completing your enrollment, you will be instantly redirected to the private WhatsApp community. Daily live Zoom session links, practice reminders, and Q&A interactions with Master Gorli Peddi Raju Garu are provided directly in the WhatsApp group.
          </p>
        </div>

        <button
          onClick={handleEnrollLive}
          className="px-6 py-3.5 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-widest uppercase shadow-md transition shrink-0"
        >
          Enroll for ₹1,111
        </button>
      </div>

    </div>
  );
};

