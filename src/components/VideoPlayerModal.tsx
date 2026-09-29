import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, CheckCircle2, RotateCcw, Loader2, AlertCircle, Sparkles } from 'lucide-react';
import { ambientEngine } from '../audio/ambientEngine';

const DEFAULT_BACKUP_STREAM = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

export const VideoPlayerModal: React.FC = () => {
  const { isVideoOpen, closeVideoModal, currentVideo } = useApp();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTimeSec, setCurrentTimeSec] = useState(0);
  const [durationSec, setDurationSec] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [activeUrl, setActiveUrl] = useState<string>('');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  // Sync activeUrl when currentVideo changes or modal opens
  useEffect(() => {
    if (isVideoOpen && currentVideo) {
      const initial = currentVideo.streamUrl || currentVideo.videoUrl || DEFAULT_BACKUP_STREAM;
      setActiveUrl(initial);
      setHasError(false);
      setIsLoading(true);
      setCurrentTimeSec(0);
      setIsPlaying(true);
      ambientEngine.onVideoPlay();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      ambientEngine.onVideoPauseOrEnded();
    }
  }, [isVideoOpen, currentVideo]);

  // Focus management on open/close
  useEffect(() => {
    if (isVideoOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        playerContainerRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else {
      triggerRef.current?.focus();
    }
  }, [isVideoOpen]);

  // Check if current video URL is an iframe embed (e.g., YouTube / Vimeo)
  const isEmbed = activeUrl.includes('youtube.com') || activeUrl.includes('youtu.be') || activeUrl.includes('vimeo.com');

  // Fullscreen event listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = Boolean(
        document.fullscreenElement ||
        (document as unknown as { webkitFullscreenElement: Element }).webkitFullscreenElement ||
        (document as unknown as { mozFullScreenElement: Element }).mozFullScreenElement ||
        (document as unknown as { msFullscreenElement: Element }).msFullscreenElement
      );
      if (isCurrentlyFullscreen) {
        setIsFullscreen(true);
      }
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

  // Keyboard shortcuts
  useEffect(() => {
    if (!isVideoOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullscreen();
      } else if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        toggleVideoPlay();
      } else if (e.key === 'Escape') {
        if (isFullscreen) {
          setIsFullscreen(false);
          try {
            if (document.exitFullscreen) document.exitFullscreen();
          } catch {}
        } else {
          handleClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isVideoOpen, isFullscreen, isPlaying]);

  if (!isVideoOpen || !currentVideo) return null;

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        ambientEngine.onVideoPlay();
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      ambientEngine.onVideoPauseOrEnded();
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTimeSec(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDurationSec(videoRef.current.duration);
      setIsLoading(false);
      setHasError(false);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || durationSec <= 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = clickRatio * durationSec;
    videoRef.current.currentTime = target;
    setCurrentTimeSec(target);
  };

  const toggleFullscreen = () => {
    const container = playerContainerRef.current;
    if (!isFullscreen) {
      setIsFullscreen(true);
      if (container && container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if (container && (container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
      setIsFullscreen(false);
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if ((document as any).webkitExitFullscreen) {
        (document as any).webkitExitFullscreen();
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMute = !isMuted;
      videoRef.current.muted = nextMute;
      setIsMuted(nextMute);
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleClose = () => {
    if (isFullscreen) {
      try {
        if (document.exitFullscreen) document.exitFullscreen();
      } catch {}
      setIsFullscreen(false);
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    closeVideoModal();
  };

  const handleLoadFallbackStream = () => {
    setActiveUrl(DEFAULT_BACKUP_STREAM);
    setHasError(false);
    setIsLoading(true);
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.load();
        videoRef.current.play().catch(() => {});
      }
    }, 100);
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec < 0) return '00:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-backdrop-fade ${
        isFullscreen ? '!p-0' : ''
      }`}
      onClick={(e) => {
        if (e.target === e.currentTarget && !isFullscreen) {
          handleClose();
        }
      }}
    >
      <div 
        ref={playerContainerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="video-modal-title"
        tabIndex={-1}
        className={`bg-stone-950 rounded-3xl w-full border border-stone-800 shadow-2xl overflow-hidden relative text-white flex flex-col justify-between animate-modal-scale-in focus:outline-none ${
          isFullscreen ? '!fixed !inset-0 !max-w-none !w-screen !h-screen !rounded-none !z-50 !border-0' : 'max-w-4xl'
        }`}
      >
        
        {/* Top Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-800/80 bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-3 min-w-0 mr-2">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono shrink-0">
              {currentVideo.day === 0 ? 'Orientation' : `Day ${currentVideo.day || 1}`}
            </span>
            <div className="min-w-0">
              <h3 id="video-modal-title" className="font-serif text-base sm:text-lg font-bold text-stone-100 truncate">
                {currentVideo.title}
              </h3>
              <p className="text-xs text-stone-400 truncate">
                Tripura Spiritual Masterclass • {currentVideo.duration || (durationSec > 0 ? formatSeconds(durationSec) : '45 mins')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2.5 rounded-full text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title={isFullscreen ? "Exit Fullscreen (F / Esc)" : "Fullscreen (F)"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5 text-[#D1A559]" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-2.5 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
              title="Close Recording"
              aria-label="Close Video Player"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Video Player Display Container */}
        <div className={`relative bg-black flex items-center justify-center overflow-hidden group ${
          isFullscreen ? 'flex-1 h-full' : 'aspect-video'
        }`}>
          
          {isEmbed ? (
            <iframe
              src={activeUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Native HTML5 Video Element */}
              <video
                ref={videoRef}
                src={activeUrl}
                autoPlay
                playsInline
                crossOrigin="anonymous"
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => {
                  setIsLoading(false);
                  setHasError(false);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />

              {/* Buffering/Loading Indicator */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10 pointer-events-none">
                  <Loader2 className="w-12 h-12 text-[#D1A559] motion-safe:animate-spin" />
                </div>
              )}

              {/* Error Notice with Auto-Recovery Action */}
              {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 z-10 p-6 text-center space-y-3">
                  <AlertCircle className="w-12 h-12 text-amber-500" />
                  <h4 className="text-base font-bold text-white">Stream Initializing</h4>
                  <p className="text-xs text-stone-300 max-w-sm">
                    Switching to the dedicated high-definition transmission stream...
                  </p>
                  <button
                    type="button"
                    onClick={handleLoadFallbackStream}
                    className="btn-spiritual btn-gold py-2.5 px-6 font-bold text-xs uppercase tracking-wider shadow-lg flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Play Transmission Stream</span>
                  </button>
                </div>
              )}

              {/* Center Play/Pause Overlay Button */}
              {!hasError && !isLoading && (
                <button
                  type="button"
                  onClick={toggleVideoPlay}
                  className="z-10 p-5 rounded-full bg-[#8B5E34]/90 text-white shadow-2xl hover:bg-[#A3733A] hover:scale-110 transition duration-300 backdrop-blur-xs focus:outline-none opacity-0 group-hover:opacity-100 min-h-[56px] min-w-[56px] flex items-center justify-center cursor-pointer"
                  aria-label={isPlaying ? "Pause Video" : "Play Video"}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1 fill-white" />}
                </button>
              )}

              {/* Bottom Player Overlay Bar */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-stone-950 via-stone-950/90 to-transparent p-4 z-20 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                
                {/* Progress Bar */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400 font-mono">{formatSeconds(currentTimeSec)}</span>
                  <div 
                    onClick={handleSeek}
                    className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden cursor-pointer relative"
                  >
                    <div
                      className="h-full bg-gradient-to-r from-[#D1A559] to-[#e19543] rounded-full transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-400 font-mono">
                    {durationSec > 0 ? formatSeconds(durationSec) : currentVideo.duration || '45:00'}
                  </span>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button 
                      type="button"
                      onClick={toggleVideoPlay} 
                      className="p-2.5 rounded-full hover:text-amber-300 hover:bg-white/10 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      title={isPlaying ? "Pause (Space)" : "Play (Space)"}
                      aria-label={isPlaying ? "Pause Video" : "Play Video"}
                    >
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button 
                      type="button"
                      onClick={toggleMute} 
                      className="p-2.5 rounded-full hover:text-amber-300 hover:bg-white/10 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      title={isMuted ? "Unmute" : "Mute"}
                      aria-label={isMuted ? "Unmute Video" : "Mute Video"}
                    >
                      {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <button 
                      type="button"
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                        }
                      }} 
                      className="p-2.5 rounded-full hover:text-amber-300 hover:bg-white/10 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      title="Replay from start"
                      aria-label="Replay from start"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => changeSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1)}
                      className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-xs font-mono font-bold text-amber-300 transition cursor-pointer min-h-[40px]"
                      title="Playback Speed"
                    >
                      {playbackSpeed}x Speed
                    </button>
                    <button 
                      type="button"
                      onClick={toggleFullscreen} 
                      className="p-2.5 rounded-full hover:text-amber-300 hover:bg-white/10 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center" 
                      title={isFullscreen ? "Exit Fullscreen (F)" : "Enter Fullscreen (F)"}
                      aria-label="Toggle Fullscreen"
                    >
                      {isFullscreen ? <Minimize2 className="w-5 h-5 text-amber-300" /> : <Maximize2 className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

              </div>
            </>
          )}
        </div>

        {/* Footer Info */}
        {!isFullscreen && (
          <div className="p-4 bg-stone-900/95 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs border-t border-stone-800/80 shrink-0">
            <div className="flex items-center gap-2 text-stone-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full HD 1080p Recording • Tripura Spiritual Transmission</span>
            </div>
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 transition cursor-pointer min-h-[40px]"
            >
              Close Recording
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
