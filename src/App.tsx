import React, { useState, useCallback, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { BookLibraryDrawer } from './components/BookLibraryDrawer';
import { BookAudioPlayerModal } from './components/BookAudioPlayerModal';
import { FloatingBookButton } from './components/FloatingBookButton';

import { Home } from './pages/Home';
import { About } from './pages/About';
import { Sessions } from './pages/Sessions';
import { SessionDetails } from './pages/SessionDetails';
import { DemoClass } from './pages/DemoClass';
import { Plans } from './pages/Plans';
import { OneToOne } from './pages/OneToOne';
import { BookLibrary } from './pages/BookLibrary';
import { Dashboard } from './pages/Dashboard';
import { Profile } from './pages/Profile';
import { AdminPanel } from './components/AdminPanel';
import { Shield, Lock, ArrowLeft } from 'lucide-react';

import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { LoginSuccessTransition } from './components/LoginSuccessTransition';

const MainContent: React.FC = () => {
  const {
    isLoginTransitionActive,
    completeLoginSuccessTransition,
    user,
    openAuthModal
  } = useApp();

  const [activeTab, setActiveTabState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace(/^#/, '');
      const stateTab = window.history.state?.tab;
      return stateTab || hash || 'home';
    }
    return 'home';
  });

  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [userMenuOpen, setUserMenuOpen] = useState<boolean>(false);
  const [previewPublicSite, setPreviewPublicSite] = useState<boolean>(false);

  // Unified app navigation function
  const navigate = useCallback((tab: string, options?: { replace?: boolean; skipHistory?: boolean }) => {
    const targetTab = tab === 'one-to-one' ? 'onetoone' : tab;
    setActiveTabState(targetTab);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!options?.skipHistory && typeof window !== 'undefined') {
      if (options?.replace) {
        window.history.replaceState({ tab: targetTab }, '', `#${targetTab}`);
      } else {
        window.history.pushState({ tab: targetTab }, '', `#${targetTab}`);
      }
    }
  }, []);

  // Replace initial history entry on mount
  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, '');
    const initialTab = window.history.state?.tab || hash || 'home';
    setActiveTabState(initialTab);
    window.history.replaceState(
      { tab: initialTab },
      '',
      initialTab === 'home' && !hash ? window.location.pathname + window.location.search : `#${initialTab}`
    );
  }, []);

  // Restore activeTab on popstate without pushing history
  useEffect(() => {
    const handlePopState = (event: PopStateEvent) => {
      const targetTab = event.state?.tab || window.location.hash.replace(/^#/, '') || 'home';
      setActiveTabState(targetTab);
      setMobileMenuOpen(false);
      setUserMenuOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleTransitionComplete = useCallback(() => {
    completeLoginSuccessTransition();
    setPreviewPublicSite(false);
    if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_MASTER') {
      navigate('admin');
    } else {
      navigate('dashboard');
    }
  }, [completeLoginSuccessTransition, user.role, navigate]);

  const isAdmin = user.isLoggedIn && (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_MASTER');

  return (
    <>
      {/* State-Driven Post-Login Transition Overlay */}
      <LoginSuccessTransition
        isActive={isLoginTransitionActive}
        onComplete={handleTransitionComplete}
      />

      {/* Admin Full Workspace View */}
      {isAdmin && !previewPublicSite && !isLoginTransitionActive ? (
        <AdminPanel onPreviewSite={() => setPreviewPublicSite(true)} />
      ) : isLoginTransitionActive ? (
        <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
          <Header
            activeTab="home"
            setActiveTab={navigate}
            onReturnToAdmin={() => setPreviewPublicSite(false)}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
          />
          <main className="flex-1">
            <Home setActiveTab={navigate} />
          </main>
          <Footer activeTab="home" setActiveTab={navigate} />
        </div>
      ) : activeTab === 'login' ? (
        <Login setActiveTab={navigate} />
      ) : activeTab === 'signup' ? (
        <SignUp setActiveTab={navigate} />
      ) : (
        <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
          
          {/* Admin Preview Mode Banner */}
          {isAdmin && previewPublicSite && (
            <div className="bg-[#191421] border-b border-purple-800/60 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse" />
                <span className="font-bold tracking-wider text-amber-300 uppercase font-mono text-[11px]">Admin Preview Mode</span>
                <span className="text-stone-300 hidden md:inline text-xs">— Viewing public seeker portal as administrator ({user.email || user.name}).</span>
              </div>
              <button
                onClick={() => setPreviewPublicSite(false)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md hover:-translate-y-0.5 cursor-pointer"
              >
                <Shield className="w-3.5 h-3.5 text-amber-200" />
                <span>Return to Admin Dashboard</span>
              </button>
            </div>
          )}

          {/* Top Header */}
          <Header
            activeTab={activeTab}
            setActiveTab={navigate}
            onReturnToAdmin={() => setPreviewPublicSite(false)}
            mobileMenuOpen={mobileMenuOpen}
            setMobileMenuOpen={setMobileMenuOpen}
            userMenuOpen={userMenuOpen}
            setUserMenuOpen={setUserMenuOpen}
          />

          {/* Main View Area */}
          <main className="flex-1">
            {activeTab === 'home' && <Home setActiveTab={navigate} />}
            {activeTab === 'about' && <About />}
            {activeTab === 'sessions' && <Sessions setActiveTab={navigate} />}
            {activeTab === 'session-details' && <SessionDetails setActiveTab={navigate} />}
            {activeTab === 'demo' && <DemoClass />}
            {activeTab === 'book-library' && <BookLibrary />}
            {activeTab === 'plans' && <Plans />}
            {activeTab === 'onetoone' && <OneToOne />}
            {activeTab === 'dashboard' && <Dashboard setActiveTab={navigate} />}
            {activeTab === 'profile' && <Profile setActiveTab={navigate} />}
            
            {/* Protected Admin Tab with Real Authorization Guard */}
            {activeTab === 'admin' && (
              isAdmin ? (
                <AdminPanel onPreviewSite={() => setPreviewPublicSite(true)} />
              ) : (
                <div className="section-container max-w-md mx-auto py-24 px-6 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="heading-section font-bold text-stone-900">Access Restricted</h2>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    This section requires Administrator privileges. {!user.isLoggedIn ? 'Please sign in with an administrator account.' : 'Your current account does not have permission to access the Tripura Spiritual administrative workspace.'}
                  </p>
                  <div className="flex flex-wrap justify-center gap-3 pt-2">
                    <button
                      onClick={openAuthModal}
                      className="btn-spiritual btn-primary px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      Sign In as Admin
                    </button>
                    <button
                      onClick={() => navigate('home')}
                      className="btn-spiritual btn-outline inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Return to Home</span>
                    </button>
                  </div>
                </div>
              )
            )}
          </main>

          {/* Modals & Overlays */}
          <AuthModal onSuccessRedirect={() => {
            if (isAdmin) {
              setPreviewPublicSite(false);
            } else {
              navigate('dashboard');
            }
          }} />
          <PaymentModal onSuccessNavigate={() => navigate('dashboard')} />
          <VideoPlayerModal />
          <BookLibraryDrawer onNavigateToFullPage={() => navigate('book-library')} />
          <BookAudioPlayerModal />

          {/* Floating Sacred Books & Podcasts Button */}
          <FloatingBookButton />

          {/* Footer */}
          <Footer activeTab={activeTab} setActiveTab={navigate} />
        </div>
      )}
    </>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
