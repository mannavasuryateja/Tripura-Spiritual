import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import type { BookItem } from '../context/AppContext';
import { SPIRITUAL_BOOKS } from '../data/bookLibraryData';
import { X, BookOpen, Play, Lock, Sparkles, Headphones, ArrowRight } from 'lucide-react';

interface BookLibraryDrawerProps {
  onNavigateToFullPage?: () => void;
}

export const BookLibraryDrawer: React.FC<BookLibraryDrawerProps> = ({ onNavigateToFullPage }) => {
  const { isBookDrawerOpen, closeBookDrawer, openBookAudioPlayer, unlockedBooks, openPaymentModal } = useApp();
  const [activeBook, setActiveBook] = useState<BookItem>(SPIRITUAL_BOOKS[0]);

  if (!isBookDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fadeIn">
      {/* Backdrop */}
      <div 
        onClick={closeBookDrawer}
        className="absolute inset-0 bg-stone-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-[#FAF7F0] border-l border-[#E6E0D2] shadow-2xl flex flex-col justify-between overflow-hidden">
          
          {/* Header */}
          <div className="p-6 bg-[#FAF7F0] border-b border-[#E6E0D2] flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#EFE9DD] text-[#3B234A] flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B5E34] block">Master's Discourses</span>
                <h3 className="font-serif text-xl font-bold text-[#2C2421]">Spiritual Book Library</h3>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {onNavigateToFullPage && (
                <button
                  onClick={() => {
                    closeBookDrawer();
                    onNavigateToFullPage();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#EFE9DD] hover:bg-[#E2D9C8] text-[#3B234A] text-xs font-semibold flex items-center gap-1 transition"
                  title="Expand to Full Page"
                >
                  <span>Full View</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={closeBookDrawer}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Body Content (Scrollable) */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Peddi Raju Garu Speech Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#EFE9DD] to-[#FAF7F0] border border-[#D8CFBF] space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8B5E34] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#D1A559]" />
                <span>Audio Podcast & Spiritual Radio</span>
              </div>
              <p className="text-xs text-stone-700 italic leading-relaxed">
                "I have spent decades meditating on and living the teachings of these sacred texts. In these one-sided audio discourses, I break down the profound Sanskrit secrets into simple Telugu and English insights for your daily living."
              </p>
              <p className="text-[11px] font-bold text-[#3B234A] text-right">— Gorli Peddi Raju Garu</p>
            </div>

            {/* Book Selection Tabs */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#7A7067] block">
                Select a Sacred Work:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SPIRITUAL_BOOKS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setActiveBook(b)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      activeBook.id === b.id
                        ? 'border-[#3B234A] bg-[#3B234A] text-white shadow-sm'
                        : 'border-[#E6E0D2] bg-white text-[#2C2421] hover:bg-[#F3EDE0]'
                    }`}
                  >
                    <span className="block text-xs font-serif font-bold truncate">{b.title}</span>
                    <span className={`text-[10px] block truncate ${activeBook.id === b.id ? 'text-amber-200' : 'text-stone-500'}`}>
                      {b.episodesCount} Episodes
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Book Detail Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E6E0D2] shadow-sm space-y-4">
              <div className="flex gap-4">
                <div className="w-24 h-32 rounded-xl overflow-hidden shadow-md shrink-0 bg-stone-900 relative">
                  <img src={activeBook.coverImage} alt={activeBook.title} className="w-full h-full object-cover" />
                  <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/70 text-[9px] font-mono text-amber-300">
                    🎙 Radio
                  </span>
                </div>

                <div className="space-y-1 flex-1">
                  <span className="px-2 py-0.5 rounded bg-[#EFE9DD] text-[#8B5E34] text-[9px] font-bold uppercase tracking-wider">
                    {activeBook.tag}
                  </span>
                  <h4 className="font-serif font-bold text-lg text-[#2C2421]">{activeBook.title}</h4>
                  {activeBook.teluguTitle && (
                    <p className="text-xs font-semibold text-[#8B5E34]">{activeBook.teluguTitle}</p>
                  )}
                  <p className="text-[11px] text-stone-500">By {activeBook.author}</p>
                  <p className="text-[11px] font-mono text-stone-600 pt-1">
                    ⏱ {activeBook.duration} • {activeBook.episodesCount} Audio Chapters
                  </p>
                </div>
              </div>

              {/* Synopsis */}
              <div className="space-y-1.5 pt-2 border-t border-[#F0EBE1]">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#7A7067]">Core Essence</span>
                <p className="text-xs text-stone-700 leading-relaxed">{activeBook.synopsis}</p>
              </div>

              {/* Master's Commentary Highlight */}
              <div className="p-3 bg-[#FAF7F0] rounded-xl border border-[#E6E0D2] text-xs text-stone-800 space-y-1">
                <span className="text-[10px] font-bold text-[#8B5E34] uppercase tracking-wider block">Master's Direct Pointers</span>
                <p className="italic">"{activeBook.masterQuote}"</p>
              </div>

              {/* Audio Chapter List */}
              <div className="space-y-2 pt-2 border-t border-[#F0EBE1]">
                <div className="flex justify-between items-center text-xs font-bold text-[#2C2421]">
                  <span>Audio Episodes & Discourses</span>
                  <span className="text-[10px] font-normal text-stone-500">
                    {unlockedBooks.includes(activeBook.id) ? 'Unlocked' : 'Sample Included'}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {activeBook.chapters.map((ch, idx) => {
                    const isAccessible = ch.isFree || unlockedBooks.includes(activeBook.id);

                    return (
                      <div
                        key={idx}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between transition ${
                          isAccessible
                            ? 'bg-amber-50/50 border-amber-200 text-stone-900 hover:bg-amber-100/60'
                            : 'bg-stone-50 border-stone-200 text-stone-500'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate mr-2">
                          <span className="w-5 h-5 rounded-full bg-[#EFE9DD] text-[#3B234A] text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="truncate font-medium">{ch.title}</span>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-[10px] font-mono text-stone-400">{ch.duration}</span>
                          {isAccessible ? (
                            <button
                              onClick={() => {
                                closeBookDrawer();
                                openBookAudioPlayer(activeBook);
                              }}
                              className="p-1.5 rounded-full bg-[#8B5E34] hover:bg-[#6e4623] text-white transition"
                              title="Play Discourse"
                            >
                              <Play className="w-3 h-3 fill-white" />
                            </button>
                          ) : (
                            <Lock className="w-3.5 h-3.5 text-stone-400" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>

          {/* Bottom Action Footer */}
          <div className="p-6 bg-[#FAF7F0] border-t border-[#E6E0D2] shrink-0 space-y-3">
            {unlockedBooks.includes(activeBook.id) ? (
              <button
                onClick={() => {
                  closeBookDrawer();
                  openBookAudioPlayer(activeBook);
                }}
                className="w-full py-3.5 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-widest uppercase shadow-md transition flex items-center justify-center gap-2"
              >
                <Headphones className="w-4 h-4" />
                <span>Listen to Full Discourse Radio (Unlocked)</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-600">Full {activeBook.episodesCount}-Episode Master Podcast:</span>
                  <span className="text-base font-bold font-serif text-[#2C2421]">₹{activeBook.price}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      closeBookDrawer();
                      openBookAudioPlayer(activeBook);
                    }}
                    className="py-3 rounded-xl bg-white border border-[#D8CFBF] text-[#2C2421] font-bold text-xs hover:bg-[#EFE9DD] transition flex items-center justify-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Free Preview</span>
                  </button>

                  <button
                    onClick={() => {
                      openPaymentModal({
                        id: `book-${activeBook.id}`,
                        name: `${activeBook.title} - Complete Audio Commentary`,
                        price: activeBook.price,
                        type: 'book-audio',
                        details: `${activeBook.episodesCount} Episodes • ${activeBook.duration}`
                      });
                    }}
                    className="py-3 rounded-xl bg-[#8B5E34] hover:bg-[#6e4623] text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlock (₹{activeBook.price})</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};
