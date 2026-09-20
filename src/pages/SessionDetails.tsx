import React from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Play, Calendar, CheckCircle2, MessageCircle, ChevronLeft } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';

interface SessionDetailsProps {
  setActiveTab: (tab: string) => void;
}

export const SessionDetails: React.FC<SessionDetailsProps> = ({ setActiveTab }) => {
  const { user, openPaymentModal, openVideoModal, openAuthModal } = useApp();

  const daysSchedule = [
    { day: 1, title: "Foundations of Hanuman Kriya & Prana Vayu Awakening", duration: "50 mins", desc: "Establishing sacred breath rhythms, grounding the nervous system, and invoking pure inner strength." },
    { day: 2, title: "Spinal Energy Purification (Sushumna Nadi Cleansing)", duration: "52 mins", desc: "Direct energetic alignment through vital spinal breathing and release of dormant blockages." },
    { day: 3, title: "Surya & Chandra Nadi Balancing for Vitality", duration: "48 mins", desc: "Harmonizing solar (action) and lunar (calm) currents within the mind and physical body." },
    { day: 4, title: "Mantra Japa & Seed Sound Vibrations", duration: "55 mins", desc: "Harnessing sacred sound frequencies to dissolve subconscious fear and anxiety." },
    { day: 5, title: "Navel Center (Manipura) Activation & Willpower", duration: "50 mins", desc: "Igniting the inner fire of transformation and overcoming emotional lethargy." },
    { day: 6, title: "Heart Center Opening (Anahata Bhakti & Surrender)", duration: "54 mins", desc: "Cultivating boundless courage, devotion, and alignment with universal will." },
    { day: 7, title: "Throat & Expression Purification (Vishuddha Kriya)", duration: "49 mins", desc: "Clearing truth blockages and purifying creative sound expression." },
    { day: 8, title: "Third Eye Intuition & Ajna Stillness (Dharana)", duration: "51 mins", desc: "Concentrated inward focus, dissolving thought turbulence into pure awareness." },
    { day: 9, title: "Self-Inquiry & Witness Consciousness (Sakshi Bhava)", duration: "56 mins", desc: "Deep meditation on 'Who is experiencing this body-mind?' and effortless stillness." },
    { day: 10, title: "Integrating Kriya Wisdom into Daily Family & Work Life", duration: "52 mins", desc: "Maintaining undisturbed mental peace amidst stressful modern situations." },
    { day: 11, title: "Grand Culmination, Sankalpa & Master's Blessings", duration: "65 mins", desc: "Final live interactive blessing session, student sharing, and personal practice roadmap." }
  ];

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
                <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold uppercase tracking-wider">
                  ● Starts Oct 1 (In 5 Days)
                </span>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
                  Live Interactive Zoom Masterclass
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
                Hanuman Kriya: 11-Day Divine Awakening Masterclass
              </h1>

              <p className="text-stone-600 text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700" />
                <span>October 1 – October 11, 2026 • Daily 6:30 AM IST • Taught in English & తెలుగు</span>
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-300 text-center space-y-3 min-w-[260px] shadow-sm">
              <span className="text-xs text-stone-500 uppercase font-bold tracking-wider block">Live Course Pass</span>
              <div className="text-4xl font-bold font-sans text-stone-900">₹1,111</div>
              <button
                onClick={handleEnrollLive}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md transition uppercase tracking-wider hover:-translate-y-0.5 active:translate-y-0"
              >
                Enroll & Join WhatsApp
              </button>
              <span className="text-[10px] text-stone-500 block">Recordings available until Day 13</span>
            </div>
          </div>

          {/* Benefits bullets */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-4 border-t border-amber-200/60 text-xs font-medium text-stone-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Daily 6:30 AM Live Interactive Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Direct WhatsApp Community Access</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Auto Next-Day 12 PM HD Recordings</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>English & Telugu Guided Instruction</span>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* WhatsApp Community Direct Notice */}
      <ScrollReveal variant="fade-up" delay={100}>
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="space-y-0.5">
              <h4 className="font-serif font-bold text-emerald-950 text-base">Private WhatsApp Live Community</h4>
              <p className="text-xs text-emerald-800">
                Live session links, daily practice sheets, and direct questions with Master Peddi Raju Garu are shared inside our WhatsApp group.
              </p>
            </div>
          </div>

          <button
            onClick={handleEnrollLive}
            className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition shrink-0 hover:-translate-y-0.5"
          >
            Join for ₹1,111
          </button>
        </div>
      </ScrollReveal>

      {/* Pricing Scenarios Comparison Box */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6" staggerDelay={120}>
        <div className="p-6 rounded-3xl bg-white border-2 border-amber-500 shadow-md space-y-4 hover:shadow-lg transition-shadow">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
            Live Immersion
          </span>
          <h3 className="font-serif text-xl font-bold text-stone-900">Live 11-Day Pass</h3>
          <p className="text-xs text-stone-600">
            Attend live Zoom sessions daily from Oct 1 to Oct 11. Recordings available next day 12 PM until the 13th day.
          </p>
          <div className="text-2xl font-bold font-sans text-stone-900">₹1,111</div>
          <button
            onClick={handleEnrollLive}
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs transition hover:-translate-y-0.5"
          >
            Enroll in Live Course
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <span className="px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 text-[10px] font-bold uppercase tracking-wider">
            Scenario 1: Live Attendee Discount
          </span>
          <h3 className="font-serif text-xl font-bold text-stone-900">21-Day Recording Extension</h3>
          <p className="text-xs text-stone-600">
            For live attendees who want to keep all 11 recordings for 21 additional days from purchase date at 49% discount.
          </p>
          <div className="text-2xl font-bold font-sans text-stone-900">₹555 <span className="text-xs font-normal text-stone-400 line-through">₹1,111</span></div>
          <button
            onClick={handleBuyExtension}
            className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition hover:-translate-y-0.5"
          >
            Get Extension (₹555)
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-stone-200 shadow-sm space-y-4 hover:shadow-md transition-shadow">
          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-bold uppercase tracking-wider">
            Scenario 2: Post-Day 13 / Late Joiner
          </span>
          <h3 className="font-serif text-xl font-bold text-stone-900">Recordings Only Pack</h3>
          <p className="text-xs text-stone-600">
            For seekers discovering this after completion or on/after 13th day: access all 11 recordings for 21 days from purchase date.
          </p>
          <div className="text-2xl font-bold font-sans text-stone-900">₹1,500</div>
          <button
            onClick={handleBuyRecordingsOnly}
            className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white font-bold text-xs transition hover:-translate-y-0.5"
          >
            Get Recording Pack (₹1,500)
          </button>
        </div>
      </StaggerContainer>

      {/* Daily Schedule & Recording Curriculum */}
      <div className="space-y-6">
        <ScrollReveal variant="fade-up">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="font-serif text-2xl font-bold text-stone-900">11-Day Masterclass Curriculum & Recordings</h2>
              <p className="text-xs text-stone-500">Day 1 to Day 11 Guided Lessons • English & Telugu</p>
            </div>
            {!user.subscription.hasActivePlan && (
              <span className="text-xs font-semibold px-3 py-1 bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                🔒 Enroll to Unlock All Recordings
              </span>
            )}
          </div>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 gap-4" staggerDelay={80}>
          {daysSchedule.map((item) => {
            const isUnlocked = user.subscription.unlockedDays.includes(item.day);

            return (
              <div
                key={item.day}
                className={`p-5 rounded-2xl border transition-all ${
                  isUnlocked
                    ? 'bg-white border-amber-200 shadow-xs hover:border-amber-400 hover:shadow-sm'
                    : 'bg-stone-50/80 border-stone-200 opacity-90'
                }`}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <span className={`w-10 h-10 rounded-full font-serif font-bold text-sm flex items-center justify-center shrink-0 ${
                      isUnlocked ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-stone-200 text-stone-600'
                    }`}>
                      D{item.day}
                    </span>

                    <div className="space-y-1">
                      <h3 className="font-serif font-bold text-stone-900 text-base flex items-center gap-2">
                        <span>{item.title}</span>
                        {!isUnlocked && (
                          <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-700 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                            <Lock className="w-3 h-3" /> Locked
                          </span>
                        )}
                      </h3>
                      <p className="text-xs text-stone-600 max-w-2xl">{item.desc}</p>
                      <span className="text-[11px] text-stone-400 font-mono">Duration: {item.duration} • Available Next Day 12 PM</span>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto text-right">
                    {isUnlocked ? (
                      <button
                        onClick={() => openVideoModal({ day: item.day, title: item.title, duration: item.duration, desc: item.desc })}
                        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 hover:-translate-y-0.5"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Watch Recording</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleEnrollLive}
                        className="w-full sm:w-auto px-4 py-2 rounded-xl bg-stone-200 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-semibold text-xs transition flex items-center justify-center gap-1.5 border border-stone-300 hover:-translate-y-0.5"
                      >
                        <Lock className="w-3.5 h-3.5 text-amber-700" />
                        <span>Enroll to Unlock</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </StaggerContainer>
      </div>

    </div>
  );
};

