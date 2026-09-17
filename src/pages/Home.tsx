import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, CheckCircle2, ArrowRight, Star, BookOpen, Radio, Sparkles, Play } from 'lucide-react';
import { SACRED_BOOKS } from '../data/bookLibraryData';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const { t, openPaymentModal, openBookDrawer, openBookAudioPlayer, openVideoModal } = useApp();

  const offerings = [
    {
      id: 'hanuman-kriya',
      image: '/card3.jpg',
      tag: t.offeringsGrid.card1.tag,
      category: t.offeringsGrid.card1.category,
      title: t.offeringsGrid.card1.title,
      desc: t.offeringsGrid.card1.desc,
      meta: t.offeringsGrid.card1.meta,
      price: t.offeringsGrid.card1.price,
      numPrice: 1111,
      action: 'session-details'
    },
    {
      id: 'recording-pack',
      image: '/card2.jpg',
      tag: t.offeringsGrid.card2.tag,
      category: t.offeringsGrid.card2.category,
      title: t.offeringsGrid.card2.title,
      desc: t.offeringsGrid.card2.desc,
      meta: t.offeringsGrid.card2.meta,
      price: t.offeringsGrid.card2.price,
      numPrice: 1500,
      action: 'buy-recordings'
    },
    {
      id: 'recording-extension',
      image: '/hero.jpg',
      tag: t.offeringsGrid.card3.tag,
      category: t.offeringsGrid.card3.category,
      title: t.offeringsGrid.card3.title,
      desc: t.offeringsGrid.card3.desc,
      meta: t.offeringsGrid.card3.meta,
      price: t.offeringsGrid.card3.price,
      numPrice: 555,
      action: 'buy-extension'
    },
    {
      id: 'free-orientation',
      image: '/card4.jpg',
      tag: t.offeringsGrid.card4.tag,
      category: t.offeringsGrid.card4.category,
      title: t.offeringsGrid.card4.title,
      desc: t.offeringsGrid.card4.desc,
      meta: t.offeringsGrid.card4.meta,
      price: t.offeringsGrid.card4.price,
      numPrice: 0,
      action: 'demo'
    }
  ];

  return (
    <div className="space-y-24 pb-20 bg-[#FAF7F0] text-[#2C2421]">
      
      {/* HERO SECTION — Matching reference screenshot */}
      <section className="relative min-h-[600px] lg:min-h-[680px] flex items-center overflow-hidden bg-stone-900">
        
        {/* Background Landscape Photo */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-scale duration-1000 scale-105"
          style={{ backgroundImage: `url('/hero.jpg')` }}
        >
          {/* Subtle Warm Overlay for Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/35"></div>
        </div>

        {/* Right Faint Sacred Geometric Mandala Overlay */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] md:w-[650px] md:h-[650px] opacity-25 pointer-events-none text-amber-200">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" className="w-full h-full">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="70" />
            <circle cx="100" cy="100" r="50" />
            <circle cx="100" cy="100" r="30" />
            <path d="M100 10 L100 190 M10 100 L190 100" />
            <path d="M36 36 L164 164 M36 164 L164 36" />
            <ellipse cx="100" cy="100" rx="90" ry="40" />
            <ellipse cx="100" cy="100" rx="40" ry="90" />
          </svg>
        </div>

        {/* Hero Main Content Box */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 py-20">
          <div className="max-w-2xl space-y-6 text-left">
            
            {/* Tagline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-semibold tracking-[0.2em] uppercase">
              <Sparkles className="w-3 h-3 text-[#D1A559]" />
              <span>{t.hero.tagline}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-stone-200 font-light leading-relaxed max-w-xl">
              {t.hero.subtitle}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <button
                onClick={() => setActiveTab('sessions')}
                className="px-8 py-4 rounded-full bg-[#D1A559] hover:bg-[#C29548] text-[#201812] font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase shadow-lg transition duration-300 transform hover:scale-102 flex items-center justify-center gap-2"
              >
                <span>{t.hero.exploreSessions}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('demo')}
                className="px-8 py-4 rounded-full bg-transparent hover:bg-white/10 text-white font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase border border-white/80 transition duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 text-[#D1A559] fill-[#D1A559]" />
                <span>{t.hero.watchDemo}</span>
              </button>
            </div>

          </div>
        </div>

      </section>

      {/* 4 CARDS GRID — Masterclasses, Recordings & Free Orientation */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-semibold tracking-[0.25em] uppercase text-[#8B5E34]">
            {t.offeringsGrid.sectionTag}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C2421]">
            {t.offeringsGrid.sectionTitle}
          </h2>
          <p className="text-stone-600 text-sm sm:text-base font-light">
            {t.offeringsGrid.sectionSubtitle}
          </p>
        </div>

        {/* 4 Column Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {offerings.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (item.action === 'session-details') setActiveTab('session-details');
                else if (item.action === 'demo') setActiveTab('demo');
                else if (item.action === 'buy-recordings') {
                  openPaymentModal({
                    id: 'recordings-pack-11day',
                    name: 'Full 11-Day Hanuman Kriya Recordings Pack',
                    price: 1500,
                    type: 'recordings-only'
                  });
                } else if (item.action === 'buy-extension') {
                  openPaymentModal({
                    id: 'hanuman-kriya-ext-21',
                    name: '21-Day Live Session Recording Extension (49% OFF)',
                    price: 555,
                    type: 'recording-extension'
                  });
                }
              }}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E6E0D2] shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Image Container with Top Pill Overlay */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />

                  {/* Top Left Floating Tag Pill */}
                  <span className="absolute top-4 left-4 px-3.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#2C2421] text-[10px] font-semibold tracking-widest uppercase shadow-xs">
                    {item.tag}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-6 space-y-2">
                  <span className="block text-[10px] font-semibold tracking-[0.2em] uppercase text-[#8B5E34]">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-xl font-normal text-[#2C2421] group-hover:text-[#8B5E34] transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Meta & Pricing Footer Line */}
              <div className="px-6 pb-6 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] font-semibold text-[#7A7067] tracking-wider uppercase">
                <span>{item.meta}</span>
                <span className="text-sm font-serif text-[#2C2421] font-bold">{item.price}</span>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* FEATURED UPCOMING SESSION: HANUMAN KRIYA IMMERSION */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            Featured Live Immersion
          </span>
          <h2 className="font-serif text-3xl font-normal text-[#2C2421]">
            {t.upcomingSessions.title}
          </h2>
          <p className="text-stone-600 text-sm">{t.upcomingSessions.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E6E0D2] shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <span className="inline-block px-3.5 py-1 rounded-full bg-[#F3EDE0] text-[#8B5E34] text-xs font-semibold tracking-wider uppercase">
                {t.upcomingSessions.statusLive}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#2C2421]">
                {t.upcomingSessions.session11Title}
              </h3>
              <p className="text-[#8B5E34] font-medium text-sm flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{t.upcomingSessions.dates}</span>
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-stone-700 text-sm font-light">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t.upcomingSessions.liveGuidance}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t.upcomingSessions.recordingsIncluded}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{t.upcomingSessions.languages}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>WhatsApp Live Community Access</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 bg-[#FAF7F0] p-6 rounded-2xl border border-[#E6E0D2] text-center space-y-4">
              <span className="text-xs text-[#7A7067] uppercase tracking-wider font-semibold">11-Day Live Masterclass</span>
              <div className="text-3xl font-serif text-[#2C2421]">
                ₹1,111 <span className="text-xs font-sans text-stone-500">/ 11 Days</span>
              </div>
              <button
                onClick={() => setActiveTab('session-details')}
                className="w-full py-3.5 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-semibold text-xs tracking-[0.15em] uppercase shadow-sm transition duration-300"
              >
                {t.upcomingSessions.viewDetails}
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* SACRED BOOK LIBRARY & PODCAST SPOTLIGHT */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="bg-radial from-[#3B234A] to-[#201526] text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D1A559] text-xs font-semibold tracking-widest uppercase">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Sacred Discourses & Library</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl font-light">
                {t.bookLibrary.title}
              </h2>
              
              <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                {t.bookLibrary.subtitle}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {SACRED_BOOKS.slice(0, 3).map((book) => (
                  <button
                    key={book.id}
                    onClick={() => openBookDrawer(book)}
                    className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-stone-200 transition flex items-center gap-1.5"
                  >
                    <Radio className="w-3 h-3 text-[#D1A559]" />
                    <span>{book.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#D1A559]/20 text-[#D1A559] flex items-center justify-center">
                <Radio className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h3 className="font-serif text-xl text-white">Spiritual Radio Player</h3>
                <p className="text-stone-300 text-xs mt-1">Audio commentaries and sacred chapters by Master Garu</p>
              </div>
              <div className="flex flex-col gap-2.5">
                <button
                  onClick={() => openBookAudioPlayer(SACRED_BOOKS[0])}
                  className="w-full py-3 rounded-full bg-[#D1A559] hover:bg-[#C29548] text-[#201812] font-semibold text-xs tracking-widest uppercase shadow-md transition flex items-center justify-center gap-2"
                >
                  <Play className="w-3.5 h-3.5 fill-[#201812]" />
                  <span>Listen to Tripura Rahasya</span>
                </button>
                <button
                  onClick={() => setActiveTab('book-library')}
                  className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs tracking-widest uppercase transition"
                >
                  View All Curated Books
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 100% FREE ORIENTATION CLASS PREVIEW */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="bg-[#2C2421] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-8 space-y-3">
              <span className="px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-semibold tracking-widest uppercase border border-emerald-500/30">
                100% Free • Open to All
              </span>
              <h3 className="font-serif text-3xl font-light">{t.demoSection.demoClassTitle}</h3>
              <p className="text-stone-200 text-sm font-light leading-relaxed">{t.demoSection.subtitle}</p>
              <div className="flex items-center gap-4 text-xs text-amber-200 font-mono pt-1">
                <span>⏱ {t.demoSection.duration}</span>
                <span>•</span>
                <span className="text-emerald-400 font-semibold">{t.demoSection.price}</span>
              </div>
            </div>
            <div className="md:col-span-4 flex flex-col gap-3">
              <button
                onClick={() => openVideoModal({
                  day: 0,
                  title: t.demoSection.demoClassTitle,
                  duration: "45 mins",
                  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                })}
                className="w-full py-3.5 rounded-full bg-[#D1A559] hover:bg-[#C29548] text-[#201812] font-semibold text-xs tracking-widest uppercase shadow-md transition duration-300 flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-[#201812]" />
                <span>{t.demoSection.watchPreview}</span>
              </button>
              <button
                onClick={() => setActiveTab('demo')}
                className="w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs tracking-widest uppercase transition duration-300"
              >
                Learn What's Covered
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT TRIPURA SPIRITUAL & MASTER */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="bg-[#FAF7F0] rounded-3xl p-8 sm:p-14 border border-[#E6E0D2] shadow-xs text-center max-w-3xl mx-auto space-y-6">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">
            {t.aboutSection.motto}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2C2421]">
            {t.aboutSection.title}
          </h2>
          <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-light">
            {t.aboutSection.desc}
          </p>
          <div className="pt-2">
            <button
              onClick={() => setActiveTab('about')}
              className="inline-flex items-center gap-2 font-semibold text-xs tracking-[0.15em] uppercase text-[#8B5E34] hover:text-[#5C3D1E] group"
            >
              <span>{t.aboutSection.learnMore}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </button>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 sm:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8B5E34]">Seeker Stories</span>
          <h2 className="font-serif text-3xl font-normal text-[#2C2421]">Voices of Peace</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sowmya R.",
              city: "Hyderabad",
              text: "The sessions brought deep calmness to my daily routine. The simple Telugu audio instructions made it very comfortable to follow."
            },
            {
              name: "Rajesh Varma",
              city: "Bengaluru",
              text: "Very clear and simple website. I can easily watch the daily video recordings at my own pace after work."
            },
            {
              name: "Priyanka N.",
              city: "Visakhapatnam",
              text: "Wonderful, peaceful platform. The 1-on-1 session helped me resolve many personal questions with real guidance."
            }
          ].map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-[#E6E0D2] shadow-xs space-y-3 hover:shadow-md transition duration-300">
              <div className="flex gap-1 text-[#D1A559]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-[#D1A559]" />
                ))}
              </div>
              <p className="text-stone-700 text-sm font-light leading-relaxed italic">"{item.text}"</p>
              <div className="pt-2 border-t border-[#E6E0D2]">
                <span className="block font-serif text-[#2C2421] text-sm font-normal">{item.name}</span>
                <span className="text-xs text-stone-500">{item.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
