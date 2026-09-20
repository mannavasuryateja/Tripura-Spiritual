import React, { useEffect, useRef, useState } from 'react';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fade-up' | 'hero-zoom' | 'image-zoom' | 'fade';
  variant?: 'fade-up' | 'hero-zoom' | 'image-zoom' | 'fade';
  delay?: number; // delay in ms
  duration?: number; // duration in ms
  threshold?: number;
  once?: boolean;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className = '',
  animation,
  variant,
  delay = 0,
  duration = 750,
  threshold = 0.12,
  once = true,
}) => {
  const activeAnimation = variant || animation || 'fade-up';
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check user preference for reduced motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = () => setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    const currentRef = domRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (once && currentRef) {
              observer.unobserve(currentRef);
            }
          } else if (!once) {
            setIsVisible(false);
          }
        });
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    observer.observe(currentRef);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [once, threshold]);

  // Style generation based on state & animation variant
  const getStyle = (): React.CSSProperties => {
    if (prefersReducedMotion) {
      return {
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${Math.min(duration, 300)}ms ease-out`,
        transitionDelay: `${delay}ms`,
      };
    }

    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)';
    const transitionStr = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;

    if (!isVisible) {
      switch (activeAnimation) {
        case 'hero-zoom':
          return {
            opacity: 0,
            transform: 'translateY(30px) scale(0.98)',
            transition: transitionStr,
            transitionDelay: `${delay}ms`,
            willChange: 'opacity, transform',
          };
        case 'image-zoom':
          return {
            opacity: 0,
            transform: 'scale(0.98)',
            transition: transitionStr,
            transitionDelay: `${delay}ms`,
            willChange: 'opacity, transform',
          };
        case 'fade':
          return {
            opacity: 0,
            transition: `opacity ${duration}ms ${easing}`,
            transitionDelay: `${delay}ms`,
            willChange: 'opacity',
          };
        case 'fade-up':
        default:
          return {
            opacity: 0,
            transform: 'translateY(25px)',
            transition: transitionStr,
            transitionDelay: `${delay}ms`,
            willChange: 'opacity, transform',
          };
      }
    }

    return {
      opacity: 1,
      transform: 'translateY(0) scale(1)',
      transition: transitionStr,
      transitionDelay: `${delay}ms`,
      willChange: 'opacity, transform',
    };
  };

  return (
    <div ref={domRef} className={className} style={getStyle()}>
      {children}
    </div>
  );
};

/* Stagger Container and Item Utilities */
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number; // ms between items
  animation?: 'fade-up' | 'hero-zoom' | 'image-zoom' | 'fade';
  variant?: 'fade-up' | 'hero-zoom' | 'image-zoom' | 'fade';
  duration?: number;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  className = '',
  staggerDelay = 100,
  animation,
  variant,
  duration = 750,
}) => {
  const activeAnimation = variant || animation || 'fade-up';
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => {
        if (!React.isValidElement(child)) return child;
        return (
          <ScrollReveal
            animation={activeAnimation}
            delay={index * staggerDelay}
            duration={duration}
          >
            {child}
          </ScrollReveal>
        );
      })}
    </div>
  );
};
