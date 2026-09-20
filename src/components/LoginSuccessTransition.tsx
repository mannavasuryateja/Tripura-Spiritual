import React, { useEffect, useState } from 'react';

interface LoginSuccessTransitionProps {
  isActive: boolean;
  onComplete: () => void;
}

export const LoginSuccessTransition: React.FC<LoginSuccessTransitionProps> = ({ isActive, onComplete }) => {
  const [phase, setPhase] = useState<'idle' | 'start' | 'zoom' | 'fadeout'>('idle');
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    if (!isActive) {
      setPhase('idle');
      return;
    }

    if (prefersReducedMotion) {
      // Reduced motion mode: short simple fade transition
      setPhase('start');
      const timer = setTimeout(() => {
        onComplete();
      }, 500);
      return () => clearTimeout(timer);
    }

    // Extended Luxurious Cinematic Animation Timeline (~3.4s)
    // Step 1: Start overlay & wordmark in clear focus (0ms)
    setPhase('start');

    // Step 2: Hold steady focus so user clearly reads "TRIPURA", then begin zoom (800ms)
    const zoomTimer = setTimeout(() => {
      setPhase('zoom');
    }, 800);

    // Step 3: Fade out background overlay to reveal dashboard (2600ms)
    const fadeoutTimer = setTimeout(() => {
      setPhase('fadeout');
    }, 2600);

    // Step 4: Handover to interactive dashboard (3400ms)
    const completeTimer = setTimeout(() => {
      setPhase('idle');
      onComplete();
    }, 3400);

    return () => {
      clearTimeout(zoomTimer);
      clearTimeout(fadeoutTimer);
      clearTimeout(completeTimer);
    };
  }, [isActive, prefersReducedMotion, onComplete]);

  if (!isActive && phase === 'idle') return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-hidden pointer-events-auto transition-opacity duration-800 select-none ${
        phase === 'fadeout' ? 'opacity-0 pointer-events-none' : 'opacity-100'
      } bg-[#FAF8F3]`}
      aria-label="Tripura Login Transition"
      role="region"
    >
      {/* Warm Ambient Spiritual Radial Glow */}
      <div 
        className={`absolute w-[700px] h-[700px] rounded-full bg-gradient-to-r from-[#D1A559]/25 via-[#A3733A]/20 to-transparent blur-3xl pointer-events-none transition-all duration-1200 ${
          phase === 'zoom' ? 'scale-175 opacity-90' : 'scale-100 opacity-50'
        }`}
      />

      {/* Center Tripura Wordmark Container */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4">
        
        {/* Animated Brand Wordmark */}
        <div
          className="flex items-center justify-center transition-all ease-out"
          style={{
            transform: phase === 'zoom' 
              ? 'scale(2.8) translateZ(0)' 
              : phase === 'start' 
                ? 'scale(1) translateZ(0)' 
                : 'scale(0.85) translateZ(0)',
            opacity: phase === 'zoom' ? 0 : phase === 'start' ? 1 : 0,
            transitionDuration: phase === 'zoom' ? '2000ms' : '500ms',
            transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            willChange: 'transform, opacity'
          }}
        >
          <span className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-[0.3em] text-[#2C2421] drop-shadow-md">
            T R I P U R A
          </span>
          <span className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold text-[#D1A559] ml-2 drop-shadow-md">
            .
          </span>
        </div>

        {/* Spiritual Subtitle Tagline */}
        <div
          className="transition-all duration-700 ease-out mt-6"
          style={{
            opacity: phase === 'start' ? 0.95 : phase === 'zoom' ? 0.4 : 0,
            transform: phase === 'zoom' ? 'translateY(-15px) scale(1.08)' : 'translateY(0)',
            transitionDelay: '200ms',
            willChange: 'opacity, transform'
          }}
        >
          <p className="font-serif italic text-sm sm:text-base text-[#8B5E34] tracking-widest uppercase">
            Awakening Inner Presence
          </p>
          <div className="w-16 h-0.5 bg-[#D1A559] mx-auto mt-3 rounded-full opacity-70" />
        </div>

      </div>
    </div>
  );
};
