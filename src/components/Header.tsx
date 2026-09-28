import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MusicControl } from './MusicControl';
import { Menu, X, User, Shield, LogOut, ChevronDown, LayoutDashboard } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onReturnToAdmin?: () => void;
  mobileMenuOpen?: boolean;
  setMobileMenuOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((open: boolean) => void);
  userMenuOpen?: boolean;
  setUserMenuOpen?: React.Dispatch<React.SetStateAction<boolean>> | ((open: boolean) => void);
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onReturnToAdmin,
  mobileMenuOpen: propMobileMenuOpen,
  setMobileMenuOpen: propSetMobileMenuOpen,
  userMenuOpen: propUserMenuOpen,
  setUserMenuOpen: propSetUserMenuOpen,
}) => {
  const { language, setLanguage, t, user, logout } = useApp();
  const [internalMobileMenuOpen, setInternalMobileMenuOpen] = useState(false);
  const [internalUserMenuOpen, setInternalUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuItemRef = useRef<HTMLButtonElement>(null);

  const mobileMenuOpen = propMobileMenuOpen !== undefined ? propMobileMenuOpen : internalMobileMenuOpen;
  const setMobileMenuOpen = propSetMobileMenuOpen || setInternalMobileMenuOpen;
  const userMenuOpen = propUserMenuOpen !== undefined ? propUserMenuOpen : internalUserMenuOpen;
  const setUserMenuOpen = propSetUserMenuOpen || setInternalUserMenuOpen;

  // Single passive scroll listener for scroll-aware sticky header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Move focus to first menu item on open, return to hamburger on Escape
  useEffect(() => {
    if (mobileMenuOpen) {
      firstMenuItemRef.current?.focus();
    }
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
        hamburgerButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen, setMobileMenuOpen]);

  const handleNavClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  };

  const handleAdminClick = () => {
    if (onReturnToAdmin) {
      onReturnToAdmin();
    } else {
      setActiveTab('admin');
    }
    setUserMenuOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: t.nav.home },
    { id: 'sessions', label: t.nav.sessions },
    { id: 'demo', label: t.nav.demoClass },
    { id: 'onetoone', label: t.nav.oneToOne },
    { id: 'about', label: t.nav.about }
  ];

  return (
    <header className={`sticky top-0 z-40 w-full bg-[#F8F5EE]/95 backdrop-blur-md border-b border-[#E6E0D2] transition-all duration-300 ${
      isScrolled ? 'shadow-md' : 'shadow-xs'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          
          {/* Brand Button (Native Accessible Button) */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="group flex items-center shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E34] rounded-lg p-1"
            aria-label="Tripura Spiritual Home"
          >
            <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-[0.25em] text-[#2C2421] group-hover:text-[#8B5E34] transition">
              TRIPURA
            </span>
            <span className="font-serif text-2xl sm:text-3xl font-extrabold text-[#D1A559] ml-1">.</span>
          </button>

          {/* Desktop Navigation - Clean, Centered, Spacious & Premium */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 mx-auto" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  type="button"
                  onClick={() => handleNavClick(link.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`group text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-300 whitespace-nowrap py-1.5 relative flex items-center justify-center cursor-pointer ${
                    isActive
                      ? 'text-[#8B5E34] font-bold drop-shadow-[0_0_6px_rgba(180,130,60,0.25)]'
                      : 'text-[#5C534E] hover:text-[#9A6B32] hover:-translate-y-[1px] hover:drop-shadow-[0_0_8px_rgba(180,130,60,0.35)]'
                  }`}
                >
                  <span>{link.label}</span>
                  <span
                    className={`absolute bottom-0 left-0 w-full h-[2px] rounded-full transform origin-center transition-all duration-300 ease-out ${
                      isActive
                        ? 'scale-x-100 bg-[#8B5E34]'
                        : 'scale-x-0 group-hover:scale-x-100 bg-[#9A6B32] opacity-90'
                    }`}
                  />
                </button>
              );
            })}
          </nav>

          {/* Right Header Controls */}
          <div className="hidden sm:flex items-center gap-3 xl:gap-5 shrink-0">
            
            {/* Ambient Music Toggle Button & Volume Popover */}
            <MusicControl />

            {/* Simple Language Switcher EN | తెలుగు */}
            <div className="flex items-center gap-1.5 text-xs font-semibold tracking-wider text-[#5C534E] px-1" role="group" aria-label="Language selection">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={`transition px-1 py-0.5 rounded cursor-pointer ${
                  language === 'en'
                    ? 'text-[#2C2421] font-bold underline underline-offset-4 decoration-[#8B5E34]'
                    : 'hover:text-[#2C2421]'
                }`}
              >
                EN
              </button>
              <span className="text-[#B5ACA3]" aria-hidden="true">|</span>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                aria-pressed={language === 'te'}
                className={`transition px-1 py-0.5 rounded cursor-pointer ${
                  language === 'te'
                    ? 'text-[#2C2421] font-bold underline underline-offset-4 decoration-[#8B5E34]'
                    : 'hover:text-[#2C2421]'
                }`}
              >
                తెలుగు
              </button>
            </div>

            {/* USER LOGGED IN BADGE & DROPDOWN MENU */}
            {user.isLoggedIn ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  className="btn-spiritual px-4 py-2 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-semibold text-xs tracking-[0.12em] uppercase shadow-sm transition flex items-center gap-2 whitespace-nowrap cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  <span>{user.name.split(' ')[0]}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-slide-down">
                    <div className="px-4 py-2.5 border-b border-stone-100 space-y-0.5">
                      <p className="text-xs font-bold text-stone-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-stone-500 truncate">{user.email || `+91 ${user.phone}`}</p>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => handleNavClick('dashboard')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#A3733A]" />
                        <span>My Dashboard</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleNavClick('profile')}
                        className="w-full px-4 py-2 text-left text-xs font-medium text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <User className="w-4 h-4 text-[#A3733A]" />
                        <span>Profile & Account</span>
                      </button>

                      {user.role === 'ROLE_ADMIN' && (
                        <button
                          type="button"
                          onClick={handleAdminClick}
                          className="w-full px-4 py-2 text-left text-xs font-semibold text-purple-800 bg-purple-50/50 hover:bg-purple-100/70 flex items-center gap-2.5 transition cursor-pointer"
                        >
                          <Shield className="w-4 h-4 text-purple-600" />
                          <span>Admin Dashboard</span>
                        </button>
                      )}
                    </div>

                    <div className="pt-1 border-t border-stone-100">
                      <button
                        type="button"
                        onClick={() => { logout(); setUserMenuOpen(false); setActiveTab('home'); }}
                        className="w-full px-4 py-2.5 text-left text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="btn-spiritual btn-primary px-5 py-2.5 text-white font-semibold text-xs tracking-[0.12em] uppercase shadow-sm transition whitespace-nowrap cursor-pointer"
                >
                  {t.nav.login}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('signup')}
                  className="btn-spiritual btn-outline px-4 py-2.5 font-semibold text-xs tracking-[0.12em] uppercase transition whitespace-nowrap cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex lg:hidden items-center gap-2.5">
            <MusicControl />

            <button
              ref={hamburgerButtonRef}
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-menu"
              aria-label="Toggle Navigation Menu"
              className="p-2 rounded-lg text-[#2C2421] hover:bg-[#EFE9DD] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E34] cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-nav-menu" className="lg:hidden bg-[#F8F5EE] border-b border-[#E6E0D2] px-6 pt-4 pb-6 space-y-4 animate-slide-down">
          <div className="flex justify-between items-center pb-3 border-b border-[#E6E0D2]">
            <span className="text-xs font-semibold text-[#7A7067] uppercase tracking-wider">Language</span>
            <div className="flex gap-3 text-xs font-semibold" role="group" aria-label="Mobile Language Switcher">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={`px-3 py-1 rounded-full cursor-pointer transition ${language === 'en' ? 'bg-[#3B234A] text-white' : 'text-[#5C534E]'}`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                aria-pressed={language === 'te'}
                className={`px-3 py-1 rounded-full cursor-pointer transition ${language === 'te' ? 'bg-[#3B234A] text-white' : 'text-[#5C534E]'}`}
              >
                తెలుగు
              </button>
            </div>
          </div>

          <div className="space-y-2" role="menu" aria-label="Mobile Menu Links">
            {[
              { id: 'home', label: t.nav.home },
              { id: 'sessions', label: t.nav.sessions },
              { id: 'book-library', label: t.nav.bookLibrary },
              { id: 'demo', label: t.nav.demoClass },
              { id: 'onetoone', label: t.nav.oneToOne },
              { id: 'about', label: t.nav.about }
            ].map((item, index) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  ref={index === 0 ? firstMenuItemRef : undefined}
                  type="button"
                  role="menuitem"
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition cursor-pointer ${
                    isActive ? 'bg-[#EFE9DD] text-[#3B234A]' : 'text-[#2C2421] hover:bg-[#EFE9DD]/50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-2 space-y-2">
            {user.isLoggedIn ? (
              <>
                <button
                  type="button"
                  onClick={() => handleNavClick('dashboard')}
                  className="btn-spiritual w-full py-3 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-bold text-xs tracking-widest uppercase text-center cursor-pointer"
                >
                  {t.nav.dashboard} ({user.name.split(' ')[0]})
                </button>

                {user.role === 'ROLE_ADMIN' && (
                  <button
                    type="button"
                    onClick={handleAdminClick}
                    className="btn-spiritual w-full py-2.5 rounded-full bg-purple-900 hover:bg-purple-800 text-purple-100 font-bold text-xs tracking-widest uppercase text-center flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-purple-300" />
                    <span>Admin Dashboard</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => { logout(); setMobileMenuOpen(false); setActiveTab('home'); }}
                  className="w-full py-2.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs tracking-widest uppercase text-center flex items-center justify-center gap-2 cursor-pointer hover:bg-rose-100 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log Out</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleNavClick('login')}
                  className="btn-spiritual btn-primary w-full py-3 text-white font-bold text-xs tracking-widest uppercase text-center cursor-pointer"
                >
                  {t.nav.login}
                </button>
                <button
                  type="button"
                  onClick={() => handleNavClick('signup')}
                  className="btn-spiritual btn-outline w-full py-3 font-bold text-xs tracking-widest uppercase text-center cursor-pointer"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

