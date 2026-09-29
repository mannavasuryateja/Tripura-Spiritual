import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import type { BookItem } from '../context/AppContext';
import { booksApi } from '../api/client';
import { X, BookOpen, Play, Sparkles, Headphones, ArrowRight, Loader2, Lock } from 'lucide-react';

interface BookLibraryDrawerProps {
  onNavigateToFullPage?: () => void;
}

export const BookLibraryDrawer: React.FC<BookLibraryDrawerProps> = ({ onNavigateToFullPage }) => {
  const { isBookDrawerOpen, closeBookDrawer, openBookAudioPlayer, unlockedBooks, openPaymentModal, selectedBook } = useApp();
  const [books, setBooks] = useState<BookItem[]>([]);
  const [activeBook, setActiveBook] = useState<BookItem | null>(null);
  const [activeDrawerTab, setActiveDrawerTab] = useState<'episodes' | 'overview'>('episodes');
  const [isLoading, setIsLoading] = useState(false);

  const triggerRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  // Focus management on open/close
  useEffect(() => {
    if (isBookDrawerOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        drawerRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      triggerRef.current?.focus();
    }
  }, [isBookDrawerOpen]);

  useEffect(() => {
    if (isBookDrawerOpen) {
      setIsLoading(true);
      booksApi.getAllBooks().then(res => {
        const list = res.data || (res as any) || [];
        const normalized: BookItem[] = list.map((b: any) => ({
          ...b,
          chapters: b.episodes || b.chapters || [],
          episodesCount: b.episodesCount || (b.episodes ? b.episodes.length : 0),
          price: Number(b.price || 199)
        }));
        setBooks(normalized);
        if (selectedBook) {
          const match = normalized.find(b => String(b.id) === String(selectedBook.id));
          setActiveBook(match || normalized[0] || null);
        } else if (normalized.length > 0) {
          setActiveBook(normalized[0]);
        }
      }).catch(() => {
        // error handling
      }).finally(() => {
        setIsLoading(false);
      });
    }
  }, [isBookDrawerOpen, selectedBook]);

  if (!isBookDrawerOpen) return null;

  const currentBook = activeBook || books[0];
  const isBookUnlocked = currentBook ? unlockedBooks.some(id => String(id) === String(currentBook.id)) : false;
  const chapters = currentBook?.chapters || currentBook?.episodes || [];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        onClick={closeBookDrawer}
        className="absolute inset-0 bg-stone-950/70 backdrop-blur-md animate-backdrop-fade transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10">
        <div 
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="book-drawer-title"
          tabIndex={-1}
          className="w-screen max-w-lg sm:max-w-xl bg-[#FAF8F5] border-l border-[#E6E0D2] shadow-2xl flex flex-col justify-between overflow-hidden animate-drawer-slide-in focus:outline-none"
        >
          
          {/* Header */}
          <div className="p-5 sm:p-6 bg-[#FAF8F5] border-b border-[#E6E0D2] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-[#EFE9DD] text-[#3B234A] flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5 text-[#8B5E34]" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E34] block">Master's Discourses</span>
                <h3 id="book-drawer-title" className="font-serif text-lg sm:text-xl font-bold text-[#2C2421]">Spiritual Audio Library</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToFullPage && (
                <button
                  type="button"
                  onClick={() => {
                    closeBookDrawer();
                    onNavigateToFullPage();
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#EFE9DD] hover:bg-[#E2D9C8] text-[#3B234A] text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer min-h-[44px]"
                  title="Expand to Full Page"
                  aria-label="Expand to Full Page View"
                >
                  <span>Full View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={closeBookDrawer}
                className="w-11 h-11 rounded-full flex items-center justify-center text-stone-500 hover:text-stone-900 hover:bg-stone-200/70 transition cursor-pointer min-h-[44px] min-w-[44px]"
                aria-label="Close Drawer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5">
            
            {isLoading ? (
              <div className="py-24 text-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#8B5E34] motion-safe:animate-spin mx-auto" />
                <p className="text-xs text-stone-600 font-serif">Loading Sacred Discourses...</p>
              </div>
            ) : !currentBook ? (
              <div className="py-20 text-center text-stone-600 text-xs">
                No books available in library.
              </div>
            ) : (
              <>
                {/* Book Selection Carousel / Selector */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                      Select Sacred Work
                    </span>
                    <span className="text-[11px] font-mono text-[#8B5E34] font-semibold">
                      {books.length} Available
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {books.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setActiveBook(b)}
                        className={`p-3 rounded-2xl border text-left transition-all cursor-pointer min-h-[48px] ${
                          currentBook.id === b.id
                            ? 'border-[#3B234A] bg-[#3B234A] text-white shadow-sm'
                            : 'border-[#E6E0D2] bg-white text-[#2C2421] hover:bg-[#F3EDE0]'
                        }`}
                      >
                        <span className="block text-xs font-serif font-bold truncate">{b.title}</span>
                        <span className={`text-[10px] block truncate font-medium ${currentBook.id === b.id ? 'text-amber-200' : 'text-stone-600'}`}>
                          {b.episodesCount} Discourses
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Active Book Hero Summary */}
                <div className="bg-white rounded-3xl p-5 border border-[#E6E0D2] shadow-xs space-y-4">
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-28 sm:w-24 sm:h-32 rounded-2xl overflow-hidden shadow-md shrink-0 bg-stone-900 relative">
                      <img 
                        src={currentBook.coverImage || '/card3.jpg'} 
                        alt={currentBook.title} 
                        onError={(e) => { e.currentTarget.src = '/card3.jpg'; }}
                        className="w-full h-full object-cover" 
                      />
                      <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-mono text-amber-300 font-semibold">
                        🎙 Audio
                      </span>
                    </div>

                    <div className="space-y-1 flex-1 min-w-0">
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EFE9DD] text-[#8B5E34] text-[10px] font-bold uppercase tracking-wider">
                        {currentBook.tag || 'Sacred Text'}
                      </span>
                      <h4 className="font-serif font-bold text-base sm:text-lg text-[#2C2421] truncate">{currentBook.title}</h4>
                      {currentBook.teluguTitle && (
                        <p className="text-xs font-semibold text-[#8B5E34] truncate">{currentBook.teluguTitle}</p>
                      )}
                      <p className="text-xs text-stone-700 font-medium">Discourses by {currentBook.author}</p>
                      <p className="text-[11px] font-mono text-stone-600 pt-0.5">
                        {currentBook.episodesCount} Audio Chapters • Free Preview Included
                      </p>
                    </div>
                  </div>

                  {/* Section Switcher Tabs */}
                  <div className="flex rounded-2xl bg-[#EFE9DD] p-1 border border-[#D8CFBF]">
                    <button
                      onClick={() => setActiveDrawerTab('episodes')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 ${
                        activeDrawerTab === 'episodes'
                          ? 'bg-white text-[#2C2421] shadow-xs font-bold'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <Headphones className="w-3.5 h-3.5 text-[#8B5E34]" />
                      <span>Episodes ({chapters.length})</span>
                    </button>
                    <button
                      onClick={() => setActiveDrawerTab('overview')}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition cursor-pointer min-h-[40px] flex items-center justify-center gap-1.5 ${
                        activeDrawerTab === 'overview'
                          ? 'bg-white text-[#2C2421] shadow-xs font-bold'
                          : 'text-stone-700 hover:text-stone-900'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#8B5E34]" />
                      <span>Essence & Wisdom</span>
                    </button>
                  </div>

                  {/* TAB 1: Episodes List */}
                  {activeDrawerTab === 'episodes' && (
                    <div className="space-y-2.5 pt-1 animate-fadeIn">
                      <div className="flex justify-between items-center text-xs font-bold text-[#2C2421]">
                        <span>Audio Chapter Tracks</span>
                        <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                          {isBookUnlocked ? '✓ Full Access Unlocked' : '5-Min Preview Free'}
                        </span>
                      </div>

                      <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                        {chapters.map((ch, idx) => {
                          const isAccessible = ch.isFree || isBookUnlocked;
                          const isFreeEpisode = Boolean(ch.isFree);

                          const handleEpisodeClick = () => {
                            if (isAccessible || isFreeEpisode) {
                              closeBookDrawer();
                              openBookAudioPlayer(currentBook, ch.id ?? idx);
                            } else {
                              closeBookDrawer();
                              openPaymentModal({
                                id: `book-${currentBook.id}`,
                                name: `${currentBook.title} - Complete Audio Commentary`,
                                price: currentBook.price,
                                type: 'book-audio',
                                details: `${currentBook.episodesCount} Episodes • Full Audio Access`,
                                bookId: Number(currentBook.id)
                              });
                            }
                          };

                          return (
                            <div
                              key={idx}
                              onClick={handleEpisodeClick}
                              className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between gap-3 transition cursor-pointer min-h-[52px] ${
                                isAccessible
                                  ? 'bg-amber-50/70 border-amber-200 text-stone-900 hover:bg-amber-100/70 hover:border-amber-300'
                                  : isFreeEpisode
                                  ? 'bg-[#FAF7F0] border-amber-200 text-stone-900 hover:bg-[#F3EDE0]'
                                  : 'bg-stone-50/80 border-stone-200 text-stone-700 hover:bg-stone-100'
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                <span className="w-7 h-7 rounded-full bg-[#EFE9DD] text-[#3B234A] text-xs font-bold flex items-center justify-center shrink-0">
                                  {idx + 1}
                                </span>
                                <div className="min-w-0">
                                  <span className="truncate font-semibold block text-stone-900">{ch.title}</span>
                                  {ch.description && (
                                    <span className="text-[10px] text-stone-600 truncate block font-normal">
                                      {ch.description}
                                    </span>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center gap-2.5 shrink-0">
                                <span className="text-[11px] font-mono text-stone-600">{ch.duration}</span>
                                {isAccessible ? (
                                  <button
                                    type="button"
                                    className="w-10 h-10 rounded-full text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0 bg-[#8B5E34] hover:bg-[#6e4623] min-h-[40px] min-w-[40px]"
                                    title="Play Discourse"
                                    aria-label={`Play ${ch.title}`}
                                  >
                                    <Play className="w-3.5 h-3.5 fill-white" />
                                  </button>
                                ) : isFreeEpisode ? (
                                  <button
                                    type="button"
                                    className="w-10 h-10 rounded-full text-white flex items-center justify-center transition shadow-xs cursor-pointer shrink-0 bg-amber-600 hover:bg-amber-700 min-h-[40px] min-w-[40px]"
                                    title="Listen to 5-Min Free Preview"
                                    aria-label={`Listen to Free Preview of ${ch.title}`}
                                  >
                                    <Play className="w-3.5 h-3.5 fill-white" />
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    className="px-3.5 py-2 rounded-full text-white flex items-center gap-1.5 transition shadow-xs cursor-pointer shrink-0 bg-[#3B234A] hover:bg-[#2C1838] text-[11px] font-semibold min-h-[36px]"
                                    title={`Unlock Full Discourse (₹${currentBook.price})`}
                                    aria-label={`Unlock ${ch.title}`}
                                  >
                                    <Lock className="w-3 h-3 text-amber-300" />
                                    <span>Unlock</span>
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* TAB 2: Overview & Master Commentary */}
                  {activeDrawerTab === 'overview' && (
                    <div className="space-y-3 pt-1 animate-fadeIn text-xs text-stone-800">
                      {currentBook.problemStatement && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 space-y-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900 block">Life Challenges Addressed</span>
                          <p className="text-stone-800 leading-relaxed font-normal">"{currentBook.problemStatement}"</p>
                        </div>
                      )}

                      <div className="space-y-1.5">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700 block">Core Synopsis</span>
                        <p className="text-stone-700 leading-relaxed font-normal">{currentBook.synopsis || currentBook.summaryStory}</p>
                      </div>

                      {currentBook.masterQuote && (
                        <div className="p-4 bg-[#FAF7F0] rounded-2xl border border-[#E6E0D2] space-y-1">
                          <span className="text-[10px] font-bold text-[#8B5E34] uppercase tracking-wider block">Master's Living Quote</span>
                          <p className="italic text-stone-800 leading-relaxed font-serif">"{currentBook.masterQuote}"</p>
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </>
            )}

          </div>

          {/* Bottom Action Footer */}
          {currentBook && (
            <div className="p-5 sm:p-6 bg-[#FAF8F5] border-t border-[#E6E0D2] shrink-0 space-y-3">
              {isBookUnlocked ? (
                <button
                  onClick={() => {
                    closeBookDrawer();
                    openBookAudioPlayer(currentBook);
                  }}
                  className="btn-spiritual btn-primary w-full py-4 text-white font-bold text-xs tracking-widest uppercase shadow-md transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                >
                  <Headphones className="w-4 h-4" />
                  <span>Listen to Full Discourses (Unlocked)</span>
                </button>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-stone-700 font-semibold">Complete {currentBook.episodesCount}-Discourse Master Commentary:</span>
                    <span className="text-base font-bold font-serif text-[#2C2421]">₹{currentBook.price}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      onClick={() => {
                        closeBookDrawer();
                        openBookAudioPlayer(currentBook);
                      }}
                      className="btn-spiritual btn-outline py-3.5 px-4 font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                    >
                      <Play className="w-3.5 h-3.5 text-[#8B5E34]" />
                      <span>Free Preview</span>
                    </button>

                    <button
                      onClick={() => {
                        openPaymentModal({
                          id: `book-${currentBook.id}`,
                          name: `${currentBook.title} - Complete Audio Commentary`,
                          price: currentBook.price,
                          type: 'book-audio',
                          details: `${currentBook.episodesCount} Episodes • Full Audio Access`,
                          bookId: Number(currentBook.id)
                        });
                      }}
                      className="btn-spiritual btn-secondary py-3.5 px-4 font-bold text-xs shadow-md transition flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      <span>Unlock for ₹{currentBook.price}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
