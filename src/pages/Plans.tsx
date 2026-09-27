import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';

export const Plans: React.FC = () => {
  const { openPaymentModal } = useApp();

  const plans: Array<{
    id: string;
    name: string;
    price: number;
    period: string;
    badge?: string;
    popular: boolean;
    type: 'live-session' | 'recordings-only' | 'recording-extension';
    desc: string;
    features: string[];
    btnText: string;
  }> = [
    {
      id: 'hanuman-kriya-live',
      name: "Hanuman Kriya 11-Day Live Masterclass",
      price: 1111,
      period: "1st to 11th Monthly Batch • Daily 6:30 AM IST",
      badge: "Most Popular Live Immersion",
      popular: true,
      type: 'live-session',
      desc: "Daily interactive live Zoom immersion with Master Gorli Peddi Raju Garu + WhatsApp community.",
      features: [
        "11 Days Live Interactive Zoom Sessions (Daily 6:30 AM IST)",
        "Instant Private WhatsApp Group / Community Invitation",
        "HD Recordings Uploaded Daily via Bunny.net Stream",
        "Recordings Valid Till 13th Day of the Month (11:59 PM)",
        "Direct Q&A & Daily Practice Guidance from Master",
        "Eligible for 30-Day Extension @ ₹555 Loyalty Price"
      ],
      btnText: "Enroll in Live Batch (₹1,111)"
    },
    {
      id: 'hanuman-kriya-recordings-only',
      name: "Complete 11-Day Recordings Pack",
      price: 1500,
      period: "30 Days Access from Date of Purchase",
      badge: "For Mid-Month Joiners",
      popular: false,
      type: 'recordings-only',
      desc: "Discovered us mid-month (e.g. on the 5th)? Since Kriya is sequential, master the recordings first at your own pace.",
      features: [
        "All 11 Days Full High-Definition Masterclass Recordings",
        "Full 30-Day Unrestricted Streaming via Bunny.net",
        "Step-by-Step Guided Kriya & Pranayama Explanations",
        "Contemplative Practice Notes & Guided Meditations",
        "Eligible to Attend Coming Month's Live Batch (1st–11th)"
      ],
      btnText: "Get Recordings Pack (₹1,500)"
    },
    {
      id: 'hanuman-kriya-recording-extension',
      name: "30-Day Recording Extension Upgrade",
      price: 555,
      period: "30 Days Extended Access (Loyalty Upgrade)",
      badge: "For Live Batch Seekers",
      popular: false,
      type: 'recording-extension',
      desc: "Completed your ₹1,111 live batch? Extend all 11 daily recordings for 30 days to deepen your daily sadhana.",
      features: [
        "Exclusive Loyalty Pricing for Live Batch Participants",
        "Extends All 11-Day Video Recordings for 30 Full Days",
        "Repeat Daily Kriya, Pranayama & Meditation at Home",
        "Instant One-Click Activation on Existing Account"
      ],
      btnText: "Extend for 30 Days (₹555)"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn text-[#2C2421]">

      {/* Header */}
      <ScrollReveal variant="hero-zoom">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Transparent Spiritual Pathways</span>
          </span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-stone-900">
            Tripura Masterclass & Recording Offerings
          </h1>
          <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed">
            Choose the pathway tailored to your schedule, whether you are starting fresh on the 1st, joining mid-month, or extending your sadhana.
          </p>
        </div>
      </ScrollReveal>

      {/* Grid of Plans */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={100}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`glass-card rounded-3xl p-6 sm:p-8 border flex flex-col justify-between transition-all duration-300 relative ${
              plan.popular
                ? 'border-2 border-[#3B234A] shadow-2xl bg-amber-50/40 transform lg:-translate-y-2'
                : 'border-stone-200 shadow-md hover:shadow-xl bg-white'
            }`}
          >
            {plan.badge && (
              <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-md whitespace-nowrap ${
                plan.popular ? 'bg-[#3B234A] text-white' : 'bg-amber-600 text-white'
              }`}>
                {plan.badge}
              </span>
            )}

            <div className="space-y-5">
              <div className="space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 block">
                  {plan.period}
                </span>
                <h3 className="font-serif text-2xl font-bold text-stone-900">
                  {plan.name}
                </h3>
              </div>

              <div className="flex items-baseline gap-1 py-1 border-y border-stone-100">
                <span className="text-4xl sm:text-5xl font-bold font-sans text-stone-900">
                  ₹{plan.price}
                </span>
                <span className="text-xs text-stone-500 font-medium">/ one-time</span>
              </div>

              <p className="text-xs text-stone-600 leading-relaxed font-light">
                {plan.desc}
              </p>

              <div className="space-y-2.5 pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block">
                  What's Included:
                </span>
                <ul className="space-y-2 text-xs text-stone-700">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="pt-8">
              <button
                onClick={() => openPaymentModal({
                  id: plan.id,
                  name: plan.name,
                  price: plan.price,
                  type: plan.type,
                  details: plan.period
                })}
                className={`w-full py-3.5 rounded-2xl font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 hover:-translate-y-0.5 ${
                  plan.popular
                    ? 'bg-[#3B234A] hover:bg-[#2C1838] text-white'
                    : 'bg-[#8B5E34] hover:bg-[#6e4623] text-white'
                }`}
              >
                <span>{plan.btnText}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </StaggerContainer>

      {/* Safety & Policy Notice */}
      <ScrollReveal variant="fade-up">
        <div className="p-6 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-600">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <strong className="text-stone-900 block font-serif text-sm">Secure Payment & Instant Access</strong>
              <span>Encrypted UPI / Card checkout. Immediate WhatsApp invite and recording access upon completion.</span>
            </div>
          </div>
          <span className="text-[11px] font-mono text-stone-500 shrink-0">
            Tripura Spiritual • Gorli Peddi Raju Garu
          </span>
        </div>
      </ScrollReveal>

    </div>
  );
};
