import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { PaymentModal } from './components/PaymentModal';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { BookLibraryDrawer } from './components/BookLibraryDrawer';
import { BookAudioPlayerModal } from './components/BookAudioPlayerModal';
import { FloatingBookButton } from './components/FloatingBookButton';
import { DemoUserSelector } from './components/DemoUserSelector';

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
import { Admin } from './pages/Admin';

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('home');

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
      
      {/* Top Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

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
        {activeTab === 'admin' && <Admin />}
      </main>

      {/* Modals & Presentation Overlays */}
      <AuthModal onSuccessRedirect={() => setActiveTab('dashboard')} />
      <PaymentModal onSuccessNavigate={() => setActiveTab('dashboard')} />
      <VideoPlayerModal />
      <BookLibraryDrawer onNavigateToFullPage={() => setActiveTab('book-library')} />
      <BookAudioPlayerModal />

      {/* Floating Right Side Sacred Books & Podcasts Button */}
      <FloatingBookButton />

      {/* Quick Demo Users Floating Toolbar */}
      <DemoUserSelector />

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
