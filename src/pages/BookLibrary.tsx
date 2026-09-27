import React from 'react';
import { useApp } from '../context/AppContext';
import { SPIRITUAL_BOOKS } from '../data/bookLibraryData';
import { BookOpen, Play, Headphones, Sparkles, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
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
            <span>Master's Sacred Audio Podcasts & Books</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2C2421]">
            Spiritual Book Library & Podcasts
          </h1>
          <p className="text-base text-stone-600 leading-relaxed font-light">
            Read the problem statement and narrative summary for <strong>100% Free</strong>. Listen to <strong>5 minutes of free preview</strong> on every audio discourse before unlocking the complete commentary package by <strong>Master Gorli Peddi Raju Garu</strong>.
          </p>
        </div>
      </ScrollReveal>

      {/* Free Experience Policy Banner */}
      <ScrollReveal variant="fade-up" delay={80}>
        <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-900 via-stone-900 to-[#3B234A] text-white shadow-xl max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-300">
              <Sparkles className="w-4 h-4" />
              <span>Zero-Risk Discovery Model</span>
            </div>
            <h3 className="font-serif text-xl font-bold">5-Minute Free Preview on All Audio Chapters</h3>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              Explore the core existential problem, read the master’s summary, and listen to the first 5 minutes of any chapter for free. Purchase only when deeply aligned with the teaching.
            </p>
          </div>

          <button
            onClick={() => {
              if (SPIRITUAL_BOOKS[0]) openBookAudioPlayer(SPIRITUAL_BOOKS[0]);
            }}
            className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg transition flex items-center gap-2 shrink-0"
          >
            <Play className="w-3.5 h-3.5 fill-stone-950" />
            <span>Play Sample Podcast</span>
          </button>
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
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-between p-5">
                    <span className="self-start px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#2C2421] text-[10px] font-bold uppercase tracking-wider">
                      {book.tag}
                    </span>

                    <div className="text-white space-y-1">
                      <span className="text-[10px] font-mono text-amber-300">🎙 {book.duration} • {book.episodesCount} Chapters</span>
                      <h3 className="font-serif text-xl font-bold">{book.title}</h3>
                    </div>
                  </div>
                </div>

                {/* Details & Problem Statement */}
                <div className="p-6 space-y-4">
                  {book.teluguTitle && (
                    <span className="text-xs font-bold text-[#8B5E34] block">{book.teluguTitle}</span>
                  )}
                  <p className="text-xs text-stone-500">Original Author: {book.author}</p>
                  
                  {/* Problem Statement Box */}
                  <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                      <span>Problem Solved:</span>
                    </span>
                    <p className="text-stone-700 italic leading-snug">
                      "{book.problemStatement}"
                    </p>
                  </div>

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
                  <span className="text-stone-500">Complete Commentary Pack</span>
                  <span className="text-base font-bold font-serif text-[#2C2421]">₹{book.price}</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openBookAudioPlayer(book)}
                    className="py-2.5 px-4 rounded-xl bg-[#EFE9DD] hover:bg-[#E2D9C8] text-[#3B234A] font-bold text-xs transition flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isUnlocked ? 'Listen Full' : '5-Min Free'}</span>
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
                          details: `${book.episodesCount} Episodes • ${book.duration} • Lifetime Access`
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
              <Headphones className="w-6 h-6 text-[#8B5E34]" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C2421]">Radio-Style Discourses</h4>
            <p className="text-xs text-stone-600 font-light">
              High-fidelity audio streaming optimized for background listening during contemplation, walking, or resting.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#8B5E34]" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C2421]">Authentic Non-Dual Texts</h4>
            <p className="text-xs text-stone-600 font-light">
              Curated masterworks including Tripura Rahasya, Yoga Vasistha, Bhagavad Gita Sthitaprajna, and Patanjali Sutras.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-[#8B5E34]" />
            </div>
            <h4 className="font-serif font-bold text-base text-[#2C2421]">5-Min Free Discovery</h4>
            <p className="text-xs text-stone-600 font-light">
              Every chapter offers 5 minutes of continuous free audio preview so you only invest in teachings that resonate.
            </p>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
