import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Language } from '../i18n';
import { getTranslation } from '../i18n';
import { en } from '../i18n/en';
import { ambientEngine } from '../audio/ambientEngine';

export interface UserSubscription {
  hasActivePlan: boolean;
  planId: string | null;
  planName: string;
  planType?: 'live' | 'extension' | 'recordings-only' | 'demo';
  validUntil: string;
  unlockedDays: number[]; // e.g. [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
  whatsappLink?: string;
}

export interface UserProfile {
  isLoggedIn: boolean;
  phone: string;
  name: string;
  subscription: UserSubscription;
}

export interface PlanItem {
  id: string;
  name: string;
  price: number;
  type: 'live-session' | 'recording-extension' | 'recordings-only' | 'plan' | 'demo' | '1on1' | 'book-audio';
  details?: string;
  validityDays?: number;
  whatsappLink?: string;
}

export interface VideoItem {
  day: number;
  title: string;
  duration: string;
  videoUrl?: string;
  desc?: string;
}

export interface BookItem {
  id: string;
  title: string;
  teluguTitle?: string;
  author: string;
  tag: string;
  duration: string;
  episodesCount: number;
  price: number;
  coverImage: string;
  synopsis: string;
  masterQuote: string;
  chapters: { title: string; duration: string; isFree?: boolean }[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
  user: UserProfile;
  login: (phone: string, name?: string) => void;
  logout: () => void;
  switchDemoUser: (phone: string) => void;
  
  // Auth Modal
  isAuthOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Payment Modal
  isPaymentOpen: boolean;
  pendingPlan: PlanItem | null;
  openPaymentModal: (plan: PlanItem) => void;
  closePaymentModal: () => void;
  completePayment: () => void;

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
  openBookAudioPlayer: (book: BookItem) => void;
  closeBookAudioPlayer: () => void;
  unlockedBooks: string[];
  unlockBookAudio: (bookId: string) => void;

  // Ambient Audio
  isMusicPlaying: boolean;
  isMusicMuted: boolean;
  musicVolume: number;
  toggleMusicPlay: () => void;
  toggleMusicMute: () => void;
  setMusicVolume: (vol: number) => void;

  // Admin Overrides
  adminOverrides: Record<string, number[]>;
  toggleAdminUserDayAccess: (phone: string, day: number) => void;
  resetDemoState: () => void;
}

// Default WhatsApp Community Link
export const TRIPURA_WHATSAPP_COMMUNITY_URL = "https://chat.whatsapp.com/GHY78TripuraMasterclassLive";

// Preset Demo Users
const SUBSCRIBED_USER_PHONE = '9999999999';
const RESTRICTED_USER_PHONE = '8888888888';

const defaultSubscribedUser: UserProfile = {
  isLoggedIn: true,
  phone: SUBSCRIBED_USER_PHONE,
  name: "Ananya Sharma (Live Attendee)",
  subscription: {
    hasActivePlan: true,
    planId: 'hanuman-kriya-live',
    planName: "Hanuman Kriya 11-Day Live Masterclass",
    planType: 'live',
    validUntil: "October 13, 2026 (Live + Recordings till Day 13)",
    unlockedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    whatsappLink: TRIPURA_WHATSAPP_COMMUNITY_URL
  }
};

const defaultRestrictedUser: UserProfile = {
  isLoggedIn: true,
  phone: RESTRICTED_USER_PHONE,
  name: "Vikram Kumar (New Seeker)",
  subscription: {
    hasActivePlan: false,
    planId: null,
    planName: "No Active Subscription",
    validUntil: "Orientation Unlocked",
    unlockedDays: [1, 2] // User B has sample access to Day 1 & 2
  }
};

const defaultGuestUser: UserProfile = {
  isLoggedIn: false,
  phone: "",
  name: "Guest Seeker",
  subscription: {
    hasActivePlan: false,
    planId: null,
    planName: "No Active Subscription",
    validUntil: "N/A",
    unlockedDays: []
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

  // 2. User & Subscription State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tripura_user');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return defaultSubscribedUser; // Default to Subscribed demo user for rich immediate view
  });

  useEffect(() => {
    localStorage.setItem('tripura_user', JSON.stringify(user));
  }, [user]);

