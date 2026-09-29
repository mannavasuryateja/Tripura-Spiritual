import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { BookItem } from '../context/AppContext';
import { booksApi } from '../api/client';
import { BookOpen, Play, Headphones, Sparkles, CheckCircle2, ShieldCheck, HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { ScrollReveal, StaggerContainer } from '../components/ScrollReveal';

export const BookLibrary: React.FC = () => {
  const { openBookAudioPlayer, unlockedBooks, openPaymentModal } = useApp();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await booksApi.getAllBooks();
      const list = res.data || (res as any) || [];
      // Normalize chapters/episodes
      const normalized = list.map((b: any) => ({
        ...b,
        chapters: b.episodes || b.chapters || [],
        episodesCount: b.episodesCount || (b.episodes ? b.episodes.length : 0),
        price: Number(b.price || 199)
      }));
      setBooks(normalized);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Unable to connect to the spiritual book library. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="section-container py-10 space-y-14 animate-fadeIn text-[#2C2421]">
      
      {/* Short Page Header Band */}
      <div className="card-spiritual bg-gradient-to-r from-[#FAF7F0] via-[#F5EFE6] to-[#FAF7F0] mandala-bg py-10 px-6 sm:px-12 text-center shadow-xs">
        <ScrollReveal animation="hero-zoom">
          <div className="section-header">
            <div className="badge-eyebrow bg-[#EFE9DD] text-[#3B234A] border border-[#D8CFBF] mx-auto">
              <Headphones className="w-3.5 h-3.5 text-[#8B5E34]" />
              <span>Master's Sacred Audio Discourses & Books</span>
            </div>
            <h1 className="heading-section text-[#2C2421]">
              Spiritual Book Library & Podcasts
            </h1>
            <p className="text-stone-600 text-sm sm:text-base font-light leading-relaxed max-w-2xl mx-auto">
              Read the problem statement and narrative summary for <strong>100% Free</strong>. Listen to <strong>5 minutes of free preview</strong> on every audio discourse before unlocking the complete commentary package by <strong>Master Gorli Peddi Raju Garu</strong>.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Free Experience Policy Banner */}
      <ScrollReveal animation="fade-up" delay={80}>
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#3B234A] via-[#2A1836] to-[#1C0F24] text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-white/10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#D1A559]">
              <Sparkles className="w-4 h-4" />
              <span>Zero-Risk Discovery Model</span>
            </div>
            <h3 className="heading-card text-xl font-bold text-white">5-Minute Free Preview on All Audio Chapters</h3>
            <p className="text-xs text-stone-300 max-w-xl leading-relaxed">
              Explore the core existential problem, read the master’s summary, and listen to the first 5 minutes of any chapter for free. Purchase only when deeply aligned with the teaching.
            </p>
          </div>

          {books.length > 0 && (
            <button
              type="button"
              onClick={() => openBookAudioPlayer(books[0])}
              className="btn-spiritual btn-gold px-6 py-3.5 font-bold text-xs uppercase tracking-widest shadow-lg flex items-center gap-2 shrink-0 cursor-pointer min-h-[44px]"
            >
              <Play className="w-3.5 h-3.5 fill-[#201812]" />
              <span>Play Sample Discourse</span>
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Loading State Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 motion-safe:animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-spiritual overflow-hidden shadow-xs space-y-4">
              <div className="aspect-[16/10] bg-[#EFE9DD]"></div>
              <div className="p-6 space-y-3">
                <div className="w-24 h-4 bg-[#EFE9DD] rounded-full"></div>
                <div className="w-3/4 h-6 bg-[#EFE9DD] rounded-xl"></div>
                <div className="w-full h-16 bg-[#EFE9DD] rounded-2xl"></div>
                <div className="w-full h-10 bg-[#EFE9DD] rounded-xl"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="card-spiritual p-8 bg-rose-50 border-rose-200 max-w-xl mx-auto text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h4 className="heading-card text-rose-900">Unable to load library</h4>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            type="button"
            onClick={fetchBooks}
            className="btn-spiritual btn-primary px-6 py-2.5 text-xs uppercase tracking-wider transition cursor-pointer min-h-[44px] gap-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry Loading</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && books.length === 0 && (
        <div className="py-20 text-center space-y-4 max-w-md mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#EFE9DD] text-[#8B5E34] flex items-center justify-center mx-auto shadow-inner">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="heading-card text-xl text-[#2C2421]">No Discourses Currently Published</h3>
          <p className="text-xs text-stone-700 leading-relaxed font-light">Check back soon for Master Gorli Peddi Raju Garu's upcoming audio commentaries and sacred discourses.</p>
        </div>
      )}

      {/* Book Grid */}
      {!isLoading && !error && books.length > 0 && (
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" staggerDelay={100}>
          {books.map((book) => {
            const isUnlocked = unlockedBooks.some(id => String(id) === String(book.id));

            return (
              <div
                key={book.id}
                className="card-spiritual card-interactive overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Book Cover Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-900 rounded-t-[1.5rem]">
                    <img
                      src={book.coverImage || '/card3.jpg'}
                      alt={book.title}
                      onError={(e) => { e.currentTarget.src = '/card3.jpg'; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-between p-5">
                      <span className="self-start px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#2C2421] text-[10px] font-bold uppercase tracking-wider shadow-xs border border-[#E6E0D2]">
                        {book.tag || 'Sacred Text'}
                      </span>

                      <div className="text-white space-y-1">
                        <span className="text-[10px] font-mono text-[#D1A559] font-semibold">🎙 {book.duration || 'Discourses'} • {book.episodesCount} Chapters</span>
                        <h3 className="heading-card text-xl text-white font-bold">{book.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Details & Problem Statement */}
                  <div className="p-6 space-y-4">
                    {book.teluguTitle && (
                      <span className="text-xs font-bold text-[#8B5E34] block font-telugu">{book.teluguTitle}</span>
                    )}
                    <p className="text-xs text-stone-700 font-medium">Original Author: {book.author}</p>
                    
                    {/* Problem Statement Box */}
                    {book.problemStatement && (
                      <div className="p-3.5 bg-[#FAF8F5] rounded-2xl border border-[#E6E0D2] text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8B5E34] flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-[#8B5E34]" />
                          <span>Problem Solved:</span>
                        </span>
                        <p className="text-stone-800 italic leading-snug">
                          "{book.problemStatement}"
                        </p>
                      </div>
                    )}

                    {/* Synopsis */}
                    <p className="text-xs text-stone-700 line-clamp-3 leading-relaxed font-light">
                      {book.synopsis || book.summaryStory}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 border-t border-[#E6E0D2] mt-4 space-y-3">
                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <span className="text-[10px] text-stone-500 uppercase tracking-wider block font-bold">
                        {isUnlocked ? 'Status' : 'Complete Series'}
                      </span>
                      {isUnlocked ? (
                        <span className="font-bold text-emerald-700 text-xs flex items-center gap-1 mt-0.5">
                          <CheckCircle2 className="w-4 h-4" /> Unlocked Forever
                        </span>
                      ) : (
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-serif font-bold text-2xl text-[#2C2421]">₹{book.price}</span>
                          <span className="text-[10px] text-stone-500 line-through">₹{book.price * 2}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => openBookAudioPlayer(book)}
                        className="btn-spiritual btn-outline px-4 py-2.5 text-[#3B234A] text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5 cursor-pointer min-h-[44px]"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#3B234A]" />
                        <span>{isUnlocked ? 'Listen Now' : 'Free Preview'}</span>
                      </button>

                      {!isUnlocked && (
                        <button
                          type="button"
                          onClick={() => {
                            openPaymentModal({
                              id: `book-${book.id}`,
                              name: `${book.title} - Complete Discourse Audio`,
                              price: book.price,
                              type: 'book-audio',
                              details: `Full Audio Access • All ${book.episodesCount} Chapters Unlocked Forever`,
                              bookId: Number(book.id)
                            });
                          }}
                          className="btn-spiritual btn-primary px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition shadow-sm cursor-pointer min-h-[44px]"
                        >
                          Unlock
                        </button>
                      )}
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </StaggerContainer>
      )}

      {/* Master Guarantee Card */}
      <ScrollReveal animation="fade-up">
        <div className="card-spiritual p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-[#EFE9DD] text-[#8B5E34] flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="heading-card text-lg text-[#2C2421]">
              Tripura Spiritual Sacred Transmission Guarantee
            </h4>
            <p className="text-xs text-stone-600 leading-relaxed font-light">
              Every discourse in this library is directly recorded by Master Gorli Peddi Raju Garu without script reading or commercial cuts. Once unlocked, your access remains valid for life in your student sanctuary.
            </p>
          </div>
        </div>
      </ScrollReveal>

    </div>
  );
};
