import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MusicControl } from './MusicControl';
import { Menu, X, User, Shield } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const { language, setLanguage, t, user, openAuthModal } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'sessions', label: t.nav.sessions },
    { id: 'demo', label: t.nav.demoClass },
    { id: 'onetoone', label: t.nav.oneToOne },
    { id: 'about', label: t.nav.about }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#F8F5EE]/95 backdrop-blur-md border-b border-[#E6E0D2] shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Brand Logo */}
          <div 
            onClick={() => handleNavClick('home')}
            className="cursor-pointer group flex items-center shrink-0"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-[0.25em] text-[#2C2421] group-hover:text-[#8B5E34] transition">
              TRIPURA
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#D1A559] ml-1">.</span>
          </div>

          {/* Desktop Navigation - Clean, Uncluttered, Single-line */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`text-xs font-semibold tracking-[0.14em] uppercase transition whitespace-nowrap py-1 relative ${
                  activeTab === link.id
                    ? 'text-[#8B5E34] font-bold'
                    : 'text-[#5C534E] hover:text-[#2C2421]'
                }`}
              >
                <span>{link.label}</span>
                {activeTab === link.id && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#8B5E34] rounded-full"></span>
                )}
              </button>
            ))}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden sm:flex items-center gap-3 xl:gap-5 shrink-0">
            
            {/* Ambient Music Toggle Button & Volume Popover */}
            <MusicControl />

            {/* Simple Language Switcher EN | తెలుగు */}
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#5C534E] px-1">
              <button
                onClick={() => setLanguage('en')}
                className={`transition px-1 py-0.5 rounded ${
                  language === 'en'
                    ? 'text-[#2C2421] font-bold underline underline-offset-4 decoration-[#8B5E34]'
                    : 'hover:text-[#2C2421]'
                }`}
              >
                EN
              </button>
              <span className="text-[#B5ACA3]">|</span>
              <button
                onClick={() => setLanguage('te')}
                className={`transition px-1 py-0.5 rounded ${
                  language === 'te'
                    ? 'text-[#2C2421] font-bold underline underline-offset-4 decoration-[#8B5E34]'
                    : 'hover:text-[#2C2421]'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* Admin link */}
            <button
              onClick={() => handleNavClick('admin')}
              className="text-[#7A7067] hover:text-[#2C2421] p-1.5 rounded-full transition"
              title="Admin Matrix"
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* LOGIN / DASHBOARD Button */}
            {user.isLoggedIn ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="px-5 py-2.5 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-semibold text-xs tracking-[0.12em] uppercase shadow-sm transition flex items-center gap-2 whitespace-nowrap"
              >
                <User className="w-3.5 h-3.5" />
                <span>{user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="px-6 py-2.5 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-semibold text-xs tracking-[0.12em] uppercase shadow-sm transition whitespace-nowrap"
              >
                {t.nav.login}
              </button>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2.5">
            <MusicControl />

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-[#2C2421] hover:bg-[#EFE9DD] focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F8F5EE] border-b border-[#E6E0D2] px-6 pt-4 pb-6 space-y-4 animate-fadeIn">
          <div className="flex justify-between items-center pb-3 border-b border-[#E6E0D2]">
            <span className="text-xs font-semibold text-[#7A7067] uppercase tracking-wider">Language</span>
            <div className="flex gap-3 text-xs font-semibold">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full ${language === 'en' ? 'bg-[#3B234A] text-white' : 'text-[#5C534E]'}`}
              >
                EN
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-3 py-1 rounded-full ${language === 'te' ? 'bg-[#3B234A] text-white' : 'text-[#5C534E]'}`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          <div className="space-y-2">
            {[
              { id: 'home', label: t.nav.home },
              { id: 'sessions', label: t.nav.sessions },
              { id: 'book-library', label: t.nav.bookLibrary },
              { id: 'demo', label: t.nav.demoClass },
              { id: 'onetoone', label: t.nav.oneToOne },
              { id: 'about', label: t.nav.about },
              { id: 'admin', label: t.nav.admin },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition ${
                  activeTab === item.id ? 'bg-[#EFE9DD] text-[#3B234A]' : 'text-[#2C2421]'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="pt-2">
            {user.isLoggedIn ? (
              <button
                onClick={() => handleNavClick('dashboard')}
                className="w-full py-3 rounded-full bg-[#3B234A] text-white font-bold text-xs tracking-widest uppercase text-center"
              >
                {t.nav.dashboard} ({user.name})
              </button>
            ) : (
              <button
                onClick={() => { openAuthModal(); setMobileMenuOpen(false); }}
                className="w-full py-3 rounded-full bg-[#3B234A] text-white font-bold text-xs tracking-widest uppercase text-center"
              >
                {t.nav.login}
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

