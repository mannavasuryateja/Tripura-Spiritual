import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, User, Sparkles, Globe, ShieldCheck } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface ProfileProps {
  setActiveTab: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ setActiveTab }) => {
  const { user, logout, language, setLanguage, theme, setTheme, openAuthModal, t } = useApp();

  if (!user.isLoggedIn) {
    return (
      <div className="section-container max-w-md mx-auto py-20 text-center space-y-6 animate-fadeIn text-[#2C2421]">
        <ScrollReveal animation="hero-zoom">
          <div className="card-spiritual glass-panel p-8 sm:p-10 text-center space-y-6 border border-[#E6E0D2] shadow-xl">
            <div className="w-16 h-16 rounded-full bg-[#FAF5EE] text-[#3B234A] flex items-center justify-center mx-auto border border-[#E6E0D2] shadow-inner">
              <User className="w-8 h-8 text-[#8B5E34]" />
            </div>
            <div className="space-y-2">
              <span className="section-eyebrow">Account Settings</span>
              <h2 className="heading-section text-[#2C2421]">Sign In to View Profile</h2>
              <p className="text-stone-600 text-sm max-w-sm mx-auto leading-relaxed">
                Please log in with your credentials or mobile OTP to access your account settings and preferences.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={openAuthModal}
                className="btn-spiritual btn-primary px-7 py-3 rounded-full text-xs font-bold tracking-wider uppercase shadow-md transition cursor-pointer min-h-[44px]"
              >
                Sign In with OTP
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('login')}
                className="btn-spiritual btn-outline px-7 py-3 rounded-full text-[#3B234A] border-[#3B234A] hover:bg-[#3B234A]/10 text-xs font-bold tracking-wider uppercase transition cursor-pointer min-h-[44px]"
              >
                Email Sign In
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="section-container max-w-4xl py-12 space-y-8 animate-fadeIn text-[#2C2421]">
      
      <ScrollReveal animation="hero-zoom">
        <div className="card-spiritual glass-panel p-6 sm:p-10 rounded-3xl border border-[#E6E0D2] shadow-xl space-y-8">
          
          {/* Top User Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#E6E0D2] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#FAF5EE] text-[#3B234A] font-serif font-bold text-2xl flex items-center justify-center border-2 border-[#D1A559] shadow-inner">
                {user.name.charAt(0)}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h1 className="heading-card text-2xl font-bold text-stone-900">{user.name}</h1>
                  <span className="badge-spiritual text-[10px] uppercase font-bold py-0.5 px-2">
                    {user.role ? user.role.replace('ROLE_', '') : 'SEEKER'}
                  </span>
                </div>
                <p className="text-xs text-stone-500 font-mono">
                  {user.phone ? `+91 ${user.phone}` : ''} {user.email ? `• ${user.email}` : ''}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => { logout(); setActiveTab('home'); }}
              className="btn-spiritual px-4 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition flex items-center gap-2 cursor-pointer min-h-[44px]"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.nav.logout}</span>
            </button>
          </div>

          {/* Subscription Info & Language Preference Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs">
            <div className="card-spiritual p-5 bg-white rounded-2xl border border-[#E6E0D2] shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-stone-500 uppercase font-bold text-[10px] tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#8B5E34]" />
                  Active Subscription
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  user.subscription.hasActivePlan ? 'badge-spiritual' : 'bg-stone-100 text-stone-600'
                }`}>
                  {user.subscription.hasActivePlan ? 'Active' : 'Free Tier'}
                </span>
              </div>
              <p className="font-serif font-bold text-stone-900 text-lg">{user.subscription.planName}</p>
              <p className="text-stone-500 text-xs">
                Valid until <strong className="text-stone-800 font-mono">{user.subscription.validUntil}</strong>
              </p>
            </div>

            {/* Language Preference */}
            <div className="card-spiritual p-5 bg-white rounded-2xl border border-[#E6E0D2] shadow-xs space-y-2">
              <span className="text-stone-500 uppercase font-bold text-[10px] tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#8B5E34]" />
                Language Preference
              </span>
              <p className="text-xs text-stone-600">Select your preferred audio and interface language:</p>
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`btn-spiritual flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
                    language === 'en'
                      ? 'btn-primary text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#E6E0D2]'
                  }`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('te')}
                  className={`btn-spiritual flex-1 py-2.5 px-4 rounded-xl text-xs font-bold font-telugu transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
                    language === 'te'
                      ? 'btn-primary text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#E6E0D2]'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>

            {/* Appearance / Theme Preference */}
            <div className="card-spiritual p-5 bg-white rounded-2xl border border-[#E6E0D2] shadow-xs space-y-2">
              <span className="text-stone-500 uppercase font-bold text-[10px] tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#8B5E34]" />
                Theme / Appearance
              </span>
              <p className="text-xs text-stone-600">Switch between light parchment and serene dark mode:</p>
              <div className="flex gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setTheme('light')}
                  className={`btn-spiritual flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
                    theme === 'light'
                      ? 'btn-primary text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#E6E0D2]'
                  }`}
                >
                  ☀️ Light Mode
                </button>
                <button
                  type="button"
                  onClick={() => setTheme('dark')}
                  className={`btn-spiritual flex-1 py-2.5 px-4 rounded-xl text-xs font-bold transition cursor-pointer min-h-[44px] flex items-center justify-center gap-1.5 ${
                    theme === 'dark'
                      ? 'btn-primary text-white shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 hover:bg-stone-100 border border-[#E6E0D2]'
                  }`}
                >
                  🌙 Dark Mode
                </button>
              </div>
            </div>
          </div>

          {/* Purchase History Table - Labeled as Sample Prototype Data */}
          <div className="pt-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="heading-card text-lg text-stone-900">Transaction & Purchase History</h3>
                <p className="text-xs text-stone-500">Record of all payments and session enrollments.</p>
              </div>
              <span className="badge-spiritual text-[10px] py-1 px-3 font-semibold uppercase tracking-wider self-start sm:self-auto">
                Sample Prototype Data
              </span>
            </div>
            
            <div className="card-spiritual rounded-2xl bg-white border border-[#E6E0D2] overflow-hidden shadow-xs">
              <table className="table-spiritual w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF7F0] text-stone-600 uppercase text-[10px] border-b border-[#E6E0D2]">
                  <tr>
                    <th className="p-4 font-sans font-bold">Transaction ID</th>
                    <th className="p-4 font-sans font-bold">Plan</th>
                    <th className="p-4 font-sans font-bold">Amount</th>
                    <th className="p-4 font-sans font-bold">Status</th>
                    <th className="p-4 font-sans font-bold">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E0D2] text-stone-700">
                  {user.subscription.hasActivePlan ? (
                    <tr className="hover:bg-amber-50/30 transition-colors">
                      <td className="p-4 text-stone-600">TRIPURA-DEMO-984321</td>
                      <td className="p-4 font-sans font-semibold text-stone-900">{user.subscription.planName}</td>
                      <td className="p-4 font-bold text-stone-900">₹1,111</td>
                      <td className="p-4">
                        <span className="badge-spiritual font-bold text-[10px] flex items-center gap-1 w-fit">
                          <ShieldCheck className="w-3 h-3" />
                          SUCCESS
                        </span>
                      </td>
                      <td className="p-4 text-stone-500">Oct 1, 2026</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-6 text-center text-stone-500 italic font-sans">
                        No previous transaction recorded
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </ScrollReveal>

    </div>
  );
};
