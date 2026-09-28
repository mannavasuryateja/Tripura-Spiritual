import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Language } from '../i18n';
import { getTranslation } from '../i18n';
import { en } from '../i18n/en';
import { ambientEngine } from '../audio/ambientEngine';
import { authApi, setUnauthorizedHandler, getApiErrorMessage } from '../api/client';
import { useBodyScrollLock } from '../hooks/useBodyScrollLock';

export type AppRole = 'ROLE_SEEKER' | 'ROLE_ENROLLED' | 'ROLE_ADMIN' | 'ROLE_MASTER';

export interface UserSubscription {
  hasActivePlan: boolean;
  planId: string | null;
  planName: string;
  planType?: 'live' | 'extension' | 'recordings-only' | 'demo';
  validUntil: string;
  unlockedDays: number[];
  whatsappLink?: string;
}

export interface UserProfile {
  id?: number;
  isLoggedIn: boolean;
  phone: string;
  email?: string;
  name: string;
  role: AppRole;
  subscription: UserSubscription;
}

export interface PlanItem {
  id: string;
  name: string;
  price: number;
  type: 'live-session' | 'recording-extension' | 'recordings-only' | 'plan' | 'demo' | '1on1' | 'book-audio';
  details?: string;
  validityDays?: number;
  sessionId?: number;
  bookId?: number;
  bookingId?: number;
}

export interface VideoItem {
  day?: number;
  title: string;
  duration?: string;
  videoUrl?: string;
  desc?: string;
  bunnyVideoId?: string;
  streamUrl?: string;
}

export interface BookChapter {
  id?: number;
  episodeNumber?: number;
  title: string;
  duration: string;
  durationSeconds?: number;
  audioUrl?: string;
  videoUrl?: string;
  isFree?: boolean;
  description?: string;
}

