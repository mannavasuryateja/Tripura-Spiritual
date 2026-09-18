import React, { useState } from 'react';
import { useApp, TRIPURA_WHATSAPP_COMMUNITY_URL } from '../context/AppContext';
import { Play, Lock, User, Calendar, MessageCircle, Sparkles, Clock, ArrowUpRight } from 'lucide-react';

interface DashboardProps {
  setActiveTab: (tab: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ setActiveTab }) => {
  const { user, openPaymentModal, openVideoModal, openAuthModal, t } = useApp();
  const [activePortalTab, setActivePortalTab] = useState<'recordings' | 'upcoming'>('recordings');

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6 animate-fadeIn text-[#2C2421]">
        <div className="w-16 h-16 rounded-full bg-[#EFE9DD] text-[#3B234A] flex items-center justify-center mx-auto">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#2C2421]">Sign In to Access Your Portal</h2>
        <p className="text-stone-600 text-sm">
          Please log in with your registered 10-digit mobile number to view active session recordings, validity, and WhatsApp live links.
        </p>
        <button
          onClick={openAuthModal}
          className="px-8 py-3.5 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-widest uppercase shadow-md transition"
        >
          Sign In / Quick Demo Login
        </button>
      </div>
    );
  }

  const recordings = [
    { day: 1, title: "Foundations of Hanuman Kriya & Prana Vayu Awakening", duration: "50 mins", desc: "Foundational breath awareness, establishing daily internal stillness, and vital prana." },
    { day: 2, title: "Spinal Energy Purification (Sushumna Nadi Cleansing)", duration: "52 mins", desc: "Cultivating body-mind observation, clearing subconscious tension." },
    { day: 3, title: "Surya & Chandra Nadi Balancing for Vitality", duration: "48 mins", desc: "Harmonizing solar (action) and lunar (calm) energy currents." },
    { day: 4, title: "Mantra Japa & Seed Sound Vibrations", duration: "55 mins", desc: "Using sacred sound frequencies to dissolve subconscious fear and anxiety." },
    { day: 5, title: "Navel Center (Manipura) Activation & Willpower", duration: "50 mins", desc: "Igniting the inner fire of transformation and overcoming emotional lethargy." },
    { day: 6, title: "Heart Center Opening (Anahata Bhakti & Surrender)", duration: "54 mins", desc: "Cultivating detached witness consciousness and unconditional love." },
    { day: 7, title: "Throat & Expression Purification (Vishuddha Kriya)", duration: "49 mins", desc: "Clearing truth blockages and purifying creative sound expression." },
    { day: 8, title: "Third Eye Intuition & Ajna Stillness (Dharana)", duration: "51 mins", desc: "Refining subtle perception, focus, and inner guidance." },
    { day: 9, title: "Self-Inquiry & Witness Consciousness (Sakshi Bhava)", duration: "56 mins", desc: "Deep meditation on 'Who Am I?' and abiding in effortless presence." },
    { day: 10, title: "Integrating Kriya Wisdom into Daily Family & Work Life", duration: "52 mins", desc: "Applying spiritual clarity in work, relationships, and daily challenges." },
    { day: 11, title: "Grand Culmination, Sankalpa & Master's Blessings", duration: "65 mins", desc: "Grand interactive culmination, student sharing, and personal practice roadmap." }
  ];

  const upcomingDays = [
    { day: 1, date: "Oct 1, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 1: Foundations of Hanuman Kriya", status: "Upcoming" },
    { day: 2, date: "Oct 2, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 2: Spinal Energy Purification", status: "Upcoming" },
    { day: 3, date: "Oct 3, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 3: Surya & Chandra Nadi Balancing", status: "Upcoming" },
    { day: 4, date: "Oct 4, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 4: Mantra Japa & Sound Frequency", status: "Upcoming" },
    { day: 5, date: "Oct 5, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 5: Navel Center & Willpower", status: "Upcoming" },
    { day: 6, date: "Oct 6, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 6: Heart Center Opening (Anahata)", status: "Upcoming" },
    { day: 7, date: "Oct 7, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 7: Throat & Sound Purification", status: "Upcoming" },
    { day: 8, date: "Oct 8, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 8: Third Eye Clarity (Ajna)", status: "Upcoming" },
    { day: 9, date: "Oct 9, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 9: Self-Inquiry & Witness Presence", status: "Upcoming" },
    { day: 10, date: "Oct 10, 2026", time: "6:30 AM – 7:30 AM IST", topic: "Day 10: Integration in Modern Life", status: "Upcoming" },
    { day: 11, date: "Oct 11, 2026", time: "6:30 AM – 7:45 AM IST", topic: "Day 11: Grand Live Culmination & Blessing", status: "Upcoming" }
  ];

  const handleJoinWhatsApp = () => {
    window.open(TRIPURA_WHATSAPP_COMMUNITY_URL, '_blank');
  };

  const handleBuyExtension = () => {
    openPaymentModal({
      id: 'hanuman-kriya-recording-extension',
      name: "21-Day Recording Extension (49% Live Seeker Discount)",
      price: 555,
      type: 'recording-extension',
      details: "Exclusive to Live Batch Seekers • 21 Days Extended Access"
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10 animate-fadeIn text-[#2C2421]">
      
      {/* Welcome Banner & Active Enrollment Status */}
      <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-[#E6E0D2] shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E34]">
              {t.dashboard.welcome}
            </span>
            <h1 className="font-serif text-3xl font-bold text-[#2C2421]">
              {user.name}
            </h1>
            <p className="text-xs text-stone-500 font-mono">Mobile: +91 {user.phone}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('profile')}
              className="px-4 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition"
            >
              Account Details
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
                  Active Enrollment
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
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Community</span>
                </button>
                <button
                  onClick={handleBuyExtension}
                  className="px-4 py-2.5 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm"
                  title="Extend recordings for 21 days"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>21-Day Extension (₹555)</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setActiveTab('sessions')}
                className="px-6 py-3 rounded-xl bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs shadow-md transition uppercase tracking-wider"
              >
                Enroll in Masterclass (₹1,111)
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2 PROMINENT CARDS / TABS: RECORDED CLASSES & UPCOMING LIVE CLASSES */}
      <div className="space-y-6">
        
        {/* Navigation Switcher between Card 1 and Card 2 */}
        <div className="flex border-b border-[#E6E0D2]">
          <button
            onClick={() => setActivePortalTab('recordings')}
            className={`px-6 py-3 font-serif text-lg font-bold transition border-b-2 flex items-center gap-2 ${
              activePortalTab === 'recordings'
                ? 'border-[#3B234A] text-[#3B234A]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Play className="w-4 h-4" />
            <span>1. Recorded Classes ({user.subscription.unlockedDays.length}/11)</span>
          </button>

          <button
            onClick={() => setActivePortalTab('upcoming')}
            className={`px-6 py-3 font-serif text-lg font-bold transition border-b-2 flex items-center gap-2 ${
              activePortalTab === 'upcoming'
                ? 'border-[#3B234A] text-[#3B234A]'
                : 'border-transparent text-stone-400 hover:text-stone-700'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>2. Upcoming Live Classes (Daily 6:30 AM)</span>
          </button>
        </div>

        {/* TAB 1: RECORDED CLASSES */}
        {activePortalTab === 'recordings' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* Validity Information & 49% Extension Offer Bar */}
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
                  className="px-4 py-1.5 rounded-lg bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs shadow-xs transition shrink-0 flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Keep for 21 Days (49% Off @ ₹555)</span>
                </button>
              )}
            </div>

            {/* Recordings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recordings.map((rec) => {
                const isUnlocked = user.subscription.unlockedDays.includes(rec.day);

                return (
                  <div
                    key={rec.day}
                    className={`p-5 rounded-2xl border transition-all ${
                      isUnlocked
                        ? 'bg-white border-[#E6E0D2] shadow-xs hover:shadow-md hover:border-[#8B5E34]'
                        : 'bg-stone-50 border-stone-200 opacity-80'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                            isUnlocked ? 'bg-[#EFE9DD] text-[#3B234A]' : 'bg-stone-200 text-stone-600'
                          }`}>
                            Day {rec.day}
                          </span>
                          <span className="text-[11px] text-stone-400 font-mono">{rec.duration}</span>
                        </div>
                        <h4 className="font-serif font-bold text-stone-900 text-base">{rec.title}</h4>
                        <p className="text-xs text-stone-600 leading-snug">{rec.desc}</p>
                      </div>

                      <div className="shrink-0 pt-1">
                        {isUnlocked ? (
                          <button
                            onClick={() => openVideoModal({ day: rec.day, title: rec.title, duration: rec.duration, desc: rec.desc })}
                            className="px-4 py-2 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
                          >
                            <Play className="w-3.5 h-3.5 fill-white" />
                            <span>Watch</span>
                          </button>
                        ) : (
                          <button
                            onClick={() => setActiveTab('sessions')}
                            className="px-3.5 py-2 rounded-xl bg-stone-200 hover:bg-amber-100 text-stone-700 hover:text-amber-900 font-semibold text-xs transition flex items-center gap-1 border border-stone-300"
                            title="Enroll in Masterclass to unlock"
                          >
                            <Lock className="w-3.5 h-3.5 text-amber-700" />
                            <span>Locked</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        )}

        {/* TAB 2: UPCOMING LIVE CLASSES */}
        {activePortalTab === 'upcoming' && (
          <div className="space-y-6 animate-fadeIn">
            
            {/* WhatsApp Community Live Access Card */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white shadow-xl space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-widest text-emerald-200 font-bold block">
                    Direct Zoom Meeting Access
                  </span>
                  <h3 className="font-serif text-2xl font-bold">WhatsApp Live Session Community</h3>
                  <p className="text-xs text-emerald-100 max-w-xl leading-relaxed">
                    Live Zoom links are shared directly inside the WhatsApp community every morning at 6:15 AM (15 minutes prior to session start).
                  </p>
                </div>

                <button
                  onClick={handleJoinWhatsApp}
                  className="px-6 py-3 rounded-full bg-white text-emerald-900 hover:bg-emerald-50 font-bold text-xs tracking-wider uppercase shadow-lg transition flex items-center gap-2 shrink-0"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-700" />
                  <span>Open WhatsApp Group</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Upcoming 11-Day Timetable */}
            <div className="bg-white rounded-3xl border border-[#E6E0D2] shadow-sm p-6 space-y-4">
              <div className="flex justify-between items-center border-b border-[#F0EBE1] pb-3">
                <h4 className="font-serif font-bold text-lg text-[#2C2421]">Hanuman Kriya Batch Timetable (Oct 1 – 11)</h4>
                <span className="text-xs font-mono text-stone-500 font-semibold">11 Live Zoom Sessions</span>
              </div>

              <div className="space-y-2">
                {upcomingDays.map((item) => (
                  <div
                    key={item.day}
                    className="p-3.5 rounded-2xl bg-[#FAF7F0] border border-[#E6E0D2] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-[#EFE9DD] text-[#3B234A] font-bold text-xs flex items-center justify-center shrink-0">
                        D{item.day}
                      </span>
                      <div>
                        <p className="font-bold text-stone-900 text-sm">{item.topic}</p>
                        <p className="text-stone-500">{item.date} • {item.time}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold uppercase tracking-wider">
                        {item.status}
                      </span>
                      <button
                        onClick={handleJoinWhatsApp}
                        className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 font-semibold text-[11px] hover:bg-emerald-100 transition"
                      >
                        Get Zoom Link
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
};

