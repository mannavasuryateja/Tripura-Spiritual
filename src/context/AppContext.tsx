import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import type { Language } from '../i18n';
import { getTranslation } from '../i18n';
import { en } from '../i18n/en';
import { ambientEngine } from '../audio/ambientEngine';
import { authApi, setUnauthorizedHandler } from '../api/client';

export type AppRole = 'ROLE_SEEKER' | 'ROLE_ENROLLED' | 'ROLE_ADMIN';

export const SESSION_DURATION_MS = 60 * 1000; // 1 minute security session hold

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
  problemStatement?: string;
  synopsis: string;
  summaryStory?: string;
  masterQuote: string;
  previewDurationMinutes?: number;
  chapters: { title: string; duration: string; isFree?: boolean }[];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof en;
  user: UserProfile;
  login: (phone: string, name?: string) => void;
  sendOtp: (phone: string) => Promise<{ success: boolean; message: string }>;
  verifyOtpAndLogin: (phone: string, otpCode: string) => Promise<boolean>;
  loginWithEmailPassword: (email: string, password: string, rememberMe?: boolean) => Promise<boolean>;
  signUpWithEmailPassword: (name: string, email: string, password: string, phone?: string) => Promise<boolean>;
  logout: () => void;
  switchDemoUser: (phone: string) => void;
  switchDemoRole: (role: AppRole) => void;
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

  // 1-minute Session Timeout & Security Hold
  sessionSecondsLeft: number;
  sessionExpiredNotice: boolean;
  clearSessionExpiredNotice: () => void;
  setOnSessionExpiredCallback: (cb: () => void) => void;
  resetSessionTimer: () => void;

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

// Preset Demo Users for RBAC Roles
const SUBSCRIBED_USER_PHONE = '9999999999';
const RESTRICTED_USER_PHONE = '8888888888';

export const defaultAdminUser: UserProfile = {
  isLoggedIn: true,
  phone: "9999000001",
  email: "admin@tripura.org",
  name: "Tripura Platform Admin",
  role: "ROLE_ADMIN",
  subscription: {
    hasActivePlan: true,
    planId: 'admin-masterclass-all',
    planName: "Platform Admin Superuser Pass",
    planType: 'live',
    validUntil: "Permanent Admin Access",
    unlockedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
    whatsappLink: TRIPURA_WHATSAPP_COMMUNITY_URL
  }
};