export interface BookItem {
  id: number | string;
  slug?: string;
  title: string;
  teluguTitle?: string;
  author: string;
  tag?: string;
  duration?: string;
  episodesCount: number;
  price: number;
  coverImage: string;
  problemStatement?: string;
  synopsis?: string;
  summaryStory?: string;
  masterQuote?: string;
  previewDurationMinutes?: number;
  isPublished?: boolean;
  chapters?: BookChapter[];
  episodes?: BookChapter[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
  user: UserProfile;
  refreshUserProfile: () => Promise<void>;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtpAndLogin: (phone: string, otpCode: string) => Promise<boolean>;
  loginWithEmailPassword: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signUpWithEmailPassword: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  hasRole: (roles: AppRole | AppRole[]) => boolean;

  // Auth Modal
  isAuthOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Payment Modal
  isPaymentOpen: boolean;
  pendingPlan: PlanItem | null;
  openPaymentModal: (plan: PlanItem) => void;
  closePaymentModal: () => void;

  // Video Player Modal
  isVideoOpen: boolean;
  currentVideo: VideoItem | null;
  openVideoModal: (video: VideoItem) => void;
  closeVideoModal: () => void;

  // Book Library Drawer & Audio Podcast Player
  isBookDrawerOpen: boolean;
  openBookDrawer: (book?: BookItem) => void;
  closeBookDrawer: () => void;
  selectedBook: BookItem | null;
  setSelectedBook: (book: BookItem | null) => void;
  isBookAudioOpen: boolean;
  currentBookAudio: BookItem | null;
  initialEpisodeId?: string | number | null;
  openBookAudioPlayer: (book: BookItem, initialEpisodeId?: string | number) => void;
  closeBookAudioPlayer: () => void;
  unlockedBooks: (string | number)[];
  refreshUnlockedBooks: () => Promise<void>;

  // Ambient Audio
  isMusicPlaying: boolean;
  isMusicMuted: boolean;
  musicVolume: number;
  toggleMusicPlay: () => void;
  toggleMusicMute: () => void;
  setMusicVolume: (vol: number) => void;

  // Login Success Transition State
  isLoginTransitionActive: boolean;
  triggerLoginSuccessTransition: () => void;
  completeLoginSuccessTransition: () => void;
}

export const defaultGuestUser: UserProfile = {
  isLoggedIn: false,
  phone: "",
  name: "Guest Seeker",
  role: "ROLE_SEEKER",
  subscription: {
    hasActivePlan: false,
    planId: null,
    planName: "No Active Subscription",
    validUntil: "N/A",
    unlockedDays: [1, 2]
  }
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Language state
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('tripura_lang') as Language) || 'en';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('tripura_lang', lang);
  };

  const t = getTranslation(language);

  // 2. User Authentication State (Database & JWT Backed)
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tripura_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.isLoggedIn) {
          return parsed;
        }
      } catch {}
    }
    return defaultGuestUser;
  });

  const [unlockedBooks, setUnlockedBooks] = useState<(string | number)[]>([]);

  // Function to refresh user profile & entitlements from backend /api/auth/me
  const refreshUserProfile = useCallback(async () => {
    try {
      const data = await authApi.getMe();
      if (data) {
        const profile: UserProfile = {
          id: data.id,
          isLoggedIn: true,
          email: data.email,
          phone: data.phone || '',
          name: data.name || 'Seeker',
          role: (data.role as AppRole) || 'ROLE_SEEKER',
          subscription: {
            hasActivePlan: data.hasActivePlan ?? false,
            planId: data.hasActivePlan ? 'active-plan' : null,
            planName: data.planName || 'Free Orientation Mode',
            validUntil: data.validUntil || 'Active',
            unlockedDays: data.unlockedDays || [1, 2],
            whatsappLink: data.whatsappCommunityUrl
          }
        };
        setUser(profile);
        localStorage.setItem('tripura_user', JSON.stringify(profile));
        if (data.unlockedBookIds) {
          setUnlockedBooks(data.unlockedBookIds);
        }
      }
    } catch {
      // If 401 or not logged in, user remains guest or session expires
    }
  }, []);

  const refreshUnlockedBooks = useCallback(async () => {
    if (user.isLoggedIn) {
      await refreshUserProfile();
    }
  }, [user.isLoggedIn, refreshUserProfile]);

  // Check auth session on startup
  useEffect(() => {
    refreshUserProfile();
  }, [refreshUserProfile]);

  // Listen for global 401 Unauthorized
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(defaultGuestUser);
      localStorage.removeItem('tripura_user');
      localStorage.removeItem('tripura_token');
    });
  }, []);

  // Sync user state changes to localStorage for token continuity
  useEffect(() => {
    if (user.isLoggedIn) {
      localStorage.setItem('tripura_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('tripura_user');
    }
  }, [user]);

  // Transition state
  const [isLoginTransitionActive, setIsLoginTransitionActive] = useState(false);
  const triggerLoginSuccessTransition = () => setIsLoginTransitionActive(true);
  const completeLoginSuccessTransition = () => setIsLoginTransitionActive(false);

  // Authentication Handlers
  const sendOtp = async (phone: string): Promise<{ success: boolean; message: string }> => {
    try {
      const data = await authApi.sendOtp({ phone });
      return { success: true, message: data?.message || `OTP sent to +91 ${phone}` };
    } catch (err: any) {
      const errorMsg = getApiErrorMessage(err, 'Failed to send OTP.');
      throw new Error(errorMsg);
    }
  };

  const verifyOtpAndLogin = async (phone: string, otpCode: string): Promise<boolean> => {
    try {
      const data = await authApi.verifyOtp({ phone, otpCode });
      if (data) {
        if (data.token) {
          localStorage.setItem('tripura_token', data.token);
        }
        await refreshUserProfile();
        setIsAuthOpen(false);
        triggerLoginSuccessTransition();
        return true;
      }
    } catch (err: any) {
      const errorMsg = getApiErrorMessage(err, 'Invalid or expired OTP code.');
      throw new Error(errorMsg);
    }
    return false;
  };

  const loginWithEmailPassword = async (email: string, password: string, rememberMe?: boolean): Promise<boolean> => {
    try {
      const data = await authApi.login({ email, password, rememberMe: !!rememberMe });
      if (data) {
        if (data.token) {
          localStorage.setItem('tripura_token', data.token);
        }
        await refreshUserProfile();
        triggerLoginSuccessTransition();
        return true;
      }
    } catch (err: any) {
      const errorMsg = getApiErrorMessage(err, 'Invalid email or password.');
      throw new Error(errorMsg);
    }
    return false;
  };

  const signUpWithEmailPassword = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const data = await authApi.signup({ name, email, password, phone: phone?.trim() || undefined });
      if (data) {
        if (data.token) {
          localStorage.setItem('tripura_token', data.token);
        }
        // Set immediate profile state for seamless session continuity
        const profile: UserProfile = {
          id: data.userId,
          isLoggedIn: true,
          email: data.email,
          phone: data.phone || '',
          name: data.name || name || 'Seeker',
          role: (data.role as AppRole) || 'ROLE_SEEKER',
          subscription: {
            hasActivePlan: data.hasActivePlan ?? false,
            planId: data.hasActivePlan ? 'active-plan' : null,
            planName: data.planName || 'Free Orientation Mode',
            validUntil: 'Active',
            unlockedDays: [1, 2],
            whatsappLink: undefined
          }
        };
        setUser(profile);
        localStorage.setItem('tripura_user', JSON.stringify(profile));

        // Refresh extended profile from /api/auth/me without blocking registration
        try {
          await refreshUserProfile();
        } catch (profileErr) {
          console.warn('Post-signup profile refresh deferred:', profileErr);
        }

        triggerLoginSuccessTransition();
        return true;
      }
    } catch (err: any) {
      const errorMsg = getApiErrorMessage(err, "We couldn't create your account right now. Please try again.");
      throw new Error(errorMsg);
    }
    return false;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {}
    setUser(defaultGuestUser);
    setUnlockedBooks([]);
    localStorage.removeItem('tripura_user');
    localStorage.removeItem('tripura_token');
  };

  const hasRole = (roles: AppRole | AppRole[]): boolean => {
    if (!user.isLoggedIn) return false;
    const currentRole = user.role || 'ROLE_SEEKER';
    if (currentRole === 'ROLE_ADMIN' || currentRole === 'ROLE_MASTER') return true;
    if (Array.isArray(roles)) {
      return roles.includes(currentRole);
    }
    return roles === currentRole;
  };

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const openAuthModal = () => setIsAuthOpen(true);
  const closeAuthModal = () => setIsAuthOpen(false);

  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<PlanItem | null>(null);

  const openPaymentModal = (plan: PlanItem) => {
    setPendingPlan(plan);
    setIsPaymentOpen(true);
  };

  const closePaymentModal = () => {
    setIsPaymentOpen(false);
    setPendingPlan(null);
  };

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);

  const openVideoModal = (video: VideoItem) => {
    setCurrentVideo(video);
    setIsVideoOpen(true);
    ambientEngine.onVideoPlay();
  };

  const closeVideoModal = () => {
    setIsVideoOpen(false);
    setCurrentVideo(null);
    ambientEngine.onVideoPauseOrEnded();
  };

  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isBookAudioOpen, setIsBookAudioOpen] = useState(false);
  const [currentBookAudio, setCurrentBookAudio] = useState<BookItem | null>(null);
  const [initialEpisodeId, setInitialEpisodeId] = useState<string | number | null>(null);

  const openBookDrawer = (book?: BookItem) => {
    if (book) setSelectedBook(book);
    setIsBookDrawerOpen(true);
  };

  const closeBookDrawer = () => {
    setIsBookDrawerOpen(false);
  };

  const openBookAudioPlayer = (book: BookItem, episodeId?: string | number) => {
    setCurrentBookAudio(book);
    setInitialEpisodeId(episodeId !== undefined ? episodeId : null);
    setIsBookAudioOpen(true);
    ambientEngine.onVideoPlay();
  };

  const closeBookAudioPlayer = () => {
    setIsBookAudioOpen(false);
    setCurrentBookAudio(null);
    setInitialEpisodeId(null);
    ambientEngine.onVideoPauseOrEnded();
  };

  // Guaranteed body scroll lock cleanup
  const isAnyModalActive = isAuthOpen || isPaymentOpen || isVideoOpen || isBookDrawerOpen || isBookAudioOpen;
  useBodyScrollLock(isAnyModalActive);

  // Global ESC key listener to close modals
  useEffect(() => {
    const handleGlobalEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (isPaymentOpen) closePaymentModal();
        else if (isAuthOpen) closeAuthModal();
        else if (isVideoOpen) closeVideoModal();
        else if (isBookAudioOpen) closeBookAudioPlayer();
        else if (isBookDrawerOpen) closeBookDrawer();
      }
    };
    window.addEventListener('keydown', handleGlobalEsc);
    return () => window.removeEventListener('keydown', handleGlobalEsc);
  }, [isPaymentOpen, isAuthOpen, isVideoOpen, isBookAudioOpen, isBookDrawerOpen]);

  // Ambient audio control
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [musicVolume, setMusicVolumeState] = useState(0.15);

  const toggleMusicPlay = () => {
    const playing = ambientEngine.togglePlay();
    setIsMusicPlaying(playing);
  };

  const toggleMusicMute = () => {
    const muted = ambientEngine.toggleMute();
    setIsMusicMuted(muted);
  };

  const setMusicVolume = (vol: number) => {
    setMusicVolumeState(vol);
    ambientEngine.setVolume(vol);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        refreshUserProfile,
        sendOtp,
        verifyOtpAndLogin,
        loginWithEmailPassword,
        signUpWithEmailPassword,
        logout,
        hasRole,
        isAuthOpen,
        openAuthModal,
        closeAuthModal,
        isPaymentOpen,
        pendingPlan,
        openPaymentModal,
        closePaymentModal,
        isVideoOpen,
        currentVideo,
        openVideoModal,
        closeVideoModal,
        isBookDrawerOpen,
        openBookDrawer,
        closeBookDrawer,
        selectedBook,
        setSelectedBook,
        isBookAudioOpen,
        currentBookAudio,
        initialEpisodeId,
        openBookAudioPlayer,
        closeBookAudioPlayer,
        unlockedBooks,
        refreshUnlockedBooks,
        isMusicPlaying,
        isMusicMuted,
        musicVolume,
        toggleMusicPlay,
        toggleMusicMute,
        setMusicVolume,
        isLoginTransitionActive,
        triggerLoginSuccessTransition,
        completeLoginSuccessTransition
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
