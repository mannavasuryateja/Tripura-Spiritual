import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Radio, Lock } from 'lucide-react';

export const BookAudioPlayerModal: React.FC = () => {
  const { isBookAudioOpen, closeBookAudioPlayer, currentBookAudio, unlockedBooks, openPaymentModal } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [progress, setProgress] = useState(25);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isBookAudioOpen) {
      setIsPlaying(true);
      setProgress(25);
      setCurrentChapterIdx(0);

      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeBookAudioPlayer();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
        document.documentElement.style.overflow = '';
      };
    }
  }, [isBookAudioOpen, closeBookAudioPlayer]);

  if (!isBookAudioOpen || !currentBookAudio) return null;

  const activeChapter = currentBookAudio.chapters[currentChapterIdx] || currentBookAudio.chapters[0];
  const isChapterUnlocked = activeChapter.isFree || unlockedBooks.includes(currentBookAudio.id);

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    setProgress(Math.round((clickX / rect.width) * 100));
  };

  const skipTime = (seconds: number) => {
    setProgress(prev => Math.max(0, Math.min(100, prev + (seconds > 0 ? 5 : -5))));
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) closeBookAudioPlayer(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-backdrop-fade overflow-y-auto"
    >
      <div className="bg-[#241C1A] text-white rounded-3xl max-w-2xl w-full border border-amber-500/30 shadow-2xl overflow-hidden relative flex flex-col my-auto max-h-[90vh] animate-modal-scale-in animate-sacred-glow">
        
        {/* Top Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-800 bg-[#1D1615] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                Spiritual Radio & Audio Discourse
              </span>
              <h3 className="font-serif text-base font-bold text-stone-100">
                {currentBookAudio.title}
              </h3>
            </div>
          </div>

          <button
            onClick={closeBookAudioPlayer}
            className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Player Main Area */}
        <div className="p-6 sm:p-8 space-y-6 flex-1">
          
          {/* Animated Wave / Master Audio Visualizer */}
          <div className="relative rounded-2xl bg-gradient-to-br from-amber-950/60 via-stone-900 to-orange-950/60 border border-amber-500/20 p-6 flex flex-col items-center justify-center text-center overflow-hidden">
            
            {/* Ambient Pulse */}
            <div className={`relative flex items-center justify-center mb-4 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-95 opacity-80'}`}>
              <div className={`absolute w-36 h-36 rounded-full bg-amber-500/10 blur-xl ${isPlaying ? 'animate-ping' : ''}`}></div>
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-4xl shadow-xl border border-amber-300/30">
                🎙️
              </div>
            </div>

            {/* Audio Wave bars */}
            <div className="flex items-center justify-center gap-1 h-8 my-2">
              {[40, 65, 85, 45, 95, 70, 50, 80, 60, 90, 75, 55, 80, 45, 60].map((h, i) => (
                <span
                  key={i}
                  className={`w-1 bg-amber-400/80 rounded-full transition-all duration-300 ${
                    isPlaying ? 'animate-pulse' : 'h-2 opacity-40'
                  }`}
                  style={{ height: isPlaying ? `${Math.max(10, (h * ((i % 3) + 1)) % 32)}px` : '4px' }}
                />
              ))}
            </div>

            <div className="space-y-1 max-w-md">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                Episode {currentChapterIdx + 1} of {currentBookAudio.chapters.length}
              </span>
              <h4 className="font-serif text-lg font-bold text-amber-100">
                {activeChapter.title}
              </h4>
              <p className="text-xs text-stone-400">
                Master Commentary & Guided Contemplation by Gorli Peddi Raju Garu
              </p>
            </div>
          </div>

          {/* Locked Notice if non-accessible episode */}
          {!isChapterUnlocked && (
            <div className="p-4 bg-amber-950/40 border border-amber-500/40 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-amber-300">
                <Lock className="w-4 h-4 shrink-0 text-amber-400" />
                <span>This episode is part of the full commentary audio package.</span>
              </div>
              <button
                onClick={() => {
                  closeBookAudioPlayer();
                  openPaymentModal({
                    id: `book-${currentBookAudio.id}`,
                    name: `${currentBookAudio.title} - Full Commentary Podcast`,
                    price: currentBookAudio.price,
                    type: 'book-audio'
                  });
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition shrink-0"
              >
                Unlock Full Audio (₹{currentBookAudio.price})
              </button>
            </div>
          )}

          {/* Seek Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-stone-400 font-mono">
              <span>08:42</span>
              <span>{activeChapter.duration}</span>
            </div>
            <div
              onClick={handleSeek}
              className="h-2 bg-stone-800 rounded-full overflow-hidden cursor-pointer relative"
            >
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between pt-2">
            
            {/* Left Controls: Speed & Mute */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1)}
                className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-xs font-mono font-bold text-amber-300 transition"
                title="Playback Speed"
              >
                {playbackSpeed}x
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 rounded-full hover:bg-stone-800 text-stone-300 transition"
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>

            {/* Center Main Controls */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => skipTime(-15)}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
                title="Rewind 15 Seconds"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-4 rounded-full bg-amber-600 hover:bg-amber-500 text-white shadow-xl transition transform hover:scale-105"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-0.5" />}
              </button>

              <button
                onClick={() => skipTime(15)}
                className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
                title="Forward 15 Seconds"
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>

            {/* Right: Chapter Navigation */}
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <button
                disabled={currentChapterIdx === 0}
                onClick={() => setCurrentChapterIdx(prev => Math.max(0, prev - 1))}
                className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-40 transition"
              >
                Prev
              </button>
              <button
                disabled={currentChapterIdx === currentBookAudio.chapters.length - 1}
                onClick={() => setCurrentChapterIdx(prev => Math.min(currentBookAudio.chapters.length - 1, prev + 1))}
                className="px-2 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-40 transition"
              >
                Next
              </button>
            </div>

          </div>

          {/* Episode List Accordion */}
          <div className="space-y-2 pt-4 border-t border-stone-800">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block">
              Discourse Playlist
            </span>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1 text-xs">
              {currentBookAudio.chapters.map((ch, idx) => {
                const isSelected = idx === currentChapterIdx;
                const isItemAccessible = ch.isFree || unlockedBooks.includes(currentBookAudio.id);

                return (
                  <button
                    key={idx}
                    onClick={() => setCurrentChapterIdx(idx)}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-200 border border-amber-500/40'
                        : 'bg-stone-900/60 hover:bg-stone-800/80 text-stone-300'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate mr-2">
                      <span className="font-mono text-[10px] opacity-70">#{idx + 1}</span>
                      <span className="truncate">{ch.title}</span>
                    </span>

                    <span className="flex items-center gap-2 shrink-0 font-mono text-[11px]">
                      <span>{ch.duration}</span>
                      {!isItemAccessible && <Lock className="w-3 h-3 text-amber-400" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
