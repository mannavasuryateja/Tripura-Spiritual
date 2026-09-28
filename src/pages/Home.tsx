import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, CheckCircle2, ArrowRight, Star, BookOpen, Radio, Sparkles, Play, ChevronDown, RefreshCw, AlertCircle } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';
import { ContactSection } from '../components/ContactSection';
import { productsApi, booksApi, settingsApi } from '../api/client';

interface HomeProps {
  setActiveTab: (tab: string) => void;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab }) => {
  const { t, openPaymentModal, openBookDrawer, openBookAudioPlayer, openVideoModal } = useApp();
  const [products, setProducts] = useState<any[]>([]);
  const [books, setBooks] = useState<any[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [booksError, setBooksError] = useState<string | null>(null);
  const [orientationUrl, setOrientationUrl] = useState<string>('');

  const fetchProducts = useCallback(async () => {
    try {
      const res = await productsApi.getActiveProducts();
      setProducts(Array.isArray(res) ? res : res.data || []);
    } catch {
      // Keep fallbacks
    }
  }, []);

  const fetchBooks = useCallback(async () => {
    setIsLoadingBooks(true);
    setBooksError(null);
    try {
      const res = await booksApi.getAllBooks();
      const list = Array.isArray(res) ? res : res.data || [];
      const normalized = list.map((b: any) => ({
        ...b,
        chapters: b.episodes || b.chapters || [],
        episodesCount: b.episodesCount || (b.episodes ? b.episodes.length : 0),
        price: Number(b.price || 199)
      }));
      setBooks(normalized);
    } catch {
      setBooksError(t.bookLibrary?.loadError || 'Unable to connect to the sacred book library.');
    } finally {
      setIsLoadingBooks(false);
    }
  }, [t]);

  const fetchSettings = useCallback(async () => {
    try {
      const res = await settingsApi.getPublicSettings();
      const data = res.data || res;
      if (data?.free_orientation_video_url) {
        setOrientationUrl(data.free_orientation_video_url);
      }
    } catch {
      // Fallback
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchBooks();
    fetchSettings();
  }, [fetchProducts, fetchBooks, fetchSettings]);

  const getPrice = (slug: string, fallback: number) => {
    const prod = products.find(p => p.slug === slug);
    return prod ? Number(prod.price) : fallback;
  };

  const offerings = [
    {
      id: 'hanuman-kriya',
      image: '/card3.jpg',
      tag: t.offeringsGrid.card1.tag,
      category: t.offeringsGrid.card1.category,
      title: t.offeringsGrid.card1.title,
      desc: t.offeringsGrid.card1.desc,
      meta: t.offeringsGrid.card1.meta,
      price: `₹${getPrice('live-masterclass', 1111).toLocaleString('en-IN')}`,
      numPrice: getPrice('live-masterclass', 1111),
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
      price: `₹${getPrice('recordings-only', 1500).toLocaleString('en-IN')}`,
      numPrice: getPrice('recordings-only', 1500),
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
      price: `₹${getPrice('recording-extension', 555).toLocaleString('en-IN')}`,
      numPrice: getPrice('recording-extension', 555),
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

  const handleScrollToOfferings = () => {
    const el = document.getElementById('offerings');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFreePreviewClick = () => {
    if (orientationUrl) {
      openVideoModal({
        day: 0,
        title: t.demoSection.demoClassTitle,
        duration: "45 mins",
        streamUrl: orientationUrl
      });
    } else {
      setActiveTab('demo');
    }
  };

  return (
    <div className="space-y-20 sm:space-y-28 pb-20 bg-[#FAF7F0] text-[#2C2421]">
      
      {/* HERO SECTION — Slow Ken Burns + Mandala slow rotation + Staggered entrance */}
      <section className="relative min-h-[620px] lg:min-h-[720px] flex items-center overflow-hidden bg-stone-900">
        
        {/* Background Landscape Photo with Ken Burns slow zoom */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat motion-safe:animate-kenburns scale-105"
          style={{ backgroundImage: `url('/hero.jpg')` }}
        >
          {/* Subtle Warm Overlay for Contrast & Readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/35"></div>
        </div>

        {/* Right Faint Sacred Geometric Mandala Overlay with very slow rotation */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[520px] h-[520px] md:w-[680px] md:h-[680px] opacity-20 pointer-events-none text-amber-200 motion-safe:animate-[spin_120s_linear_infinite]">
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

        {/* Hero Main Content Box with Staggered Elements */}
        <div className="section-container relative z-10 py-20 w-full">
          <div className="max-w-2xl space-y-6 text-left">
            
            {/* 1. Tagline */}
            <ScrollReveal animation="fade-up" delay={60}>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 text-xs font-semibold tracking-[0.2em] uppercase">
                <Sparkles className="w-3.5 h-3.5 text-[#D1A559]" />
                <span>{t.hero.tagline}</span>
              </div>
            </ScrollReveal>

            {/* 2. Main Headline */}
            <ScrollReveal animation="fade-up" delay={140}>
              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-light text-white leading-[1.1] tracking-tight">
                {t.hero.title}
              </h1>
            </ScrollReveal>

            {/* 3. Description Subtitle */}
            <ScrollReveal animation="fade-up" delay={220}>
              <p className="text-base sm:text-lg text-stone-200 font-light leading-relaxed max-w-xl">
                {t.hero.subtitle}
              </p>
            </ScrollReveal>

            {/* 4. Action Buttons */}
            <ScrollReveal animation="fade-up" delay={300}>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setActiveTab('sessions')}
                  className="btn-spiritual btn-gold px-8 py-4 font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{t.hero.exploreSessions}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className="btn-spiritual px-8 py-4 rounded-full bg-transparent hover:bg-white/10 text-white font-semibold text-xs sm:text-sm tracking-[0.18em] uppercase border border-white/80 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 text-[#D1A559] fill-[#D1A559]" />
                  <span>{t.hero.watchDemo}</span>
                </button>
              </div>
            </ScrollReveal>

          </div>
        </div>

        {/* Hero Scroll Cue */}
        <button
          type="button"
          onClick={handleScrollToOfferings}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 text-stone-300 hover:text-amber-200 flex flex-col items-center gap-1.5 text-xs font-semibold uppercase tracking-widest transition cursor-pointer z-10 group"
          aria-label={t.hero.scrollCue || "Scroll to explore offerings"}
        >
          <span className="opacity-80 group-hover:opacity-100">{t.hero.scrollCue || "Scroll to explore"}</span>
          <ChevronDown className="w-4 h-4 motion-safe:animate-bounce" />
        </button>

      </section>

      {/* 4 CARDS GRID — Masterclasses, Recordings & Free Orientation */}
      <section id="offerings" className="section-container space-y-10 scroll-mt-24">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-up">
          <div className="section-header">
            <span className="section-eyebrow">
              {t.offeringsGrid.sectionTag}
            </span>
            <h2 className="heading-serif text-3xl sm:text-4xl text-[#2C2421]">
              {t.offeringsGrid.sectionTitle}
            </h2>
            <p className="text-stone-600 text-sm sm:text-base font-light">
              {t.offeringsGrid.sectionSubtitle}
            </p>
          </div>
        </ScrollReveal>

        {/* 4 Column Cards Grid (Accessible Native Buttons) */}
        <StaggerContainer staggerDelay={100} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {offerings.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                if (item.action === 'session-details') setActiveTab('session-details');
                else if (item.action === 'demo') setActiveTab('demo');
                else if (item.action === 'buy-recordings') {
                  openPaymentModal({
                    id: 'recordings-pack-11day',
                    name: 'Full 11-Day Hanuman Kriya Recordings Pack',
                    price: item.numPrice,
                    type: 'recordings-only'
                  });
                } else if (item.action === 'buy-extension') {
                  openPaymentModal({
                    id: 'hanuman-kriya-ext-21',
                    name: '21-Day Live Session Recording Extension (49% OFF)',
                    price: item.numPrice,
                    type: 'recording-extension'
                  });
                }
              }}
              className="group bg-white rounded-2xl overflow-hidden border border-[#E6E0D2] shadow-xs hover:shadow-xl hover:-translate-y-2 transition-all duration-500 cursor-pointer flex flex-col justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E34]"
              aria-label={`${item.title} — ${item.price}`}
            >
              <div>
                {/* Image Container with Top Pill Overlay */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.title}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = () => {
                        target.onerror = null;
                        target.style.display = 'none';
                      };
                      target.src = '/card3.jpg';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Top Left Floating Tag Pill */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2C2421] text-[10px] font-bold tracking-wider uppercase shadow-xs border border-[#E6E0D2]">
                    {item.tag}
                  </span>
                </div>

                {/* Content Box */}
                <div className="p-5 sm:p-6 space-y-2">
                  <span className="block text-[10px] font-bold tracking-wider uppercase text-[#8B5E34]">
                    {item.category}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2C2421] group-hover:text-[#8B5E34] transition-colors duration-300 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-700 font-light leading-relaxed line-clamp-3">
                    {item.desc}
                  </p>
                </div>
              </div>

              {/* Bottom Meta & Pricing Footer Line */}
              <div className="px-5 sm:px-6 pb-5 pt-3 border-t border-[#F0EBE1] flex items-center justify-between text-[11px] font-semibold text-stone-700 tracking-wider">
                <span>{item.meta}</span>
                <span className="text-sm font-serif text-[#2C2421] font-bold">{item.price}</span>
              </div>
            </button>
          ))}
        </StaggerContainer>

      </section>

      {/* FEATURED UPCOMING SESSION: HANUMAN KRIYA IMMERSION */}
      <section className="section-container space-y-8">
        <ScrollReveal animation="fade-up">
          <div className="section-header">
            <span className="section-eyebrow">
              {t.upcomingSessions.featuredTag || "Featured Live Immersion"}
            </span>
            <h2 className="heading-serif text-3xl sm:text-4xl text-[#2C2421]">
              {t.upcomingSessions.title}
            </h2>
            <p className="text-stone-600 text-sm">{t.upcomingSessions.subtitle}</p>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="image-zoom" duration={800}>
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
                    <span>{t.upcomingSessions.whatsappCommunity}</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 bg-[#FAF7F0] p-6 rounded-2xl border border-[#E6E0D2] text-center space-y-4">
                <span className="text-xs text-[#7A7067] uppercase tracking-wider font-semibold">{t.upcomingSessions.cardBadge}</span>
                <div className="text-3xl font-serif text-[#2C2421]">
                  ₹{getPrice('live-masterclass', 1111).toLocaleString('en-IN')} <span className="text-xs font-sans text-stone-500">{t.upcomingSessions.per11Days}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('session-details')}
                  className="btn-spiritual btn-primary w-full py-3.5 font-semibold text-xs tracking-[0.15em] uppercase shadow-sm cursor-pointer"
                >
                  {t.upcomingSessions.viewDetails}
                </button>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* SACRED BOOK LIBRARY & PODCAST SPOTLIGHT — Skeleton chips & retry on error */}
      <section className="section-container">
        <ScrollReveal animation="fade-up" duration={800}>
          <div className="bg-radial from-[#3B234A] to-[#201526] text-white rounded-3xl p-8 sm:p-12 shadow-lg relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#D1A559] text-xs font-semibold tracking-widest uppercase">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>{t.bookLibrary.badge}</span>
                </div>

                <h2 className="font-serif text-3xl sm:text-4xl font-light">
                  {t.bookLibrary.title}
                </h2>
                
                <p className="text-stone-300 text-sm sm:text-base font-light leading-relaxed">
                  {t.bookLibrary.subtitle}
                </p>

                {/* Chips / Skeleton / Error State */}
                <div className="pt-2">
                  {isLoadingBooks ? (
                    <div className="flex flex-wrap gap-2 motion-safe:animate-pulse">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="h-8 w-32 bg-white/10 rounded-lg"></div>
                      ))}
                    </div>
                  ) : booksError ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span className="flex-1">{booksError}</span>
                      <button
                        type="button"
                        onClick={fetchBooks}
                        className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>{t.common?.retry || "Retry"}</span>
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {books.slice(0, 3).map((book: any) => (
                        <button
                          key={book.id}
                          type="button"
                          onClick={() => openBookDrawer(book)}
                          className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-xs text-stone-200 transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Radio className="w-3 h-3 text-[#D1A559]" />
                          <span>{book.title}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-5 bg-white/5 backdrop-blur-md rounded-2xl p-6 border border-white/10 text-center space-y-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-[#D1A559]/20 text-[#D1A559] flex items-center justify-center">
                  <Radio className="w-6 h-6 motion-safe:animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-white">
                    {t.bookLibrary.radioPlayerTitle || "Spiritual Radio Player"}
                  </h3>
                  <p className="text-stone-300 text-xs mt-1">
                    {t.bookLibrary.radioPlayerSubtitle || "Audio commentaries and sacred chapters by Master Garu"}
                  </p>
                </div>
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={() => {
                      if (books.length > 0) openBookAudioPlayer(books[0]);
                      else setActiveTab('book-library');
                    }}
                    className="btn-spiritual btn-gold w-full py-3 font-semibold text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-[#201812]" />
                    <span>{books.length > 0 ? `Listen to ${books[0].title}` : (t.bookLibrary.listenDiscourse || 'Listen to Audio Discourse')}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('book-library')}
                    className="btn-spiritual w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-xs tracking-widest uppercase cursor-pointer"
                  >
                    {t.bookLibrary.viewAllBooks || "View All Curated Books"}
                  </button>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* 100% FREE ORIENTATION CLASS PREVIEW — Using DemoClass orientation video source */}
      <section className="section-container">
        <ScrollReveal animation="fade-up">
          <div className="bg-[#2C2421] text-white rounded-3xl p-8 sm:p-12 shadow-md relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-3">
                <span className="px-3 py-1 rounded-full bg-emerald-900/60 text-emerald-300 text-xs font-semibold tracking-widest uppercase border border-emerald-500/30">
                  {t.demoSection.freeBadge}
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
                  type="button"
                  onClick={handleFreePreviewClick}
                  className="btn-spiritual btn-gold w-full py-3.5 font-semibold text-xs tracking-widest uppercase shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-[#201812]" />
                  <span>{t.demoSection.watchPreview}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className="btn-spiritual w-full py-3.5 rounded-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold text-xs tracking-widest uppercase cursor-pointer"
                >
                  {t.demoSection.learnWhatsCovered || "Learn What's Covered"}
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ABOUT TRIPURA SPIRITUAL & MASTER */}
      <section className="section-container">
        <ScrollReveal animation="fade-up">
          <div className="bg-[#FAF7F0] rounded-3xl p-8 sm:p-14 border border-[#E6E0D2] shadow-xs text-center max-w-3xl mx-auto space-y-6">
            <span className="section-eyebrow">
              {t.aboutSection.motto}
            </span>
            <h2 className="heading-serif text-3xl sm:text-4xl text-[#2C2421]">
              {t.aboutSection.title}
            </h2>
            <p className="text-stone-700 text-base sm:text-lg leading-relaxed font-light">
              {t.aboutSection.desc}
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className="inline-flex items-center gap-2 font-semibold text-xs tracking-[0.15em] uppercase text-[#8B5E34] hover:text-[#5C3D1E] group cursor-pointer"
              >
                <span>{t.aboutSection.learnMore}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </button>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* TESTIMONIALS — Small screen scroll-snap slider & 3-column on md+ */}
      <section className="section-container space-y-6">
        <ScrollReveal animation="fade-up">
          <div className="section-header">
            <span className="section-eyebrow">{t.testimonials?.tag || "Seeker Stories"}</span>
            <h2 className="heading-serif text-3xl sm:text-4xl text-[#2C2421]">
              {t.testimonials?.title || "Voices of Peace"}
            </h2>
          </div>
        </ScrollReveal>

        <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 md:grid md:grid-cols-3 md:gap-8 scrollbar-thin">
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
            <div 
              key={idx} 
              className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center bg-white rounded-2xl p-6 border border-[#E6E0D2] shadow-xs space-y-3 hover:shadow-md transition duration-300 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex gap-1 text-[#D1A559]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D1A559]" />
                  ))}
                </div>
                <p className="text-stone-700 text-sm font-light leading-relaxed italic">"{item.text}"</p>
              </div>
              <div className="pt-3 border-t border-[#E6E0D2]">
                <span className="block font-serif text-[#2C2421] text-sm font-normal">{item.name}</span>
                <span className="text-xs text-stone-500">{item.city}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GET IN TOUCH / CONTACT SECTION */}
      <ContactSection />

    </div>
  );
};


