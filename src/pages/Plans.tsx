import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';

export const Plans: React.FC = () => {
  const { openPaymentModal } = useApp();

  const plans: Array<{
    id: string;
    name: string;
    price: number;
    period: string;
    popular: boolean;
    type: 'live-session' | 'recordings-only' | 'recording-extension';
    desc: string;
    features: string[];
  }> = [
    {
      id: 'hanuman-kriya-live',
      name: "Hanuman Kriya 11-Day Live Masterclass",
      price: 1111,
      period: "11 Days Live + Access till Day 13",
      popular: true,
      type: 'live-session',
      desc: "Daily 6:30 AM IST live interactive Zoom immersion + WhatsApp community access.",
      features: [
        "11 Days Live Interactive Zoom Masterclasses",
        "Daily Practice Sheets & WhatsApp Community Access",
        "Recordings Released Next Day 12:00 PM",
        "Recording Access Active until Day 13 11:59 PM"
      ]
    },
    {
      id: 'hanuman-kriya-recordings-only',
      name: "Full 11-Day Recording Pack (Late Joiners)",
      price: 1500,
      period: "21 Days On-Demand Access",
      popular: false,
      type: 'recordings-only',
      desc: "For seekers joining post-session or wishing to practice at their own self-pace.",
      features: [
        "All 11 Days Full High-Definition Recordings",
        "21 Full Days of Unrestricted Video Access",
        "Step-by-Step Guided Kriya Explanations",
        "Spiritual Notes & Meditation Guidance"
      ]
    },
    {
      id: 'hanuman-kriya-recording-extension',
      name: "21-Day Recording Extension (Live Attendees)",
      price: 555,
      period: "21 Days Additional Access (49% OFF)",
      popular: false,
      type: 'recording-extension',
      desc: "Exclusive loyalty upgrade for live batch participants to keep all recordings.",
      features: [
        "Exclusive 49% Discount for Live Batch Seekers",
        "Extends All 11-Day Video Recordings for 21 Days",
        "Deepen and Repeat Daily Kriya Practices",
        "Instant One-Click Activation"
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn text-[#2C2421]">

      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>Transparent Spiritual Pricing</span>
        </span>
        <h1 className="font-serif text-4xl font-bold text-stone-900">Session Offerings & Packages</h1>
        <p className="text-stone-600 text-sm">Choose the right pathway for your spiritual journey with Master Gorli Peddi Raju Garu.</p>
      </div>

      {/* Grid of Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`glass-card rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-all duration-300 relative ${plan.popular
              ? 'border-2 border-amber-500 shadow-xl bg-amber-50/50 transform lg:-translate-y-2'
              : 'border-amber-200 shadow-md hover:shadow-lg'
              }`}
          >
            {plan.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-amber-600 text-white text-[10px] font-bold uppercase tracking-widest shadow-md">
                Most Popular
              </span>
            )}

            <div className="space-y-4">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                {plan.period}
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                {plan.name}
              </h3>
              <p className="text-xs text-stone-500">{plan.desc}</p>

              <div className="pt-2 border-t border-amber-100">
                <span className="text-3xl font-bold text-stone-900 font-sans">₹{plan.price}</span>
                <span className="text-xs text-stone-500 font-normal"> / package</span>
              </div>

              <ul className="space-y-2.5 text-xs text-stone-700 font-medium pt-2">
                {plan.features.map((feat: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => openPaymentModal({ id: plan.id, name: plan.name, price: plan.price, type: plan.type })}
              className={`mt-6 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition shadow-md ${plan.popular
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-amber-600/30'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
            >
              Choose Package
            </button>
          </div>
        ))}
      </div>

      {/* Trust Notice */}
      <div className="p-6 rounded-2xl bg-amber-50/80 border border-amber-200 text-center max-w-xl mx-auto space-y-2 text-xs text-stone-600">
        <p className="font-semibold text-stone-900 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-600" />
          <span>All Packages Include Instant Access & WhatsApp Community Support</span>
        </p>
        <p>Selecting any option will open the secure prototype payment modal where you can test instant UPI QR, Card, or NetBanking flows.</p>
      </div>
    </div>
  );
};

