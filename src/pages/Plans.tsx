import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';
import { productsApi } from '../api/client';

export const Plans: React.FC = () => {
  const { openPaymentModal, openAuthModal, user } = useApp();
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    productsApi.getActiveProducts().then(res => {
      const list = res.data || res || [];
      setProducts(list);
    }).catch(() => {});
  }, []);

  const getPrice = (slug: string, fallback: number) => {
    const p = products.find(prod => prod.slug === slug);
    return p ? Number(p.price) : fallback;
  };

  const livePrice = getPrice('live-masterclass', 1111);
  const extPrice = getPrice('recording-extension', 555);
  const recPrice = getPrice('recordings-only', 1500);

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
      price: livePrice,
      period: "1st to 11th Monthly Batch • Daily 6:30 AM IST",
      badge: "Most Popular Live Immersion",
      popular: true,
      type: 'live-session',
      desc: "Daily interactive live Zoom immersion with Master Gorli Peddi Raju Garu + WhatsApp community.",
      features: [
        "11 Days Live Interactive Zoom Sessions (Daily 6:30 AM IST)",
        "Instant Private WhatsApp Group / Community Invitation",
        "HD Recordings Uploaded Daily via Private Media Stream",
        "Recordings Valid Till 13th Day of the Month (11:59 PM)",
        "Direct Q&A & Daily Practice Guidance from Master",
        `Eligible for 30-Day Extension @ ₹${extPrice} Loyalty Price`
      ],
      btnText: `Enroll in Live Batch (₹${livePrice})`
    },
    {
      id: 'hanuman-kriya-recordings-only',
      name: "Complete 11-Day Recordings Pack",
      price: recPrice,
      period: "30 Days Access from Date of Purchase",
      badge: "For Mid-Month Joiners",
      popular: false,
      type: 'recordings-only',
      desc: "Discovered us mid-month? Master the recordings first at your own pace before attending live sessions.",
      features: [
        "All 11 Days Full High-Definition Masterclass Recordings",
        "Full 30-Day Unrestricted Streaming via Secure Media Player",
        "Step-by-Step Guided Kriya & Pranayama Explanations",
        "Contemplative Practice Notes & Guided Meditations",
        "Eligible to Attend Coming Month's Live Batch (1st–11th)"
      ],
      btnText: `Get Recordings Pack (₹${recPrice})`
    },
    {
      id: 'hanuman-kriya-recording-extension',
      name: "30-Day Recording Extension Upgrade",
      price: extPrice,
      period: "30 Days Extended Access (Loyalty Upgrade)",
      badge: "For Live Batch Seekers",
      popular: false,
      type: 'recording-extension',
      desc: `Completed your ₹${livePrice} live batch? Extend all 11 daily recordings for 30 days to deepen your daily sadhana.`,
      features: [
        "Exclusive Loyalty Pricing for Live Batch Participants",
        "Extends All 11-Day Video Recordings for 30 Full Days",
        "Repeat Daily Kriya, Pranayama & Meditation at Home",
        "Instant One-Click Activation on Existing Account"
      ],
      btnText: `Extend for 30 Days (₹${extPrice})`
    }
  ];

  const handleSelectPlan = (plan: typeof plans[0]) => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: plan.id,
      name: plan.name,
      price: plan.price,
      type: plan.type,
      details: plan.period
    });
  };

  return (
    <div className="section-container py-10 space-y-12 animate-fadeIn text-[#2C2421]">

      {/* Short Page Header Band */}
      <div className="rounded-3xl bg-gradient-to-r from-[#FAF7F0] via-[#F5EFE6] to-[#FAF7F0] mandala-bg border border-[#E6E0D2] py-10 px-6 sm:px-12 text-center shadow-xs">
        <ScrollReveal animation="fade-up">
          <div className="section-header">
            <span className="section-eyebrow inline-flex items-center justify-center gap-1.5 mx-auto">
              <Sparkles className="w-3.5 h-3.5 text-[#8B5E34]" />
              <span>Transparent Spiritual Pathways</span>
            </span>
            <h1 className="heading-section font-bold text-[#2C2421]">
              Tripura Masterclass & Recording Offerings
            </h1>
            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
              Choose the pathway tailored to your schedule, whether you are starting fresh on the 1st, joining mid-month, or extending your sadhana.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Grid of Plans */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8" staggerDelay={100}>
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-3xl p-8 flex flex-col justify-between transition-all duration-300 relative border ${
              plan.popular
                ? 'bg-gradient-to-b from-[#FAF7F0] via-white to-[#F5EFE6] border-[#3B234A] shadow-xl md:-translate-y-2'
                : 'bg-white border-[#E6E0D2] shadow-sm hover:shadow-md'
            }`}
          >
            {plan.badge && (
              <span className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                plan.popular
                  ? 'bg-[#3B234A] text-white shadow-sm'
                  : 'bg-[#EFE9DD] text-[#3B234A] border border-[#D8CFBF]'
              }`}>
                {plan.badge}
              </span>
            )}

            <div className="space-y-6">
              <div className="space-y-2 pt-2">
                <h3 className="font-serif text-2xl font-bold text-[#2C2421]">{plan.name}</h3>
                <p className="text-xs text-stone-700 font-mono font-medium">{plan.period}</p>
                <p className="text-xs text-stone-700 pt-1 leading-relaxed font-light">{plan.desc}</p>
              </div>

              <div className="flex items-baseline gap-2 pt-2 border-t border-[#F2ECE1]">
                <span className="font-serif font-bold text-4xl text-[#2C2421]">₹{plan.price}</span>
                <span className="text-xs text-stone-700 uppercase tracking-wider font-semibold">Taxes Included</span>
              </div>

              {/* Feature List */}
              <div className="space-y-2.5 pt-2 border-t border-[#F2ECE1]">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E34] block">Included Features</span>
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs text-stone-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => handleSelectPlan(plan)}
              className={`btn-spiritual w-full mt-8 py-3.5 rounded-full font-bold text-xs tracking-wider uppercase transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
                plan.popular
                  ? 'bg-[#3B234A] hover:bg-[#2C1838] text-white'
                  : 'bg-[#8B5E34] hover:bg-[#6e4623] text-white'
              }`}
            >
              <span>{plan.btnText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </StaggerContainer>

      {/* Trust banner */}
      <ScrollReveal animation="fade-up">
        <div className="p-8 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#EFE9DD] text-[#8B5E34] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-lg font-bold text-[#2C2421]">Uncompromised Spiritual Value</h4>
              <p className="text-xs text-stone-600">All masterclasses are broadcast live and saved directly in your personal student sanctuary.</p>
            </div>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
