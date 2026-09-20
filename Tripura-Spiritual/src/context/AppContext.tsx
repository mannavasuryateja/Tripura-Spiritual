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
  email?: string;
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
  loginWithEmailPassword: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signUpWithEmailPassword: (name: string, email: string, password: string) => Promise<boolean>;
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

  // Login Success Transition State
  isLoginTransitionActive: boolean;
  triggerLoginSuccessTransition: () => void;
  completeLoginSuccessTransition: () => void;

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
      try {
        const parsed = JSON.parse(saved);
        // Clear legacy default user cache so new sessions start in Guest Mode
        if (parsed.phone === '9999999999' && !parsed.email) {
          localStorage.removeItem('tripura_user');
          return defaultGuestUser;
        }
        return parsed;
      } catch {}
    }
    return defaultGuestUser;
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

  // Login Transition State
  const [isLoginTransitionActive, setIsLoginTransitionActive] = useState(false);
  const triggerLoginSuccessTransition = () => setIsLoginTransitionActive(true);
  const completeLoginSuccessTransition = () => setIsLoginTransitionActive(false);

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
          unlockedDays: [1, 2]
        }
      });
    }
    setIsAuthOpen(false);
  };

  const loginWithEmailPassword = async (email: string, password: string, rememberMe?: boolean): Promise<boolean> => {
    let networkError = false;

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe: !!rememberMe })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('tripura_jwt_token', data.token);
        }
        setUser({
          isLoggedIn: true,
          email: data.email || email,
          phone: data.phone || '9999999999',
          name: data.name || email.split('@')[0],
          subscription: {
            hasActivePlan: data.hasActivePlan ?? true,
            planId: data.hasActivePlan ? 'hanuman-kriya-live' : null,
            planName: data.planName || (data.hasActivePlan ? "Hanuman Kriya Live Masterclass" : "Free Orientation Mode"),
            planType: 'live',
            validUntil: "October 13, 2026",
            unlockedDays: data.hasActivePlan ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [1, 2],
            whatsappLink: TRIPURA_WHATSAPP_COMMUNITY_URL
          }
        });
        return true;
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMsg = errorData?.message || 'Invalid email or password. Please try again.';
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      networkError = true;
    }

    // Only if backend network fetch is completely offline (development / local fallback mode)
    if (networkError) {
      const registeredAccounts = JSON.parse(localStorage.getItem('tripura_registered_accounts') || '[]');
      
      const defaultAccounts = [
        { email: 'suryateja@tripura.org', password: 'Password123!', name: 'Suryateja', phone: '9999999999', hasActivePlan: true },
        { email: 'google.seeker@tripura.org', password: 'GoogleAuth2026!', name: 'Google Seeker', phone: '9999999999', hasActivePlan: true },
        { email: 'demo@tripura.org', password: 'Password123!', name: 'Demo Seeker', phone: '8888888888', hasActivePlan: false }
      ];

      const allAccounts = [...defaultAccounts, ...registeredAccounts];
      const normalizedEmail = email.trim().toLowerCase();

      const matchedUser = allAccounts.find(
        acc => acc.email.toLowerCase() === normalizedEmail && acc.password === password
      );

      if (matchedUser) {
        const token = 'demo_jwt_token_' + Math.random().toString(36).substring(2);
        localStorage.setItem('tripura_jwt_token', token);

        setUser({
          isLoggedIn: true,
          email: matchedUser.email,
          phone: matchedUser.phone || '9999999999',
          name: matchedUser.name,
          subscription: {
            hasActivePlan: matchedUser.hasActivePlan ?? false,
            planId: matchedUser.hasActivePlan ? 'hanuman-kriya-live' : null,
            planName: matchedUser.hasActivePlan ? "Hanuman Kriya 11-Day Live Masterclass" : "Free Orientation Mode",
            planType: 'live',
            validUntil: "October 13, 2026",
            unlockedDays: matchedUser.hasActivePlan ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [1, 2],
            whatsappLink: TRIPURA_WHATSAPP_COMMUNITY_URL
          }
        });
        return true;
      } else {
        const emailExists = allAccounts.some(acc => acc.email.toLowerCase() === normalizedEmail);
        if (emailExists) {
          throw new Error('Incorrect password. Please check your password and try again.');
        } else {
          throw new Error('No account found with this email. Please sign up for an account first.');
        }
      }
    }

    return false;
  };

  const signUpWithEmailPassword = async (name: string, email: string, password: string): Promise<boolean> => {
    let networkError = false;

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          localStorage.setItem('tripura_jwt_token', data.token);
        }
        const newUserRecord: UserProfile = {
          isLoggedIn: true,
          email: data.email || email,
          phone: data.phone || '8888888888',
          name: data.name || name,
          subscription: {
            hasActivePlan: false,
            planId: null,
            planName: "Free Orientation Mode",
            validUntil: "Orientation Unlocked",
            unlockedDays: [1, 2]
          }
        };
        setUser(newUserRecord);

        // Also update registered accounts cache
        const registered = JSON.parse(localStorage.getItem('tripura_registered_accounts') || '[]');
        if (!registered.some((acc: any) => acc.email.toLowerCase() === email.toLowerCase())) {
          registered.push({ email: email.toLowerCase(), password, name, phone: newUserRecord.phone, hasActivePlan: false });
          localStorage.setItem('tripura_registered_accounts', JSON.stringify(registered));
        }
        return true;
      } else {
        const errorData = await response.json().catch(() => null);
        const errorMsg = errorData?.message || 'Could not create account. An account with this email may already exist.';
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      if (err.message && err.message !== 'Failed to fetch' && !err.message.includes('fetch') && !err.message.includes('NetworkError')) {
        throw err;
      }
      networkError = true;
    }

    // Offline / Demo Fallback Mode
    if (networkError) {
      const registered = JSON.parse(localStorage.getItem('tripura_registered_accounts') || '[]');
      const normalizedEmail = email.trim().toLowerCase();
      const defaultEmails = ['suryateja@tripura.org', 'google.seeker@tripura.org', 'demo@tripura.org'];

      if (registered.some((acc: any) => acc.email.toLowerCase() === normalizedEmail) || defaultEmails.includes(normalizedEmail)) {
        throw new Error('An account with this email already exists. Please sign in instead.');
      }

      const token = 'demo_jwt_token_' + Math.random().toString(36).substring(2);
      localStorage.setItem('tripura_jwt_token', token);

      const phone = '99' + String(Math.floor(10000000 + Math.random() * 90000000));
      const newUserRecord = { email: normalizedEmail, password, name, phone, hasActivePlan: false };

      registered.push(newUserRecord);
      localStorage.setItem('tripura_registered_accounts', JSON.stringify(registered));

      setUser({
        isLoggedIn: true,
        email: normalizedEmail,
        phone: phone,
        name: name,
        subscription: {
          hasActivePlan: false,
          planId: null,
          planName: "Free Orientation Mode",
          validUntil: "Orientation Unlocked",
          unlockedDays: [1, 2]
        }
      });
      return true;
    }

    return false;
  };

  const logout = () => {
    localStorage.removeItem('tripura_jwt_token');
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

  // Prevent background page / dashboard scrolling whenever any modal, drawer, audio player, or transition is active
  const isAnyOverlayActive = isAuthOpen || isPaymentOpen || isVideoOpen || isBookDrawerOpen || isBookAudioOpen || isLoginTransitionActive;

  useEffect(() => {
    if (isAnyOverlayActive) {
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isAnyOverlayActive]);


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
        loginWithEmailPassword,
        signUpWithEmailPassword,
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
        isLoginTransitionActive,
        triggerLoginSuccessTransition,
        completeLoginSuccessTransition,
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
