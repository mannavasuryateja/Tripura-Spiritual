import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Radio, Sparkles, BookOpen } from 'lucide-react';

export const BookAudioPlayerModal: React.FC = () => {
  const { isBookAudioOpen, closeBookAudioPlayer, currentBookAudio, unlockedBooks, openPaymentModal } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentChapterIdx, setCurrentChapterIdx] = useState(0);
  const [activeTab, setActiveTab] = useState<'player' | 'summary'>('player');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  // Timer state in seconds for simulated audio playback
  const [currentTimeSec, setCurrentTimeSec] = useState(45); // Start with 45s played

  useEffect(() => {
    if (isBookAudioOpen) {
      setIsPlaying(true);
      setCurrentTimeSec(45);
      setCurrentChapterIdx(0);
      setActiveTab('player');

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeBookAudioPlayer();
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isBookAudioOpen, closeBookAudioPlayer]);

  // Audio timer ticker simulation
  useEffect(() => {
    let interval: any = null;
    if (isBookAudioOpen && isPlaying) {
      interval = setInterval(() => {
        setCurrentTimeSec(prev => {
          const isFullyUnlocked = isBookUnlocked || (currentBookAudio?.chapters[currentChapterIdx]?.isFree ?? false);
          // If not unlocked, clamp at 300 seconds (5 minutes)
          if (!isFullyUnlocked && prev >= 300) {
            setIsPlaying(false);
            return 300;
          }
          return prev + 1;
        });
      }, 1000 / playbackSpeed);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBookAudioOpen, isPlaying, playbackSpeed, currentChapterIdx, currentBookAudio, unlockedBooks]);

  if (!isBookAudioOpen || !currentBookAudio) return null;

  const isBookUnlocked = unlockedBooks.includes(currentBookAudio.id);
  const activeChapter = currentBookAudio.chapters[currentChapterIdx] || currentBookAudio.chapters[0];
  const isChapterUnlocked = isBookUnlocked || activeChapter.isFree;
  const isPreviewLimitReached = !isChapterUnlocked && currentTimeSec >= 300;

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const targetSeconds = clickRatio * 2400; // Assume 40 min avg

    if (!isChapterUnlocked && targetSeconds > 300) {
      setCurrentTimeSec(300);
      setIsPlaying(false);
    } else {
      setCurrentTimeSec(Math.round(targetSeconds));
    }
  };

  const skipTime = (seconds: number) => {
    setCurrentTimeSec(prev => {
      const nextTime = Math.max(0, prev + seconds);
      if (!isChapterUnlocked && nextTime > 300) {
        return 300;
      }
      return nextTime;
    });
  };

  const handleUnlockFull = () => {
    closeBookAudioPlayer();
    openPaymentModal({
      id: `book-${currentBookAudio.id}`,
      name: `${currentBookAudio.title} - Complete Commentary Podcast`,
      price: currentBookAudio.price,
      type: 'book-audio',
      details: `Full Audio Access • All ${currentBookAudio.episodesCount} Chapters Unlocked Forever`
    });
  };

  // Progress percentage (out of 5 mins for preview or out of 40 mins for unlocked)
  const maxDisplaySec = isChapterUnlocked ? 2400 : 300;
  const progressPercent = Math.min(100, (currentTimeSec / maxDisplaySec) * 100);

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) closeBookAudioPlayer(); }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-backdrop-fade overflow-y-auto"
    >
      <div className="bg-[#241C1A] text-white rounded-3xl max-w-2xl w-full border border-amber-500/30 shadow-2xl overflow-hidden relative flex flex-col my-auto max-h-[92vh] animate-modal-scale-in animate-sacred-glow">
        
        {/* Top Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-800 bg-[#1D1615] shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center justify-center text-xs">
              <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            </span>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                Tripura Spiritual Audio Podcast
              </span>
              <h3 className="font-serif text-base font-bold text-stone-100 truncate max-w-xs sm:max-w-md">
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

        {/* Tab Selector: 🎙️ Audio Podcast vs 📖 Problem Statement & Summary */}
        <div className="flex border-b border-stone-800 bg-[#1F1816] px-6">
          <button
            onClick={() => setActiveTab('player')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
              activeTab === 'player'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Podcast Player ({isChapterUnlocked ? 'Full' : '5-Min Free Preview'})</span>
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`py-3 px-4 text-xs font-bold uppercase tracking-wider flex items-center gap-2 border-b-2 transition ${
              activeTab === 'summary'
                ? 'border-amber-400 text-amber-300'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Problem Statement & Summary (Free)</span>
          </button>
        </div>

        {/* View 1: Audio Player */}
        {activeTab === 'player' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto">
            
            {/* Free 5-Min Preview Notice Banner */}
            {!isChapterUnlocked && (
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-950/80 to-stone-900 border border-amber-500/40 flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-400 shrink-0 animate-pulse" />
                  <span>
                    <strong>5-Minute Free Preview Active:</strong> Enjoy the first 5 mins of master commentary at zero cost.
                  </span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider shrink-0 font-mono">
                  {formatSeconds(Math.max(0, 300 - currentTimeSec))} Left
                </span>
              </div>
            )}

            {/* Visualizer & Cover */}
            <div className="relative rounded-2xl bg-gradient-to-br from-amber-950/60 via-stone-900 to-orange-950/60 border border-amber-500/20 p-6 flex flex-col items-center justify-center text-center overflow-hidden">
              <div className={`relative flex items-center justify-center mb-3 transition-transform duration-700 ${isPlaying ? 'scale-105' : 'scale-95 opacity-80'}`}>
                <div className={`absolute w-32 h-32 rounded-full bg-amber-500/15 blur-xl ${isPlaying ? 'animate-ping' : ''}`}></div>
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-700 to-amber-500 flex items-center justify-center text-3xl shadow-xl border border-amber-300/30">
                  🎙️
                </div>
              </div>

              {/* Audio Wave Bars */}
              <div className="flex items-center justify-center gap-1 h-7 my-2">
                {[40, 65, 85, 45, 95, 70, 50, 80, 60, 90, 75, 55, 80, 45, 60].map((h, i) => (
                  <span
                    key={i}
                    className={`w-1 bg-amber-400/80 rounded-full transition-all duration-300 ${
                      isPlaying ? 'animate-pulse' : 'h-2 opacity-40'
                    }`}
                    style={{ height: isPlaying ? `${Math.max(8, (h * ((i % 3) + 1)) % 28)}px` : '4px' }}
                  />
                ))}
              </div>

              <div className="space-y-1 max-w-md">
                <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                  Chapter {currentChapterIdx + 1} of {currentBookAudio.chapters.length}
                </span>
                <h4 className="font-serif text-lg font-bold text-amber-100">
                  {activeChapter.title}
                </h4>
                <p className="text-xs text-stone-400">
                  Commentary by Master Gorli Peddi Raju Garu
                </p>
              </div>
            </div>

            {/* Preview Limit Reached Banner */}
            {isPreviewLimitReached && (
              <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 text-white rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-lg animate-fadeIn">
                <div>
                  <h5 className="font-serif font-bold text-sm">5-Minute Free Preview Completed</h5>
                  <p className="text-[11px] text-amber-100">
                    Unlock all {currentBookAudio.episodesCount} audio chapters forever for just ₹{currentBookAudio.price}.
                  </p>
                </div>
                <button
                  onClick={handleUnlockFull}
                  className="px-5 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs uppercase tracking-wider shadow-md hover:bg-stone-100 transition shrink-0"
                >
                  Unlock Podcast (₹{currentBookAudio.price})
                </button>
              </div>
            )}

            {/* Seek Progress Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-stone-400 font-mono">
                <span>{formatSeconds(currentTimeSec)}</span>
                <span>{isChapterUnlocked ? activeChapter.duration : '05:00 (Free Preview)'}</span>
              </div>
              <div
                onClick={handleSeek}
                className="h-2.5 bg-stone-800 rounded-full overflow-hidden cursor-pointer relative"
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-200"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Playback Controls */}
            <div className="flex items-center justify-between pt-1">
              
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
                  onClick={() => {
                    if (isPreviewLimitReached) {
                      handleUnlockFull();
                    } else {
                      setIsPlaying(!isPlaying);
                    }
                  }}
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
                  onClick={() => { setCurrentChapterIdx(prev => Math.max(0, prev - 1)); setCurrentTimeSec(0); }}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-40 transition"
                >
                  Prev
                </button>
                <button
                  disabled={currentChapterIdx === currentBookAudio.chapters.length - 1}
                  onClick={() => { setCurrentChapterIdx(prev => Math.min(currentBookAudio.chapters.length - 1, prev + 1)); setCurrentTimeSec(0); }}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 disabled:opacity-40 transition"
                >
                  Next
                </button>
              </div>

            </div>

            {/* Chapters List */}
            <div className="space-y-2 pt-4 border-t border-stone-800">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-stone-400 uppercase tracking-wider">
                  Podcast Chapters
                </span>
                {!isBookUnlocked && (
                  <button
                    onClick={handleUnlockFull}
                    className="text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
                  >
                    <span>Unlock All ({currentBookAudio.episodesCount}) for ₹{currentBookAudio.price}</span>
                  </button>
                )}
              </div>

              <div className="space-y-1 max-h-36 overflow-y-auto pr-1 text-xs">
                {currentBookAudio.chapters.map((ch, idx) => {
                  const isSelected = idx === currentChapterIdx;
                  const isItemAccessible = isBookUnlocked || ch.isFree;

                  return (
                    <button
                      key={idx}
                      onClick={() => {
                        setCurrentChapterIdx(idx);
                        setCurrentTimeSec(0);
                        setIsPlaying(true);
                      }}
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
                        {!isItemAccessible && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] uppercase font-bold">
                            5m Free
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

          </div>
        )}

        {/* View 2: Free Problem Statement & Summary */}
        {activeTab === 'summary' && (
          <div className="p-6 sm:p-8 space-y-6 flex-1 overflow-y-auto animate-fadeIn text-stone-200 text-xs">
            
            {/* Problem Statement Card */}
            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-amber-400 block">
                The Core Problem Statement Solved
              </span>
              <p className="text-sm text-stone-100 font-serif leading-relaxed">
                "{currentBookAudio.problemStatement}"
              </p>
            </div>

            {/* Sacred Narrative & Summary */}
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-stone-400 block">
                Narrative Summary & Methodology
              </span>
              <p className="text-stone-300 leading-relaxed font-light text-xs sm:text-sm">
                {currentBookAudio.summaryStory}
              </p>
            </div>

            {/* Master's Key Direct Pointer */}
            <div className="p-4 rounded-2xl bg-[#1A1413] border border-stone-800 italic text-amber-200 leading-relaxed">
              "{currentBookAudio.masterQuote}"
              <span className="block not-italic text-stone-400 text-[10px] uppercase font-bold mt-2">
                — Master Gorli Peddi Raju Garu
              </span>
            </div>

            <div className="pt-2 flex justify-between items-center border-t border-stone-800">
              <button
                onClick={() => setActiveTab('player')}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs transition flex items-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Listen to 5-Min Preview</span>
              </button>

              <button
                onClick={handleUnlockFull}
                className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider transition shadow-md"
              >
                Unlock Full Audio (₹{currentBookAudio.price})
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
