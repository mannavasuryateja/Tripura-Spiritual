import React, { useState, useCallback } from 'react';
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
    user
  } = useApp();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [previewPublicSite, setPreviewPublicSite] = useState<boolean>(false);

  const handleTransitionComplete = useCallback(() => {
    completeLoginSuccessTransition();
    setPreviewPublicSite(false);
    if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_MASTER') {
      setActiveTab('admin');
    } else {
      setActiveTab('dashboard');
    }
  }, [completeLoginSuccessTransition, user.role]);

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
          
          {/* Admin Preview Mode Banner */}
          {isAdmin && previewPublicSite && (
            <div className="bg-[#191421] border-b border-purple-800/60 px-4 sm:px-8 py-2.5 flex items-center justify-between text-xs sticky top-0 z-50 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
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
            
            {/* Protected Admin Tab with Real Authorization Guard */}
            {activeTab === 'admin' && (
              isAdmin ? (
                <AdminPanel onPreviewSite={() => setPreviewPublicSite(true)} />
              ) : (
                <div className="max-w-md mx-auto py-24 px-6 text-center space-y-5 animate-fadeIn">
                  <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-inner">
                    <Lock className="w-8 h-8" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-stone-900">Access Restricted</h2>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    This section requires Administrator privileges. Your current account does not have permission to access the Tripura Spiritual administrative workspace.
                  </p>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold uppercase tracking-wider transition cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Return to Home</span>
                  </button>
                </div>
              )
            )}
          </main>

          {/* Modals & Overlays */}
          <AuthModal onSuccessRedirect={() => {
            if (isAdmin) {
              setPreviewPublicSite(false);
            } else {
              setActiveTab('dashboard');
            }
          }} />
          <PaymentModal onSuccessNavigate={() => setActiveTab('dashboard')} />
          <VideoPlayerModal />
          <BookLibraryDrawer onNavigateToFullPage={() => setActiveTab('book-library')} />
          <BookAudioPlayerModal />

          {/* Floating Sacred Books & Podcasts Button */}
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
