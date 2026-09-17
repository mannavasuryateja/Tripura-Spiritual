import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, VolumeX, Pause, Play, Sliders } from 'lucide-react';

export const MusicControl: React.FC = () => {
  const { isMusicPlaying, isMusicMuted, musicVolume, toggleMusicPlay, toggleMusicMute, setMusicVolume, t } = useApp();
  const [showVolumePopover, setShowVolumePopover] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close popover on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowVolumePopover(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const volumePercent = Math.round(isMusicMuted ? 0 : (musicVolume / 0.4) * 100);

  return (
    <div ref={containerRef} className="relative inline-flex items-center gap-1.5">
      {/* Main Play/Pause Ambient Button */}
      <button
        onClick={toggleMusicPlay}
        className={`px-3.5 py-1.5 rounded-full text-[11px] font-medium tracking-[0.15em] uppercase border transition-all duration-300 flex items-center gap-1.5 ${
          isMusicPlaying
            ? 'bg-[#EFE9DD] text-[#2C2421] border-[#D1A559] shadow-xs'
            : 'bg-transparent text-[#5C534E] hover:text-[#2C2421] border-[#CFC5B6] hover:border-[#8B5E34]'
        }`}
        title={t.music.label}
      >
        <span className="text-xs">♪</span>
        <span>{isMusicPlaying ? t.music.playing : 'AMBIENT'}</span>
        {isMusicPlaying ? (
          <Pause className="w-3 h-3 text-[#8B5E34] ml-0.5" />
        ) : (
          <Play className="w-3 h-3 text-[#8B5E34] ml-0.5 fill-[#8B5E34]" />
        )}
      </button>

      {/* Volume Control Trigger Button (visible when playing) */}
      {isMusicPlaying && (
        <div className="relative">
          <button
            onClick={() => setShowVolumePopover(!showVolumePopover)}
            className={`p-1.5 rounded-full border transition-all ${
              showVolumePopover
                ? 'bg-[#3B234A] text-white border-[#3B234A]'
                : 'bg-[#FAF7F0] text-[#5C534E] hover:text-[#2C2421] border-[#D8CFBF]'
            }`}
            title="Adjust Ambient Volume"
            aria-label="Adjust Ambient Volume"
          >
            {isMusicMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-[#8B5E34]" />
            )}
          </button>

          {/* Volume Control Popover */}
          {showVolumePopover && (
            <div className="absolute right-0 top-10 bg-[#FAF7F0] p-4 rounded-2xl shadow-xl border border-[#D8CFBF] z-50 w-56 space-y-3 animate-fadeIn text-[#2C2421]">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#8B5E34]">
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Ambient Volume</span>
                </span>
                <span className="font-mono text-[11px] px-2 py-0.5 rounded-full bg-[#EFE9DD] font-bold">
                  {volumePercent}%
                </span>
              </div>

              {/* Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max="0.4"
                  step="0.02"
                  value={isMusicMuted ? 0 : musicVolume}
                  onChange={(e) => {
                    if (isMusicMuted) toggleMusicMute();
                    setMusicVolume(parseFloat(e.target.value));
                  }}
                  className="w-full h-1.5 bg-[#D8CFBF] rounded-lg appearance-none cursor-pointer accent-[#8B5E34]"
                />
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>Mute</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>
              </div>

              {/* Mute toggle button inside popover */}
              <div className="pt-2 border-t border-[#E6E0D2] flex justify-between items-center">
                <button
                  onClick={toggleMusicMute}
                  className={`text-xs font-semibold px-3 py-1 rounded-lg border transition flex items-center gap-1.5 ${
                    isMusicMuted
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-white border-[#D8CFBF] text-[#5C534E] hover:text-[#2C2421]'
                  }`}
                >
                  {isMusicMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  <span>{isMusicMuted ? 'Unmute' : 'Mute'}</span>
                </button>

                <button
                  onClick={() => setShowVolumePopover(false)}
                  className="text-[11px] text-stone-400 hover:text-stone-700 underline"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

