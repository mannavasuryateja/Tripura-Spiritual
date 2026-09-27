import { useEffect } from 'react';

/**
 * Global lock counter to handle multiple nested modals/drawers cleanly
 * without leaving document.body.style.overflow locked.
 */
let lockCount = 0;
let originalBodyOverflow = '';
let originalDocOverflow = '';

export const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return;

    if (lockCount === 0) {
      originalBodyOverflow = document.body.style.overflow;
      originalDocOverflow = document.documentElement.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    lockCount++;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = originalBodyOverflow;
        document.documentElement.style.overflow = originalDocOverflow;
      }
    };
  }, [isLocked]);
};

export const forceRestoreScroll = () => {
  lockCount = 0;
  document.body.style.overflow = '';
  document.documentElement.style.overflow = '';
};
