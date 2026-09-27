import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import type { BookItem } from '../context/AppContext';
import { booksApi } from '../api/client';
import { BookOpen, Play, Headphones, Sparkles, CheckCircle2, ShieldCheck, HelpCircle, Loader2, AlertCircle } from 'lucide-react';
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fadeIn text-[#2C2421]">
      
      {/* Hero Header */}
      <ScrollReveal variant="hero-zoom">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFE9DD] text-[#3B234A] text-xs font-bold uppercase tracking-widest border border-[#D8CFBF]">
            <Headphones className="w-3.5 h-3.5 text-[#8B5E34]" />
            <span>Master's Sacred Audio Discourses & Books</span>
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

          {books.length > 0 && (
            <button
              onClick={() => openBookAudioPlayer(books[0])}
              className="px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest shadow-lg transition flex items-center gap-2 shrink-0"
            >
              <Play className="w-3.5 h-3.5 fill-stone-950" />
              <span>Play Sample Discourse</span>
            </button>
          )}
        </div>
      </ScrollReveal>

      {/* Loading State */}
      {isLoading && (
        <div className="py-20 text-center space-y-4">
          <Loader2 className="w-10 h-10 text-amber-700 animate-spin mx-auto" />
          <p className="text-stone-500 font-serif text-base">Loading Sacred Works from Tripura Sanctuary...</p>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="p-8 rounded-3xl bg-rose-50 border border-rose-200 max-w-xl mx-auto text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h4 className="font-serif font-bold text-lg text-rose-900">Unable to load library</h4>
          <p className="text-xs text-rose-700">{error}</p>
          <button
            onClick={fetchBooks}
            className="px-6 py-2.5 rounded-full bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs uppercase tracking-wider transition"
          >
            Retry Loading
          </button>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && !error && books.length === 0 && (
        <div className="py-20 text-center space-y-4">
          <BookOpen className="w-12 h-12 text-stone-400 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-stone-800">No books are currently published</h3>
          <p className="text-xs text-stone-500">Check back soon for Master Gorli Peddi Raju Garu's upcoming audio commentaries.</p>
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
                className="bg-white rounded-3xl overflow-hidden border border-[#E6E0D2] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Book Cover Banner */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-stone-900">
                    <img
                      src={book.coverImage || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800'}
                      alt={book.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent flex flex-col justify-between p-5">
                      <span className="self-start px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#2C2421] text-[10px] font-bold uppercase tracking-wider">
                        {book.tag || 'Sacred Text'}
                      </span>

                      <div className="text-white space-y-1">
                        <span className="text-[10px] font-mono text-amber-300">🎙 {book.duration || 'Discourses'} • {book.episodesCount} Chapters</span>
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
                    {book.problemStatement && (
                      <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-xs space-y-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Problem Solved:</span>
                        </span>
                        <p className="text-stone-700 italic leading-snug">
                          "{book.problemStatement}"
                        </p>
                      </div>
                    )}

                    {/* Synopsis */}
                    <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                      {book.synopsis || book.summaryStory}
                    </p>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 border-t border-[#F2ECE1] mt-4 space-y-3">
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
                        onClick={() => openBookAudioPlayer(book)}
                        className="px-4 py-2.5 rounded-xl bg-[#EFE9DD] hover:bg-[#E2D9C8] text-[#3B234A] text-xs font-bold uppercase tracking-wider transition flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-[#3B234A]" />
                        <span>{isUnlocked ? 'Listen Now' : 'Free Preview'}</span>
                      </button>

                      {!isUnlocked && (
                        <button
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
                          className="px-4 py-2.5 rounded-xl bg-[#3B234A] hover:bg-[#2C1838] text-white text-xs font-bold uppercase tracking-wider transition shadow-sm"
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
      <ScrollReveal variant="fade-up">
        <div className="p-8 rounded-3xl bg-[#FAF7F0] border border-[#E6E0D2] flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
          <div className="w-16 h-16 rounded-full bg-[#EFE9DD] text-[#8B5E34] flex items-center justify-center shrink-0 shadow-inner">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h4 className="font-serif text-lg font-bold text-[#2C2421]">
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
