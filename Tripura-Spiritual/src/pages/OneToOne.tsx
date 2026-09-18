import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, Sparkles, Lock, AlertCircle } from 'lucide-react';

export const OneToOne: React.FC = () => {
  const { openPaymentModal, t } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('spiritual');
  const [selectedDuration, setSelectedDuration] = useState<30 | 60>(30);
  const [primaryDate, setPrimaryDate] = useState('2026-10-15');
  const [secondaryDate, setSecondaryDate] = useState('2026-10-18');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [error, setError] = useState('');

  const categories = [
    { id: 'spiritual', label: t.oneToOne.categories.spiritual, desc: "Clarify spiritual philosophy, self-inquiry, and internal obstacles." },
    { id: 'meditation', label: t.oneToOne.categories.meditation, desc: "Personalized pranayama, posture alignment, and deep dhyana guidance." },
    { id: 'personal', label: t.oneToOne.categories.personal, desc: "Applying spiritual wisdom to family, career, and life transitions." },
    { id: 'special', label: t.oneToOne.categories.special, desc: "Energy diagnosis, Reiki healing, and subtle energetic alignment." }
  ];

  const price = selectedDuration === 30 ? 499 : 899;

  // Helper to validate date is not between 1st and 12th
  const isDateLocked = (dateStr: string) => {
    if (!dateStr) return false;
    const day = parseInt(dateStr.split('-')[2], 10);
    return day >= 1 && day <= 12;
  };

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isDateLocked(primaryDate)) {
      setError('Primary date falls between the 1st and 12th (Reserved for Master’s 11-day live immersion). Please select a date from the 13th onwards.');
      return;
    }

    if (isDateLocked(secondaryDate)) {
      setError('Alternative date falls between the 1st and 12th (Reserved for Master’s 11-day live immersion). Please select a date from the 13th onwards.');
      return;
    }

    if (primaryDate === secondaryDate) {
      setError('Please choose two different dates for your primary and alternative availability.');
      return;
    }

    openPaymentModal({
      id: `1on1-${selectedCategory}-${selectedDuration}`,
      name: `1-on-1 Guidance with Master (${selectedDuration} Mins)`,
      price,
      type: '1on1',
      details: `1st Choice: ${primaryDate} | 2nd Choice: ${secondaryDate} at ${preferredTime}`
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn text-[#2C2421]">
      
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-[#EFE9DD] text-[#3B234A] text-xs font-bold uppercase tracking-wider border border-[#D8CFBF]">
          Direct Mentorship with Gorli Peddi Raju Garu
        </span>
        <h1 className="font-serif text-4xl font-bold text-[#2C2421]">
          {t.oneToOne.title}
        </h1>
        <p className="text-stone-600 text-sm">
          {t.oneToOne.subtitle}
        </p>
      </div>

      {/* IMPORTANT CALENDAR LOCK NOTICE BANNER */}
      <div className="p-5 rounded-2xl bg-amber-50 border border-amber-300 flex items-start gap-3.5 text-xs text-amber-950">
        <Lock className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm text-amber-900">
            Monthly Masterclass Schedule Notice (1st – 12th Locked)
          </p>
          <p className="leading-relaxed text-amber-800">
            Master Gorli Peddi Raju Garu conducts the 11-Day Live Immersion from the <strong>1st to the 11th</strong> of every month, with culmination & reviews on the <strong>12th</strong>. Therefore, 1-on-1 slots are open between the <strong>13th and the end of each month</strong>.
          </p>
          <p className="font-semibold text-amber-900 pt-1">
            *Requirement: Please pick at least 2 convenient dates (Primary & Alternative) of your free time.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Category & Duration Selection Form */}
        <form onSubmit={handleBooking} className="lg:col-span-8 glass-panel p-6 sm:p-8 rounded-3xl border border-[#E6E0D2] shadow-xl space-y-6">
          
          {/* Step 1: Category */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B5E34]">
              1. Select Session Subject / Focus
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    selectedCategory === cat.id
                      ? 'border-[#3B234A] bg-[#EFE9DD] text-[#3B234A] font-semibold shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="block text-sm font-serif font-bold text-stone-900 mb-1">{cat.label}</span>
                  <span className="text-xs text-stone-500 block leading-snug">{cat.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Duration */}
          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#8B5E34]">
              2. Choose Session Duration
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedDuration(30)}
                className={`p-4 rounded-2xl border text-center font-bold text-sm transition ${
                  selectedDuration === 30
                    ? 'border-[#3B234A] bg-[#3B234A] text-white shadow-md'
                    : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
                }`}
              >
                <span>30 Minutes</span>
                <span className="block text-xs font-normal mt-1 opacity-90">₹499</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedDuration(60)}
                className={`p-4 rounded-2xl border text-center font-bold text-sm transition ${
                  selectedDuration === 60
                    ? 'border-[#3B234A] bg-[#3B234A] text-white shadow-md'
                    : 'border-stone-200 bg-white text-stone-800 hover:bg-stone-50'
                }`}
              >
                <span>60 Minutes (Intensive)</span>
                <span className="block text-xs font-normal mt-1 opacity-90">₹899</span>
              </button>
            </div>
          </div>

          {/* Step 3: Pick 2 Free Days / Dates (13th to 31st) */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#8B5E34]">
                3. Pick 2 Preferred Dates (13th to 31st)
              </label>
              <span className="text-[11px] text-stone-400 font-medium">Days 1–12 Disabled</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  1st Choice Preferred Date *
                </label>
                <input
                  type="date"
                  value={primaryDate}
                  min="2026-10-13"
                  onChange={(e) => setPrimaryDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none ${
                    isDateLocked(primaryDate)
                      ? 'border-rose-500 bg-rose-50 text-rose-800'
                      : 'border-stone-300 focus:border-[#3B234A]'
                  }`}
                />
                {isDateLocked(primaryDate) && (
                  <span className="text-[10px] text-rose-600 font-bold block mt-1">
                    ⚠️ 1st to 12th locked (Live sessions in progress)
                  </span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  2nd Choice Alternative Date *
                </label>
                <input
                  type="date"
                  value={secondaryDate}
                  min="2026-10-13"
                  onChange={(e) => setSecondaryDate(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm font-semibold outline-none ${
                    isDateLocked(secondaryDate)
                      ? 'border-rose-500 bg-rose-50 text-rose-800'
                      : 'border-stone-300 focus:border-[#3B234A]'
                  }`}
                />
                {isDateLocked(secondaryDate) && (
                  <span className="text-[10px] text-rose-600 font-bold block mt-1">
                    ⚠️ 1st to 12th locked (Live sessions in progress)
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Preferred Time Slot</label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm font-semibold focus:border-[#3B234A] outline-none"
              >
                <option>08:00 AM – 09:00 AM (Morning Stillness)</option>
                <option>10:00 AM – 11:00 AM (Mid-Day Clarity)</option>
                <option>02:00 PM – 03:00 PM (Afternoon)</option>
                <option>06:00 PM – 07:00 PM (Evening)</option>
                <option>08:00 PM – 09:00 PM (Night Quietude)</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 rounded-2xl bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-sm tracking-wider uppercase shadow-lg transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
            <span>Book Consultation (₹{price})</span>
          </button>
        </form>

        {/* Right Info Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-card p-6 rounded-3xl border border-[#E6E0D2] space-y-4">
            <h4 className="font-serif font-bold text-stone-900 text-lg">What to Expect</h4>
            <ul className="space-y-3 text-xs text-stone-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Private 1-on-1 HD Zoom video consultation directly with Master Peddi Raju Garu.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Personalized pranayama and meditation roadmap tailored to your energy.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Confidential environment for personal questions and emotional release.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>WhatsApp confirmation sent within 24 hours of slot booking.</span>
              </li>
            </ul>
          </div>

          <div className="p-5 rounded-2xl bg-[#FAF7F0] border border-[#E6E0D2] text-xs text-stone-700 space-y-2">
            <span className="font-bold text-[#8B5E34] uppercase tracking-wider block">Master's Promise</span>
            <p className="italic">
              "In our 1-on-1 time, I meet you wherever you are on your path. No dogma, no rush — just pure presence and practical spiritual tools for your life."
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};

