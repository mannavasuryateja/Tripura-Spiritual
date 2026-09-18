import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';
import { ambientEngine } from '../audio/ambientEngine';

export const VideoPlayerModal: React.FC = () => {
  const { isVideoOpen, closeVideoModal, currentVideo } = useApp();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(15);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isVideoOpen) {
      setIsPlaying(true);
      setProgress(15);
      // Auto pause ambient music when video opens
      ambientEngine.onVideoPlay();
    }
  }, [isVideoOpen]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement: Element }).msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, []);

  // Keyboard shortcuts (F for fullscreen, Space for play/pause, Escape to close if not fullscreen)
  useEffect(() => {
    if (!isVideoOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleVideoPlay();
      } else if (e.key === 'Escape' && !isFullscreen) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoOpen, isFullscreen, isPlaying]);

  if (!isVideoOpen || !currentVideo) return null;

  const toggleVideoPlay = () => {
    setIsPlaying(prev => {
      const next = !prev;
      if (next) {
        ambientEngine.onVideoPlay();
      } else {
        ambientEngine.onVideoPauseOrEnded();
      }
      return next;
    });
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(err => console.error("Fullscreen error:", err));
      } else if ((container as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen) {
        (container as unknown as { webkitRequestFullscreen: () => Promise<void> }).webkitRequestFullscreen();
      } else if ((container as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen) {
        (container as unknown as { mozRequestFullScreen: () => Promise<void> }).mozRequestFullScreen();
      } else if ((container as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen) {
        (container as unknown as { msRequestFullscreen: () => Promise<void> }).msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error("Exit fullscreen error:", err));
      } else if ((document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen) {
        (document as unknown as { webkitExitFullscreen: () => Promise<void> }).webkitExitFullscreen();
      } else if ((document as unknown as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen) {
        (document as unknown as { mozCancelFullScreen: () => Promise<void> }).mozCancelFullScreen();
      } else if ((document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen) {
        (document as unknown as { msExitFullscreen: () => Promise<void> }).msExitFullscreen();
      }
    }
  };

  const handleClose = () => {
    if (isFullscreen) {
      try {
        if (document.exitFullscreen) document.exitFullscreen();
      } catch {}
    }
    closeVideoModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-fadeIn">
      <div 
        ref={playerContainerRef}
        className={`bg-stone-900 rounded-3xl w-full border border-stone-800 shadow-2xl overflow-hidden relative text-white flex flex-col justify-between ${
          isFullscreen ? 'fixed inset-0 max-w-none h-screen rounded-none z-50' : 'max-w-4xl'
        }`}
      >
        
        {/* Top Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-800 bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
              {currentVideo.day === 0 ? 'Orientation' : `Day ${currentVideo.day}`}
            </span>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100">
                {currentVideo.title}
              </h3>
              <p className="text-xs text-stone-400">
                Tripura Spiritual Masterclass • {currentVideo.duration}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-full text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition"
              title={isFullscreen ? "Exit Fullscreen (F / Esc)" : "Fullscreen (F)"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              onClick={handleClose}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition"
              title="Close Recording"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Player Display Container */}
        <div className={`relative bg-black flex items-center justify-center overflow-hidden group ${
          isFullscreen ? 'flex-1 h-full' : 'aspect-video'
        }`}>
          
          {/* Animated Spiritual Video Player Simulation Canvas */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-950/80 via-stone-950 to-orange-950/80 flex flex-col items-center justify-center p-8 text-center select-none">
            {/* Visual Lotus & Aura pulse animation */}
            <div className={`relative flex items-center justify-center transition-transform duration-700 ${isPlaying ? 'scale-110' : 'scale-95 opacity-80'}`}>
              <div className={`absolute w-52 h-52 rounded-full bg-amber-500/20 blur-2xl ${isPlaying ? 'animate-ping' : ''}`}></div>
              <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-5xl shadow-2xl shadow-amber-500/30 border-2 border-amber-300/40">
                🪷
              </div>
            </div>

            <div className="mt-6 space-y-2 max-w-md">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>HD Spiritual Audio & Video Recording</span>
              </span>
              <p className="text-sm font-serif text-amber-100 font-medium">
                "{currentVideo.desc || 'Awakening Consciousness through Daily Guided Meditation and Practice.'}"
              </p>
            </div>
          </div>

          {/* Center Play/Pause Overlay */}
          <button
            onClick={toggleVideoPlay}
            className="z-10 p-5 rounded-full bg-amber-600/90 text-white shadow-2xl hover:scale-110 transition duration-300 backdrop-blur-xs focus:outline-none"
            aria-label={isPlaying ? "Pause Video" : "Play Video"}
          >
            {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          {/* Notification: Ambient Music Paused */}
          <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-amber-500/30 text-[11px] text-amber-300 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
            <span>Background music paused during video playback</span>
          </div>

          {/* Bottom Player Overlay Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent p-4 z-20 space-y-2">
            
            {/* Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs text-stone-400 font-mono">06:45</span>
              <div 
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const clickX = e.clientX - rect.left;
                  setProgress(Math.round((clickX / rect.width) * 100));
                }}
                className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden cursor-pointer relative"
              >
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-xs text-stone-400 font-mono">{currentVideo.duration}</span>
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-3">
                <button onClick={toggleVideoPlay} className="p-1.5 hover:text-amber-400 transition" title={isPlaying ? "Pause (Space)" : "Play (Space)"}>
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <button onClick={() => setIsMuted(!isMuted)} className="p-1.5 hover:text-amber-400 transition" title={isMuted ? "Unmute" : "Mute"}>
                  {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <button onClick={() => setProgress(0)} className="p-1.5 hover:text-amber-400 transition" title="Replay">
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-3">
                {/* Speed selector */}
                <button
                  onClick={() => setPlaybackSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1)}
                  className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-xs font-mono font-bold text-amber-300 transition"
                  title="Playback Speed"
                >
                  {playbackSpeed}x Speed
                </button>
                <button 
                  onClick={toggleFullscreen} 
                  className="p-1.5 hover:text-amber-400 transition" 
                  title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
                >
                  {isFullscreen ? <Minimize2 className="w-5 h-5 text-amber-300" /> : <Maximize2 className="w-5 h-5" />}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Footer Info (Hidden in fullscreen for cinematic experience) */}
        {!isFullscreen && (
          <div className="p-4 bg-stone-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs border-t border-stone-800 shrink-0">
            <div className="flex items-center gap-2 text-stone-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full HD 1080p Recording • Dual Audio (English & Telugu)</span>
            </div>
            <button
              onClick={handleClose}
              className="px-4 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 transition"
            >
              Close Recording
            </button>
          </div>
        )}

      </div>
    </div>
  );
};