  // Admin Granular Overrides for User A vs User B
  const [adminOverrides, setAdminOverrides] = useState<Record<string, number[]>>(() => {
    const saved = localStorage.getItem('tripura_admin_overrides');
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      [SUBSCRIBED_USER_PHONE]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [RESTRICTED_USER_PHONE]: [1, 2]
    };
  });

  useEffect(() => {
    localStorage.setItem('tripura_admin_overrides', JSON.stringify(adminOverrides));
  }, [adminOverrides]);

  // Sync admin overrides into active user state if changed
  useEffect(() => {
    if (user.phone && adminOverrides[user.phone]) {
      const activeUnlocked = adminOverrides[user.phone];
      setUser(prev => ({
        ...prev,
        subscription: {
          ...prev.subscription,
          unlockedDays: activeUnlocked
        }
      }));
    }
  }, [adminOverrides, user.phone]);

  // Authentication Handlers
  const login = (phone: string, name?: string) => {
    if (phone === SUBSCRIBED_USER_PHONE) {
      setUser({
        ...defaultSubscribedUser,
        subscription: {
          ...defaultSubscribedUser.subscription,
          unlockedDays: adminOverrides[SUBSCRIBED_USER_PHONE] || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        }
      });
    } else if (phone === RESTRICTED_USER_PHONE) {
      setUser({
        ...defaultRestrictedUser,
        subscription: {
          ...defaultRestrictedUser.subscription,
          unlockedDays: adminOverrides[RESTRICTED_USER_PHONE] || [1, 2]
        }
      });
    } else {
      setUser({
        isLoggedIn: true,
        phone,
        name: name || `Seeker (${phone.slice(-4)})`,
        subscription: {
          hasActivePlan: false,
          planId: null,
          planName: "No Active Subscription",
          validUntil: "Orientation Unlocked",
          unlockedDays: []
        }
      });
    }
    setIsAuthOpen(false);
  };

  const logout = () => {
    setUser(defaultGuestUser);
  };

  const switchDemoUser = (phone: string) => {
    login(phone);
  };

  // Auth Modal
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const openAuthModal = () => setIsAuthOpen(true);
  const closeAuthModal = () => setIsAuthOpen(false);

  // Payment Modal
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

  const completePayment = () => {
    if (!pendingPlan) return;
    
    // Ensure user is logged in
    const activePhone = user.isLoggedIn ? user.phone : '9999999999';
    const allDays = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    let validUntilText = "October 13, 2026 (Day 13)";
    let pType: 'live' | 'extension' | 'recordings-only' | 'demo' = 'live';

    if (pendingPlan.type === 'recording-extension' || pendingPlan.id.includes('extension')) {
      validUntilText = "21 Days Extended Access from Purchase (Till October 24, 2026)";
      pType = 'extension';
    } else if (pendingPlan.type === 'recordings-only' || pendingPlan.id.includes('recordings-only')) {
      validUntilText = "21 Days Recording Access from Purchase Date";
      pType = 'recordings-only';
    } else if (pendingPlan.type === 'book-audio') {
      unlockBookAudio(pendingPlan.id.replace('book-', ''));
      return;
    }

    const updatedSubscription: UserSubscription = {
      hasActivePlan: true,
      planId: pendingPlan.id,
      planName: pendingPlan.name,
      planType: pType,
      validUntil: validUntilText,
      unlockedDays: allDays,
      whatsappLink: TRIPURA_WHATSAPP_COMMUNITY_URL
    };

    setUser(prev => ({
      ...prev,
      isLoggedIn: true,
      phone: activePhone,
      name: prev.name || "Spiritual Seeker",
      subscription: updatedSubscription
    }));

    setAdminOverrides(prev => ({
      ...prev,
      [activePhone]: allDays
    }));
  };

  // Video Player Modal
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<VideoItem | null>(null);

  const openVideoModal = (video: VideoItem) => {
    setCurrentVideo(video);
    setIsVideoOpen(true);
    ambientEngine.onVideoPlay(); // Auto pause ambient music
  };

  const closeVideoModal = () => {
    setIsVideoOpen(false);
    setCurrentVideo(null);
    ambientEngine.onVideoPauseOrEnded(); // Resume ambient music
  };

  // Book Library Drawer & Audio Player State
  const [isBookDrawerOpen, setIsBookDrawerOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<BookItem | null>(null);
  const [isBookAudioOpen, setIsBookAudioOpen] = useState(false);
  const [currentBookAudio, setCurrentBookAudio] = useState<BookItem | null>(null);
  const [unlockedBooks, setUnlockedBooks] = useState<string[]>(() => {
    const saved = localStorage.getItem('tripura_unlocked_books');
    return saved ? JSON.parse(saved) : ['tripura-rahasya']; // 1st book unlocked as sample
  });

  const openBookDrawer = (book?: BookItem) => {
    if (book) setSelectedBook(book);
    setIsBookDrawerOpen(true);
  };

  const closeBookDrawer = () => {
    setIsBookDrawerOpen(false);
  };

  const openBookAudioPlayer = (book: BookItem) => {
    setCurrentBookAudio(book);
    setIsBookAudioOpen(true);
    ambientEngine.onVideoPlay(); // Pause ambient drone during audio discourse
  };

  const closeBookAudioPlayer = () => {
    setIsBookAudioOpen(false);
    setCurrentBookAudio(null);
    ambientEngine.onVideoPauseOrEnded(); // Resume ambient drone
  };

  const unlockBookAudio = (bookId: string) => {
    setUnlockedBooks(prev => {
      if (!prev.includes(bookId)) {
        const next = [...prev, bookId];
        localStorage.setItem('tripura_unlocked_books', JSON.stringify(next));
        return next;
      }
      return prev;
    });
  };

  // Ambient Audio State
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

  // Admin toggle specific user day access
  const toggleAdminUserDayAccess = (phone: string, day: number) => {
    setAdminOverrides(prev => {
      const currentDays = prev[phone] || [];
      const updatedDays = currentDays.includes(day)
        ? currentDays.filter(d => d !== day)
        : [...currentDays, day].sort((a, b) => a - b);
      return {
        ...prev,
        [phone]: updatedDays
      };
    });
  };

  const resetDemoState = () => {
    localStorage.removeItem('tripura_user');
    localStorage.removeItem('tripura_admin_overrides');
    localStorage.removeItem('tripura_unlocked_books');
    setUser(defaultSubscribedUser);
    setAdminOverrides({
      [SUBSCRIBED_USER_PHONE]: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
      [RESTRICTED_USER_PHONE]: [1, 2]
    });
    setUnlockedBooks(['tripura-rahasya']);
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        user,
        login,
        logout,
        switchDemoUser,
        isAuthOpen,
        openAuthModal,
        closeAuthModal,
        isPaymentOpen,
        pendingPlan,
        openPaymentModal,
        closePaymentModal,
        completePayment,
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
        openBookAudioPlayer,
        closeBookAudioPlayer,
        unlockedBooks,
        unlockBookAudio,
        isMusicPlaying,
        isMusicMuted,
        musicVolume,
        toggleMusicPlay,
        toggleMusicMute,
        setMusicVolume,
        adminOverrides,
        toggleAdminUserDayAccess,
        resetDemoState
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

