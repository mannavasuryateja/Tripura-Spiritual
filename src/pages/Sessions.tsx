import React from 'react';
import { useApp } from '../context/AppContext';
import { Play, Sparkles, CheckCircle2, Calendar, MessageCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';

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
      name: "Hanuman Kriya: 11-Day Live Masterclass (1st–11th Monthly Batch)",
      price: 1111,
      type: 'live-session',
      details: "1st–11th Monthly Batch • Daily 6:30 AM IST • Recordings Valid Till 13th • WhatsApp Community Link"
    });
  };

  const handleBuyRecordingsOnly = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: 'hanuman-kriya-recordings-only',
      name: "Hanuman Kriya: Full 11-Day Masterclass Recordings Pack",
      price: 1500,
      type: 'recordings-only',
      details: "Complete 11-Day Video Recordings via Bunny.net • 30 Days Access from Purchase Date"
    });
  };

  const handleBuyExtension = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: 'hanuman-kriya-recording-extension',
      name: "30-Day Recording Extension (Live Seeker Loyalty Upgrade)",
      price: 555,
      type: 'recording-extension',
      details: "Exclusive to Live Batch Seekers • 30 Days Extended Recording Access"
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 text-[#2C2421]">
      
      {/* Header */}
      <ScrollReveal variant="hero-zoom">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8B5E34]">
            Live Immersions & Masterclasses
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2421]">
            {t.nav.sessions}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            Structured monthly 1st–11th spiritual immersions, flexible 30-day recording packages, and private community guidance led directly by <strong>Master Gorli Peddi Raju Garu</strong>.
          </p>
        </div>
      </ScrollReveal>

      {/* FEATURED BANNER: HANUMAN KRIYA (MONTHLY 1ST TO 11TH BATCH) */}
      <ScrollReveal variant="hero-zoom" duration={850}>
        <div className="bg-gradient-to-br from-[#3B234A] via-[#2A1836] to-[#1C0F24] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          {/* Background Aura */}
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-3.5 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
                  Monthly Live Batch • 1st to 11th
                </span>
                <span className="px-3.5 py-1 rounded-full bg-white/10 text-amber-200 text-xs font-mono">
                  Daily 6:30 AM – 7:30 AM IST
                </span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-white leading-tight">
                Hanuman Kriya: 11-Day Divine Awakening Masterclass
              </h2>

              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                Awaken subtle energy, mental resilience, and pure consciousness through sacred movement, pranayama, and mantra frequencies. Live classes run from the <strong>1st to 11th of every month</strong>. Daily recordings uploaded to the portal via Bunny.net Stream and valid until the <strong>13th day</strong>.
              </p>

              {/* Features List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs font-light text-stone-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>11 Days Live Interactive Zoom Masterclasses</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Daily HD Recordings via Bunny.net (Active till 13th Day)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Instant Private WhatsApp Community Access</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>30-Day Recording Extension for Live Seekers @ ₹555</span>
                </div>
              </div>
            </div>

            {/* Pricing & Enrollment Card */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-white/20 text-center space-y-4">
              <span className="text-[11px] uppercase tracking-widest text-amber-300 font-bold block">
                11-Day Live Batch Pass
              </span>
              
              <div className="space-y-1">
                <div className="text-4xl sm:text-5xl font-bold font-sans text-white">
                  ₹1,111
                </div>
                <p className="text-xs text-stone-300">1st–11th Live Classes + WhatsApp Community</p>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  onClick={handleEnrollLive}
                  className="btn-spiritual w-full py-4 rounded-full bg-[#D1A559] hover:bg-[#C29548] text-[#201812] font-bold text-xs tracking-widest uppercase shadow-xl flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Enroll for ₹1,111 & Join WhatsApp</span>
                </button>

                <button
                  onClick={() => setActiveTab('session-details')}
                  className="btn-spiritual w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-xs tracking-wider uppercase border border-white/30"
                >
                  View 11-Day Curriculum
                </button>
              </div>

              <p className="text-[10px] text-stone-300 italic pt-1">
                Recordings valid till the 13th day. Extend anytime for 30 days @ ₹555.
              </p>
            </div>

          </div>
        </div>
      </ScrollReveal>

      {/* 4 SCENARIOS GRID BASED ON SEEKER TIMING & NEEDS */}
      <div className="space-y-6">
        <ScrollReveal variant="fade-up">
          <div className="text-center space-y-1">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2C2421]">
              Which Pathway Suits You Best?
            </h3>
            <p className="text-xs text-stone-500">Structured pathways designed for both scheduled live seekers and mid-month self-paced learners</p>
          </div>
        </ScrollReveal>

        <StaggerContainer staggerDelay={120} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card 1: Scenario 1 - 11-Day Live Masterclass (1st to 11th) */}
          <div className="bg-white rounded-3xl p-6 border-2 border-[#3B234A] shadow-lg flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-[#3B234A] text-white text-[10px] font-bold uppercase tracking-wider">
              1st – 11th Monthly Batch
            </span>

            <div className="space-y-3 pt-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E34] block">
                Scenario 1: Live Batch
              </span>
              <h4 className="font-serif text-xl font-bold text-[#2C2421]">
                Hanuman Kriya Live Batch
              </h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Join live Zoom sessions daily from 1st to 11th (6:30 AM IST). WhatsApp community link provided immediately. Daily recordings valid till 13th day.
              </p>

              <div className="pt-2 border-t border-[#F0EBE1]">
                <div className="text-2xl font-bold text-[#2C2421] font-sans">₹1,111</div>
                <span className="text-[10px] text-emerald-700 font-semibold">Includes WhatsApp Community + Live Zoom</span>
              </div>
            </div>

            <button
              onClick={handleEnrollLive}
              className="btn-spiritual w-full py-3 rounded-xl bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-wider uppercase shadow-sm flex items-center justify-center gap-1.5"
            >
              <span>Enroll for Live (₹1,111)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Scenario 1 Extension - 30-Day Recording Extension for Live Attendees */}
          <div className="bg-white rounded-3xl p-6 border border-[#E6E0D2] shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold uppercase tracking-widest text-amber-700">
                  Live Seeker Extension
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Loyalty Rate
                </span>
              </div>

              <h4 className="font-serif text-xl font-bold text-[#2C2421]">
                30-Day Recording Extension
              </h4>
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Completed or attended your ₹1,111 live batch? Retain all 11 daily recordings for <strong>30 full days from date of purchase</strong> to deepen your sadhana.
              </p>

              <div className="pt-2 border-t border-[#F0EBE1]">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#2C2421] font-sans">₹555</span>
                  <span className="text-xs text-stone-400 line-through">₹1,111</span>
                </div>
                <span className="text-[10px] text-stone-500 font-medium">Valid 30 Days from Purchase Date</span>
              </div>
            </div>

            <button
              onClick={handleBuyExtension}
              className="btn-spiritual w-full py-3 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs tracking-wider uppercase shadow-xs"
            >
              Extend 30 Days (₹555)
            </button>
          </div>

          {/* Card 3: Scenario 2 - Mid-Month Joiner (₹1,500 Full Recordings Pack) */}
          <div className="bg-amber-50/70 rounded-3xl p-6 border-2 border-amber-400 shadow-md hover:shadow-lg transition flex flex-col justify-between space-y-6 relative">
            <span className="absolute -top-3 left-6 px-3 py-0.5 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider">
              Discovered Mid-Month?
            </span>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-1.5 text-amber-800 text-[10px] font-bold uppercase tracking-widest">
                <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Scenario 2: Mid-Month Joiner</span>
              </div>

              <h4 className="font-serif text-xl font-bold text-[#2C2421]">
                Full 11-Day Recordings Pack
              </h4>
              
              <p className="text-xs text-stone-600 font-light leading-relaxed">
                Found us mid-month (e.g. on the 5th)? Since Hanuman Kriya is sequential, you cannot join midway live. Get the <strong>complete 11-day recordings pack for 30 days</strong>, then attend the coming month live!
              </p>

              <div className="pt-2 border-t border-amber-200">
                <div className="text-2xl font-bold text-[#2C2421] font-sans">₹1,500</div>
                <span className="text-[10px] text-amber-900 font-semibold">Valid 30 Days from Date of Purchase</span>
              </div>
            </div>

            <button
              onClick={handleBuyRecordingsOnly}
              className="btn-spiritual w-full py-3 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs tracking-wider uppercase shadow-sm"
            >
              Get Recordings Pack (₹1,500)
            </button>
          </div>

          {/* Card 4: Free Orientation Class */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl p-6 border border-emerald-200 shadow-xs hover:shadow-md transition flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-200 text-emerald-900 text-[10px] font-bold uppercase tracking-wider inline-block">
                Zero Cost • No Login
              </span>
              <h4 className="font-serif text-xl font-bold text-emerald-950">
                Free Orientation Class
              </h4>
              <p className="text-xs text-emerald-800 font-light leading-relaxed">
                Experience Master Peddi Raju Garu's guided meditation, breath awareness, and teaching style at zero cost before enrolling.
              </p>

              <div className="pt-2 border-t border-emerald-200">
                <div className="text-2xl font-bold text-emerald-900 font-sans">FREE</div>
                <span className="text-[10px] text-emerald-700 font-semibold">45 Mins Full Video Preview</span>
              </div>
            </div>

            <button
              onClick={handlePlayOrientation}
              className="btn-spiritual w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs tracking-wider uppercase shadow-sm flex items-center justify-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Free Orientation</span>
            </button>
          </div>

        </StaggerContainer>
      </div>

      {/* MID-MONTH JOINER ADVISORY BANNER */}
      <ScrollReveal variant="fade-up">
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#3B234A] to-[#251530] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Calendar className="w-4 h-4 text-amber-300" />
              <span>Mid-Month Discovery Policy</span>
            </div>
            <h4 className="font-serif text-xl sm:text-2xl font-bold">
              Joined After the 1st of the Month?
            </h4>
            <p className="text-xs text-stone-300 max-w-2xl leading-relaxed">
              Hanuman Kriya techniques build progressively from Day 1 to Day 11. To ensure your spiritual safety and proper foundational understanding, mid-month arrivals can access the complete 11-day recordings pack (₹1,500 with 30-day access). After completing the recordings, you are eligible to join the next live batch on the 1st of the upcoming month!
            </p>
          </div>

          <button
            onClick={handleBuyRecordingsOnly}
            className="btn-spiritual px-6 py-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs tracking-widest uppercase shadow-lg shrink-0"
          >
            Get ₹1,500 Recordings Pack
          </button>
        </div>
      </ScrollReveal>

      {/* WhatsApp Community Direct Guidance Info */}
      <ScrollReveal variant="fade-up">
        <div className="p-8 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#8B5E34]">
              <MessageCircle className="w-4 h-4 text-[#8B5E34]" />
              <span>Direct WhatsApp Community Integration</span>
            </div>
            <h4 className="font-serif text-xl font-bold text-[#2C2421]">
              How Live Sessions & Daily Links Work
            </h4>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              Upon completing your ₹1,111 enrollment, you will be instantly provided with your private WhatsApp community invitation. Daily live Zoom links are shared every morning at 6:15 AM (15 minutes prior to 6:30 AM start). Daily session recordings are uploaded to the website via Bunny.net Stream CDN by 12:00 PM next day and valid till the 13th day.
            </p>
          </div>

          <button
            onClick={handleEnrollLive}
            className="btn-spiritual px-6 py-3.5 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-widest uppercase shadow-md shrink-0"
          >
            Enroll for ₹1,111
          </button>
        </div>
      </ScrollReveal>

    </div>
  );
};