export const defaultSubscribedUser: UserProfile = {
  isLoggedIn: true,
  phone: SUBSCRIBED_USER_PHONE,
  email: "ananya@tripura.org",
  name: "Ananya Sharma (Live Attendee)",
  role: "ROLE_ENROLLED",
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

export const defaultRestrictedUser: UserProfile = {
  isLoggedIn: true,
  phone: RESTRICTED_USER_PHONE,
  email: "vikram@tripura.org",
  name: "Vikram Kumar (New Seeker)",
  role: "ROLE_SEEKER",
  subscription: {
    hasActivePlan: false,
    planId: null,
    planName: "Free Orientation Mode",
    validUntil: "Orientation Unlocked",
    unlockedDays: [1, 2] // User B has sample access to Day 1 & 2
  }
};

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

  // 2. User & Subscription State with 1-Minute Session Expiration Hold
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(() => {
    const savedExpiry = localStorage.getItem('tripura_session_expiry');
    if (savedExpiry) {
      const expiryTime = Number(savedExpiry);
      if (!isNaN(expiryTime) && Date.now() < expiryTime) {
        return expiryTime;
      }
    }
    return null;
  });

  const [sessionSecondsLeft, setSessionSecondsLeft] = useState<number>(() => {
    const savedExpiry = localStorage.getItem('tripura_session_expiry');
    if (savedExpiry) {
      const expiryTime = Number(savedExpiry);
      if (!isNaN(expiryTime) && Date.now() < expiryTime) {
        return Math.ceil((expiryTime - Date.now()) / 1000);
      }
    }
    return 0;
  });

  const [sessionExpiredNotice, setSessionExpiredNotice] = useState<boolean>(() => {
    const savedExpiry = localStorage.getItem('tripura_session_expiry');
    const savedUser = localStorage.getItem('tripura_user');
    if (savedExpiry && savedUser) {
      const expiryTime = Number(savedExpiry);
      if (!isNaN(expiryTime) && Date.now() >= expiryTime) {
        return true;
      }
    }
    return false;
  });

  const clearSessionExpiredNotice = () => setSessionExpiredNotice(false);

  const onSessionExpiredRef = useRef<(() => void) | null>(null);
  const setOnSessionExpiredCallback = (cb: () => void) => {
    onSessionExpiredRef.current = cb;
  };

  const startSession = (durationMs: number = SESSION_DURATION_MS) => {
    const expiry = Date.now() + durationMs;
    localStorage.setItem('tripura_session_expiry', expiry.toString());
    setSessionExpiry(expiry);
    setSessionSecondsLeft(Math.ceil(durationMs / 1000));
    setSessionExpiredNotice(false);
  };

  const endSession = () => {
    localStorage.removeItem('tripura_session_expiry');
    localStorage.removeItem('tripura_user');
    setSessionExpiry(null);
    setSessionSecondsLeft(0);
  };

  const resetSessionTimer = () => {
    if (user.isLoggedIn) {
      startSession();
    }
  };

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('tripura_user');
    const savedExpiry = localStorage.getItem('tripura_session_expiry');

    // If session expired (more than 1 minute since last session/hold), reset to guest
    if (savedExpiry) {
      const expiryTime = Number(savedExpiry);
      if (isNaN(expiryTime) || Date.now() >= expiryTime) {
        localStorage.removeItem('tripura_user');
        localStorage.removeItem('tripura_session_expiry');
        return defaultGuestUser;
      }
    } else if (saved) {
      localStorage.removeItem('tripura_user');
      return defaultGuestUser;
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
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
    if (user.isLoggedIn) {
      localStorage.setItem('tripura_user', JSON.stringify(user));
      if (!sessionExpiry || sessionExpiry <= Date.now()) {
        startSession();
      }
    } else {
      localStorage.removeItem('tripura_user');
      localStorage.removeItem('tripura_session_expiry');
    }
  }, [user]);

  // Session Expiration Watcher & Countdown Timer (1-minute hold)
  useEffect(() => {
    if (!user.isLoggedIn || !sessionExpiry) {
      setSessionSecondsLeft(0);
      return;
    }

    const checkExpiration = () => {
      const remainingMs = sessionExpiry - Date.now();
      if (remainingMs <= 0) {
        // 1-minute window expired!
        endSession();
        setUser(defaultGuestUser);
        setSessionExpiredNotice(true);
        if (onSessionExpiredRef.current) {
          onSessionExpiredRef.current();
        }
      } else {
        setSessionSecondsLeft(Math.ceil(remainingMs / 1000));
      }
    };

    // Check immediately
    checkExpiration();

    const interval = setInterval(checkExpiration, 1000);

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        checkExpiration();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
    };
  }, [user.isLoggedIn, sessionExpiry]);

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

  // Listen for 401 Unauthorized globally from central Axios client
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(defaultGuestUser);
      setIsAuthOpen(true);
    });
  }, []);

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
        role: 'ROLE_SEEKER',
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

  const switchDemoRole = (role: AppRole) => {
    if (role === 'ROLE_ADMIN') {
      setUser(defaultAdminUser);
    } else if (role === 'ROLE_ENROLLED') {
      setUser({
        ...defaultSubscribedUser,
        subscription: {
          ...defaultSubscribedUser.subscription,
          unlockedDays: adminOverrides[SUBSCRIBED_USER_PHONE] || [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
        }
      });
    } else {
      setUser({
        ...defaultRestrictedUser,
        subscription: {
          ...defaultRestrictedUser.subscription,
          unlockedDays: adminOverrides[RESTRICTED_USER_PHONE] || [1, 2]
        }
      });
    }
  };

  const hasRole = (roles: AppRole | AppRole[]): boolean => {
    if (!user.isLoggedIn) return false;
    const currentRole = user.role || 'ROLE_SEEKER';
    if (currentRole === 'ROLE_ADMIN') return true;
    if (Array.isArray(roles)) {
      return roles.includes(currentRole);
    }
    return roles === currentRole;
  };

  const sendOtp = async (phone: string): Promise<{ success: boolean; message: string }> => {
    try {
      const data = await authApi.sendOtp({ phone, name: 'Seeker' });
      return { success: true, message: data?.message || `OTP sent successfully to +91 ${phone}. (Demo OTP: 123456)` };
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMsg = err.response.data.message || err.response.data.error || 'Failed to send OTP.';
        throw new Error(errorMsg);
      }
      throw new Error('Backend server is offline or unreachable (port 8080). Please start the backend server.');
    }
  };

  const verifyOtpAndLogin = async (phone: string, otpCode: string): Promise<boolean> => {
    try {
      const data = await authApi.verifyOtp({ phone, otpCode });
      if (data) {
        const assignedRole: AppRole = data.role ? (data.role as AppRole) : (data.hasActivePlan ? 'ROLE_ENROLLED' : 'ROLE_SEEKER');
        setUser({
          isLoggedIn: true,
          email: data.email || undefined,
          phone: data.phone || phone,
          name: data.name || `Seeker (${phone.slice(-4)})`,
          role: assignedRole,
          subscription: {
            hasActivePlan: data.hasActivePlan ?? false,
            planId: data.hasActivePlan ? 'hanuman-kriya-live' : null,
            planName: data.planName || (data.hasActivePlan ? "Hanuman Kriya Live Masterclass" : "Free Orientation Mode"),
            planType: 'live',
            validUntil: "October 13, 2026",
            unlockedDays: data.hasActivePlan ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11] : [1, 2],
            whatsappLink: TRIPURA_WHATSAPP_COMMUNITY_URL
          }
        });
        setIsAuthOpen(false);
        return true;
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMsg = err.response.data.message || err.response.data.error || 'Invalid OTP code. Use Demo OTP: 123456';
        throw new Error(errorMsg);
      }
      throw new Error('Backend server is offline or unreachable (port 8080). Please start the backend server.');
    }

    throw new Error('OTP verification failed.');
  };

  const loginWithEmailPassword = async (email: string, password: string, rememberMe?: boolean): Promise<boolean> => {
    try {
      const data = await authApi.login({ email, password, rememberMe: !!rememberMe });
      if (data) {
        const assignedRole: AppRole = data.role ? (data.role as AppRole) : (data.hasActivePlan ? 'ROLE_ENROLLED' : 'ROLE_SEEKER');
        setUser({
          isLoggedIn: true,
          email: data.email || email,
          phone: data.phone || '9999999999',
          name: data.name || email.split('@')[0],
          role: assignedRole,
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
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMsg = err.response.data.message || err.response.data.error || 'Invalid email/phone or password. Please try again.';
        throw new Error(errorMsg);
      }
      throw new Error('Backend server is offline or unreachable (port 8080). Please start the backend server.');
    }

    return false;
  };

  const signUpWithEmailPassword = async (name: string, email: string, password: string, phone?: string): Promise<boolean> => {
    try {
      const data = await authApi.signup({ name, email, password, phone: phone?.trim() || undefined });
      if (data) {
        const newUserRecord: UserProfile = {
          isLoggedIn: true,
          email: data.email || email,
          phone: data.phone || phone?.trim() || '8888888888',
          name: data.name || name,
          role: (data.role as AppRole) || 'ROLE_SEEKER',
          subscription: {
            hasActivePlan: false,
            planId: null,
            planName: "Free Orientation Mode",
            validUntil: "Orientation Unlocked",
            unlockedDays: [1, 2]
          }
        };
        setUser(newUserRecord);
        return true;
      }
    } catch (err: any) {
      if (err.response && err.response.data) {
        const errorMsg = err.response.data.message || err.response.data.error || 'Could not create account. An account with this email already exists.';
        throw new Error(errorMsg);
      }
      throw new Error('Backend server is offline or unreachable (port 8080). Please start the backend server.');
    }

    return false;
  };

  const logout = async () => {
    endSession();
    try {
      await authApi.logout();
    } catch {
      // Ignore network errors on logout
    }
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

    let validUntilText = "Live Batch (1st–11th) • Recordings Active till 13th Day";
    let pType: 'live' | 'extension' | 'recordings-only' | 'demo' = 'live';

    if (pendingPlan.type === 'recording-extension' || pendingPlan.id.includes('extension')) {
      validUntilText = "30 Days Extended Recording Access from Date of Purchase";
      pType = 'extension';
    } else if (pendingPlan.type === 'recordings-only' || pendingPlan.id.includes('recordings-only')) {
      validUntilText = "30 Days Complete Recording Access from Date of Purchase";
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
      role: prev.role === 'ROLE_ADMIN' ? prev.role : 'ROLE_ENROLLED',
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

  // Prevent background page scrolling when active modals are open
  const isModalOverlayActive = isAuthOpen || isPaymentOpen || isVideoOpen || isBookDrawerOpen || isBookAudioOpen;

  useEffect(() => {
    if (isModalOverlayActive) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    };
  }, [isModalOverlayActive]);


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
        sendOtp,
        verifyOtpAndLogin,
        loginWithEmailPassword,
        signUpWithEmailPassword,
        logout,
        switchDemoUser,
        switchDemoRole,
        hasRole,
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
        resetDemoState,
        sessionSecondsLeft,
        sessionExpiredNotice,
        clearSessionExpiredNotice,
        setOnSessionExpiredCallback,
        resetSessionTimer
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

