import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Play, CheckCircle2, Sparkles } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';
import { settingsApi, productsApi } from '../api/client';

export const DemoClass: React.FC = () => {
  const { openVideoModal, openAuthModal, user, openPaymentModal } = useApp();
  const [orientationUrl, setOrientationUrl] = useState<string>('');
  const [livePrice, setLivePrice] = useState<number>(1111);

  useEffect(() => {
    settingsApi.getPublicSettings().then(res => {
      const data = res.data || res;
      if (data?.free_orientation_video_url) {
        setOrientationUrl(data.free_orientation_video_url);
      }
    }).catch(() => {});

    productsApi.getActiveProducts().then(res => {
      const list = res.data || res || [];
      const live = list.find((p: any) => p.slug === 'live-masterclass');
      if (live) setLivePrice(Number(live.price));
    }).catch(() => {});
  }, []);

  const handlePlayFreeOrientation = () => {
    openVideoModal({
      day: 0,
      title: "Orientation Class: Introduction to Inner Silence & Prana",
      duration: "45 mins",
      desc: "Full free orientation class introducing Tripura Spiritual guided meditation, pranayama, and teaching methodology.",
      streamUrl: orientationUrl || undefined
    });
  };

  const handleJoinLive = () => {
    if (!user.isLoggedIn) {
      openAuthModal();
      return;
    }
    openPaymentModal({
      id: 'hanuman-kriya-live',
      name: "Hanuman Kriya: 11-Day Divine Awakening Masterclass",
      price: livePrice,
      type: 'live-session',
      details: "Oct 1 – Oct 11 • Daily 6:30 AM IST • WhatsApp Community Live Link Included"
    });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 text-[#2C2421]">
      
      {/* Header */}
      <ScrollReveal animation="fade-up">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>100% Free for Everyone • No Login Required</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2421]">
            Free Orientation Masterclass
          </h1>
          <p className="text-stone-600 text-base leading-relaxed font-light">
            Experience Master Gorli Peddi Raju Garu's direct teaching style, foundational breath awareness, and guided meditation with complete freedom.
          </p>
        </div>
      </ScrollReveal>

      {/* Main Video Demo Card */}
      <ScrollReveal animation="image-zoom" duration={850}>
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-[#E6E0D2] shadow-2xl space-y-8">
          
          <div className="relative aspect-video bg-stone-950 rounded-2xl overflow-hidden flex items-center justify-center border border-amber-500/30 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-950 via-stone-900 to-orange-950 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-amber-500 to-orange-400 flex items-center justify-center text-4xl shadow-2xl shadow-amber-500/40 mb-4 animate-float">
                🪷
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Introduction to Inner Silence & Prana
              </h3>
              <p className="text-xs text-amber-200 font-mono mt-1">
                Duration: 45 Minutes Full Class • HD 1080p • English & Telugu
              </p>
            </div>

            {/* Action Trigger */}
            <button
              onClick={handlePlayFreeOrientation}
              className="btn-spiritual z-10 px-8 py-4 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-stone-950 font-bold text-base shadow-2xl flex items-center gap-3 cursor-pointer"
            >
              <Play className="w-6 h-6 fill-stone-950" />
              <span>Watch Full Orientation Class (Free)</span>
            </button>
          </div>

          {/* Next Step: Join Hanuman Kriya Batch */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 p-6 sm:p-8 bg-gradient-to-br from-[#FAF7F0] to-[#EFE9DD] rounded-2xl border border-[#D8CFBF]">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-[#8B5E34]">Ready to Begin Your Daily Sadhana?</span>
              <h4 className="font-serif font-bold text-[#2C2421] text-2xl">
                Join the 11-Day Hanuman Kriya Live Batch
              </h4>
              <p className="text-xs text-stone-600 max-w-md">
                Starts Monthly 1st to 11th • Daily 6:30 AM live Zoom practice + WhatsApp community guidance.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="text-right">
                <span className="text-3xl font-bold font-sans text-[#2C2421]">₹{livePrice}</span>
                <span className="text-[10px] text-stone-500 block">11-Day Live Pass</span>
              </div>
              <button
                onClick={handleJoinLive}
                className="btn-spiritual px-6 py-3.5 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-wider uppercase shadow-md cursor-pointer"
              >
                Enroll in Live Batch
              </button>
            </div>
          </div>

        </div>
      </ScrollReveal>

      {/* Orientation Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {[
          { title: "Pranayama Alignment", desc: "Awaken optimal breath capacity and calm your sympathetic nervous system within minutes." },
          { title: "Sakshi Bhava Stillness", desc: "Experience witness consciousness without mental strain or suppression of thoughts." },
          { title: "Live Master Q&A", desc: "Understand the roadmap of the upcoming 11-day masterclass and daily practice routine." }
        ].map((item, idx) => (
          <div key={idx} className="p-6 rounded-2xl bg-white border border-[#E6E0D2] shadow-xs space-y-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <h4 className="font-serif font-bold text-base text-stone-900">{item.title}</h4>
            <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </div>

    </div>
  );
};
