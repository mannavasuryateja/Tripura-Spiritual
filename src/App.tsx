import React, { useState, useEffect, useCallback } from 'react';
import { AppProvider } from './context/AppContext';
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
import { Shield } from 'lucide-react';

import { Login } from './pages/Login';
import { SignUp } from './pages/SignUp';
import { LoginSuccessTransition } from './components/LoginSuccessTransition';
import { useApp } from './context/AppContext';

const MainContent: React.FC = () => {
  const {
    isLoginTransitionActive,
    completeLoginSuccessTransition,
    user,
    sessionExpiredNotice,
    setOnSessionExpiredCallback
  } = useApp();

  // If user reopened the website after 1-minute expiration, open directly at login
  const [activeTab, setActiveTab] = useState<string>(() => {
    const savedExpiry = localStorage.getItem('tripura_session_expiry');
    if (savedExpiry && Date.now() >= Number(savedExpiry)) {
      return 'login';
    }
    return 'home';
  });

  const [previewPublicSite, setPreviewPublicSite] = useState<boolean>(false);

  // When 1-minute session expires while active, smoothly transition to Login
  useEffect(() => {
    setOnSessionExpiredCallback(() => {
      setPreviewPublicSite(false);
      setActiveTab('login');
    });
  }, [setOnSessionExpiredCallback]);

  // When session notice triggers and user is logged out, route to login page
  useEffect(() => {
    if (sessionExpiredNotice && !user.isLoggedIn && activeTab !== 'login' && activeTab !== 'signup') {
      setPreviewPublicSite(false);
      setActiveTab('login');
    }
  }, [sessionExpiredNotice, user.isLoggedIn, activeTab]);

  const handleTransitionComplete = useCallback(() => {
    completeLoginSuccessTransition();
    setPreviewPublicSite(false);
    if (user.role !== 'ROLE_ADMIN') {
      setActiveTab('home');
    }
  }, [completeLoginSuccessTransition, user.role]);

  const isAdmin = user.isLoggedIn && user.role === 'ROLE_ADMIN';

  return (
    <>
      {/* Automatic State-Driven Post-Login Zoom Transition Overlay */}
      <LoginSuccessTransition
        isActive={isLoginTransitionActive}
        onComplete={handleTransitionComplete}
      />

      {/* ADMIN WORKSPACE ROUTING: When authenticated as Admin, show dedicated Admin Dashboard directly */}
      {isAdmin && !previewPublicSite && !isLoginTransitionActive ? (
        <AdminPanel onPreviewSite={() => setPreviewPublicSite(true)} />
      ) : isLoginTransitionActive ? (
        // During transition, render Home / ambient background underneath
        <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
          <Header activeTab="home" setActiveTab={setActiveTab} onReturnToAdmin={() => setPreviewPublicSite(false)} />
          <main className="flex-1">
            <Home setActiveTab={setActiveTab} />
          </main>
          <Footer setActiveTab={setActiveTab} />
        </div>
      ) : activeTab === 'login' ? (
        <Login setActiveTab={setActiveTab} />
      ) : activeTab === 'signup' ? (
        <SignUp setActiveTab={setActiveTab} />
      ) : (
        <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
          
          {/* Admin Preview Mode Top Bar (Only visible when Admin is previewing public seeker website) */}
          {isAdmin && previewPublicSite && (
            <div className="bg-[#191421] border-b border-purple-800/60 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold tracking-wider text-amber-300 uppercase font-mono text-[11px]">Admin Preview Mode</span>
                <span className="text-stone-300 hidden md:inline text-xs">— Viewing public seeker experience as administrator ({user.email || user.name}).</span>
              </div>
              <button
                onClick={() => setPreviewPublicSite(false)}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-700 to-amber-600 hover:from-purple-600 hover:to-amber-500 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-md hover:-translate-y-0.5"
              >
                <Shield className="w-3.5 h-3.5 text-amber-200" />
                <span>Return to Admin Dashboard</span>
              </button>
            </div>
          )}

          {/* Top Header */}
          <Header activeTab={activeTab} setActiveTab={setActiveTab} onReturnToAdmin={() => setPreviewPublicSite(false)} />

          {/* Main View Area */}
          <main className="flex-1">
            {activeTab === 'home' && <Home setActiveTab={setActiveTab} />}
            {activeTab === 'about' && <About />}
            {activeTab === 'sessions' && <Sessions setActiveTab={setActiveTab} />}
            {activeTab === 'session-details' && <SessionDetails setActiveTab={setActiveTab} />}
            {activeTab === 'demo' && <DemoClass />}
            {activeTab === 'book-library' && <BookLibrary />}
            {activeTab === 'plans' && <Plans />}
            {activeTab === 'onetoone' && <OneToOne />}
            {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
            {activeTab === 'profile' && <Profile setActiveTab={setActiveTab} />}
            {activeTab === 'admin' && <AdminPanel onPreviewSite={() => setPreviewPublicSite(true)} />}
          </main>

          {/* Modals & Presentation Overlays */}
          <AuthModal onSuccessRedirect={() => {
            if (user.role === 'ROLE_ADMIN') {
              setPreviewPublicSite(false);
            } else {
              setActiveTab('home');
            }
          }} />
          <PaymentModal onSuccessNavigate={() => setActiveTab('dashboard')} />
          <VideoPlayerModal />
          <BookLibraryDrawer onNavigateToFullPage={() => setActiveTab('book-library')} />
          <BookAudioPlayerModal />

          {/* Floating Right Side Sacred Books & Podcasts Button */}
          <FloatingBookButton />

          {/* Footer */}
          <Footer setActiveTab={setActiveTab} />
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
