import React from 'react';
import { useApp } from '../context/AppContext';
import { SPIRITUAL_BOOKS } from '../data/bookLibraryData';
import { BookOpen, Play, Headphones, Sparkles, CheckCircle2, ShieldCheck } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';

export const BookLibrary: React.FC = () => {
  const { openBookAudioPlayer, unlockedBooks, openPaymentModal } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fadeIn text-[#2C2421]">
      
      {/* Hero Header */}
      <ScrollReveal variant="hero-zoom">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9DD] text-[#3B234A] text-xs font-bold uppercase tracking-widest border border-[#D8CFBF]">
            <Headphones className="w-3.5 h-3.5 text-[#8B5E34]" />
            <span>Master's Sacred Audio Discourses</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2421]">
            Spiritual Book Library & Podcasts
          </h1>
          <p className="text-base text-stone-600 leading-relaxed font-light">
            Immerse yourself in authentic chapter-by-chapter audio commentaries by <strong>Gorli Peddi Raju Garu</strong> on the world's most profound non-dual and yogic texts.
          </p>
        </div>
      </ScrollReveal>

      {/* Master's Voice Quotation Banner */}
      <ScrollReveal variant="fade-up" delay={100}>
        <div className="p-8 sm:p-10 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] shadow-sm max-w-5xl mx-auto space-y-4 text-center">
          <span className="text-xs font-bold tracking-widest uppercase text-[#8B5E34]">Radio & One-Sided Audio Guidance</span>
          <blockquote className="font-serif text-lg sm:text-xl text-[#2C2421] italic max-w-3xl mx-auto leading-relaxed">
            "These books are not dry intellectual theories. When listened to with a silent heart, their sound vibrations dismantle decades of mental conditioning and anchor you directly into the eternal Self."
          </blockquote>
          <p className="text-xs font-bold tracking-wider text-[#3B234A] uppercase">— Gorli Peddi Raju Garu</p>
        </div>
      </ScrollReveal>

      {/* Book Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={100}>
        {SPIRITUAL_BOOKS.map((book) => {
          const isUnlocked = unlockedBooks.includes(book.id);

          return (
            <div
              key={book.id}
              className="bg-white rounded-3xl overflow-hidden border border-[#E6E0D2] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Book Cover Banner */}
                <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-5">
                    <span className="self-start px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#2C2421] text-[10px] font-bold uppercase tracking-wider">
                      {book.tag}
                    </span>

                    <div className="text-white space-y-1">
                      <span className="text-[10px] font-mono text-amber-300">🎙 {book.duration} • {book.episodesCount} Chapters</span>
                      <h3 className="font-serif text-xl font-bold">{book.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 space-y-4">
                  {book.teluguTitle && (
                    <span className="text-xs font-bold text-[#8B5E34] block">{book.teluguTitle}</span>
                  )}
                  <p className="text-xs text-stone-500">Original Author: {book.author}</p>
                  
                  <p className="text-xs text-stone-600 font-light leading-relaxed line-clamp-3">
                    {book.synopsis}
                  </p>

                  <div className="p-3 bg-[#FAF7F0] rounded-2xl border border-[#E6E0D2] text-[11px] text-stone-700 italic">
                    "{book.masterQuote}"
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-6 pt-0 space-y-3">
                <div className="flex justify-between items-center text-xs border-t border-[#F0EBE1] pt-4 font-semibold">
                  <span className="text-stone-500">Commentary Package</span>
                  <span className="text-base font-bold font-serif text-[#2C2421]">₹{book.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openBookAudioPlayer(book)}
                    className="py-2.5 px-4 rounded-xl bg-[#EFE9DD] hover:bg-[#E2D9C8] text-[#3B234A] font-bold text-xs transition flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isUnlocked ? 'Listen Now' : 'Preview (Free)'}</span>
                  </button>

                  {isUnlocked ? (
                    <button
                      onClick={() => openBookAudioPlayer(book)}
                      className="py-2.5 px-4 rounded-xl bg-emerald-700 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Unlocked</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        openPaymentModal({
                          id: `book-${book.id}`,
                          name: `${book.title} - Complete Audio Commentary`,
                          price: book.price,
                          type: 'book-audio',
                          details: `${book.episodesCount} Episodes • ${book.duration}`
                        });
                      }}
                      className="py-2.5 px-4 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs shadow-sm transition flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Unlock (₹{book.price})</span>
                    </button>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </StaggerContainer>

      {/* Feature Highlights */}
      <ScrollReveal variant="fade-up">
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-[#E6E0D2] shadow-xs grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center">
              <Headphones className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C2421]">Immersive Audio Radio</h4>
            <p className="text-xs text-stone-500">Clean 1-sided spoken audio with soothing sacred background drone.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C2421]">Chapter-by-Chapter</h4>
            <p className="text-xs text-stone-500">Organized into digestible 30–50 minute discourses for your daily commute or meditation.</p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-emerald-700" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C2421]">Lifetime Re-Listen Access</h4>
            <p className="text-xs text-stone-500">Once unlocked, listen anytime on any mobile or desktop device.</p>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
