import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Minimize2, CheckCircle2, RotateCcw, Loader2, AlertCircle } from 'lucide-react';
import { ambientEngine } from '../audio/ambientEngine';

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

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

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
  const streamSource = currentVideo?.streamUrl || currentVideo?.videoUrl || '';
  const isEmbed = streamSource.includes('youtube.com') || streamSource.includes('youtu.be') || streamSource.includes('vimeo.com');

  useEffect(() => {
    if (isVideoOpen) {
      if (!streamSource) {
        setHasError(true);
        setIsLoading(false);
        return;
      }
      setIsPlaying(true);
      setCurrentTimeSec(0);
      setIsLoading(true);
      setHasError(false);
      ambientEngine.onVideoPlay();
    } else {
      if (videoRef.current) {
        videoRef.current.pause();
      }
      setIsPlaying(false);
      ambientEngine.onVideoPauseOrEnded();
    }
  }, [isVideoOpen, currentVideo, streamSource]);

  // Fullscreen event listener
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
      } else if (e.key === 'Escape' && !isFullscreen) {
        handleClose();
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
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      } else if ((container as any).webkitRequestFullscreen) {
        (container as any).webkitRequestFullscreen();
      }
    } else {
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
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
    closeVideoModal();
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = durationSec > 0 ? (currentTimeSec / durationSec) * 100 : 0;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-950/85 backdrop-blur-md animate-backdrop-fade"
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
        className={`bg-stone-900 rounded-3xl w-full border border-stone-800 shadow-2xl overflow-hidden relative text-white flex flex-col justify-between animate-modal-scale-in focus:outline-none ${
          isFullscreen ? 'fixed inset-0 max-w-none h-screen rounded-none z-50' : 'max-w-4xl'
        }`}
      >
        
        {/* Top Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-stone-800 bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold font-mono">
              {currentVideo.day === 0 ? 'Orientation' : `Day ${currentVideo.day || 1}`}
            </span>
            <div>
              <h3 id="video-modal-title" className="font-serif text-lg font-bold text-stone-100">
                {currentVideo.title}
              </h3>
              <p className="text-xs text-stone-400">
                Tripura Spiritual Masterclass • {currentVideo.duration || formatSeconds(durationSec)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFullscreen}
              className="p-2 rounded-full text-stone-400 hover:text-amber-300 hover:bg-stone-800 transition cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen (F / Esc)" : "Fullscreen (F)"}
              aria-label={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="p-2 rounded-full text-stone-400 hover:text-white hover:bg-stone-800 transition cursor-pointer"
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
              src={streamSource}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              {/* Native HTML5 Video Element */}
              <video
                ref={videoRef}
                src={streamSource}
                autoPlay
                playsInline
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onWaiting={() => setIsLoading(true)}
                onCanPlay={() => setIsLoading(false)}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onError={() => {
                  setIsLoading(false);
                  setHasError(true);
                }}
              />

              {/* Buffering/Loading Indicator */}
              {isLoading && !hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10 pointer-events-none">
                  <Loader2 className="w-12 h-12 text-amber-400 motion-safe:animate-spin" />
                </div>
              )}

              {/* Error Notice */}
              {hasError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10 p-6 text-center">
                  <AlertCircle className="w-12 h-12 text-rose-500 mb-2" />
                  <h4 className="text-base font-bold text-white">Video stream unavailable</h4>
                  <p className="text-xs text-stone-400 mt-1 max-w-sm">
                    The requested session video stream could not be loaded or your session access may have expired.
                  </p>
                </div>
              )}

              {/* Center Play/Pause Overlay Button */}
              {!hasError && (
                <button
                  onClick={toggleVideoPlay}
                  className="z-10 p-5 rounded-full bg-amber-600/90 text-white shadow-2xl hover:scale-110 transition duration-300 backdrop-blur-xs focus:outline-none opacity-0 group-hover:opacity-100"
                  aria-label={isPlaying ? "Pause Video" : "Play Video"}
                >
                  {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
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
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-150"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-400 font-mono">
                    {durationSec > 0 ? formatSeconds(durationSec) : currentVideo.duration || '00:00'}
                  </span>
                </div>

                {/* Bottom Controls */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3">
                    <button onClick={toggleVideoPlay} className="p-1.5 hover:text-amber-400 transition" title={isPlaying ? "Pause (Space)" : "Play (Space)"}>
                      {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                    </button>
                    <button onClick={toggleMute} className="p-1.5 hover:text-amber-400 transition" title={isMuted ? "Unmute" : "Mute"}>
                      {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                    <button 
                      onClick={() => {
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                        }
                      }} 
                      className="p-1.5 hover:text-amber-400 transition" 
                      title="Replay from start"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => changeSpeed(playbackSpeed === 1 ? 1.25 : playbackSpeed === 1.25 ? 1.5 : 1)}
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
            </>
          )}
        </div>

        {/* Footer Info */}
        {!isFullscreen && (
          <div className="p-4 bg-stone-900 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs border-t border-stone-800 shrink-0">
            <div className="flex items-center gap-2 text-stone-400">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Full HD 1080p Recording • Tripura Spiritual Transmission</span>
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
