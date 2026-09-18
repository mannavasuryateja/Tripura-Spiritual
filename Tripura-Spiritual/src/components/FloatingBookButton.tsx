import React from 'react';
import { useApp } from '../context/AppContext';
import { BookOpen, Radio } from 'lucide-react';

export const FloatingBookButton: React.FC = () => {
  const { openBookDrawer, isBookDrawerOpen } = useApp();

  // If drawer is already open, don't overlap
  if (isBookDrawerOpen) return null;

  return (
    <aside aria-label="Sacred Books & Audio Podcasts Quick Access">
      <button
        onClick={() => openBookDrawer()}
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#FAF7F0]/95 hover:bg-[#3B234A] text-[#8B5E34] hover:text-white border-l-2 border-y border-[#D8CFBF] hover:border-[#3B234A] pl-3 pr-2.5 py-3.5 rounded-l-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex flex-col items-center gap-2 group backdrop-blur-md cursor-pointer transform hover:-translate-x-1"
        title="Sacred Book Library & Audio Podcasts"
        aria-label="Open Sacred Book Library & Audio Podcasts"
      >
        {/* Book Icon with Aura Badge */}
        <div className="relative">
          <BookOpen className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D1A559] animate-ping" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#D1A559]" />
        </div>

        {/* Small Audio Indicator */}
        <Radio className="w-3.5 h-3.5 text-[#D1A559] opacity-80 group-hover:opacity-100 animate-pulse" />

        {/* Vertical Text Label */}
        <span 
          className="text-[10px] font-serif font-bold uppercase tracking-widest text-[#5C534E] group-hover:text-amber-200 select-none"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          Books & Audio
        </span>
      </button>
    </aside>
  );
};
