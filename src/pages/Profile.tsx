import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, User } from 'lucide-react';
import { ScrollReveal } from '../components/ScrollReveal';

interface ProfileProps {
  setActiveTab: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ setActiveTab }) => {
  const { user, logout, language, setLanguage, openAuthModal, t } = useApp();

  if (!user.isLoggedIn) {
    return (
      <div className="section-container max-w-md mx-auto py-20 text-center space-y-6 animate-fadeIn text-[#2C2421]">
        <ScrollReveal animation="hero-zoom">
          <div className="w-16 h-16 rounded-full bg-[#EFE9DD] text-[#3B234A] flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="heading-section font-bold text-[#2C2421]">Sign In to View Profile</h2>
          <p className="text-stone-600 text-sm max-w-sm mx-auto">
            Please log in with your credentials or mobile OTP to access your account settings and preferences.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-4">
            <button
              onClick={openAuthModal}
              className="btn-spiritual btn-primary px-6 py-3 rounded-full text-xs tracking-widest uppercase shadow-md transition"
            >
              Sign In with OTP
            </button>
            <button
              onClick={() => setActiveTab('login')}
              className="btn-spiritual btn-outline px-6 py-3 rounded-full text-[#3B234A] border-[#3B234A] hover:bg-[#3B234A]/10 text-xs tracking-widest uppercase transition"
            >
              Email Sign In
            </button>
          </div>
        </ScrollReveal>
      </div>
    );
  }

  return (
    <div className="section-container max-w-4xl py-12 space-y-8 animate-fadeIn text-[#2C2421]">
      
      <ScrollReveal animation="hero-zoom">
        <div className="glass-panel p-8 rounded-3xl border border-[#E6E0D2] shadow-xl space-y-6">
          <div className="flex justify-between items-start border-b border-[#E6E0D2] pb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-[#EFE9DD] text-[#3B234A] font-serif font-bold text-2xl flex items-center justify-center border border-[#D8CFBF]">
                {user.name.charAt(0)}
              </div>
              <div>
                <h1 className="heading-card font-serif text-2xl font-bold text-stone-900">{user.name}</h1>
                <p className="text-xs text-stone-500 font-mono">+91 {user.phone}</p>
              </div>
            </div>

            <button
              onClick={() => { logout(); setActiveTab('home'); }}
              className="btn-spiritual px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition flex items-center gap-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>{t.nav.logout}</span>
            </button>
          </div>

          {/* Subscription Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-white rounded-2xl border border-[#E6E0D2] shadow-xs">
              <span className="text-stone-500 uppercase font-semibold text-[10px]">Active Subscription</span>
              <p className="font-serif font-bold text-stone-900 text-base mt-1">{user.subscription.planName}</p>
              <p className="text-stone-500 mt-1">Valid until {user.subscription.validUntil}</p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E6E0D2] shadow-xs">
              <span className="text-stone-500 uppercase font-semibold text-[10px]">Language Preference</span>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setLanguage('en')}
                  className={`btn-spiritual px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    language === 'en' ? 'bg-[#8B5E34] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage('te')}
                  className={`btn-spiritual px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    language === 'te' ? 'bg-[#8B5E34] text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  తెలుగు
                </button>
              </div>
            </div>
          </div>

          {/* Purchase History Table - Labeled as Sample Prototype Data */}
          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="heading-card font-serif font-bold text-stone-900 text-lg">Transaction & Purchase History</h3>
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-200 font-sans font-semibold uppercase tracking-wider">
                Sample Prototype Data
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[#FAF7F0] text-stone-600 uppercase text-[10px] border-b border-[#E6E0D2]">
                  <tr>
                    <th className="p-3 rounded-l-xl">Transaction ID</th>
                    <th className="p-3">Plan</th>
                    <th className="p-3">Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 rounded-r-xl">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E0D2] text-stone-700">
                  {user.subscription.hasActivePlan ? (
                    <tr>
                      <td className="p-3">TRIPURA-DEMO-984321</td>
                      <td className="p-3 font-semibold">{user.subscription.planName}</td>
                      <td className="p-3">₹1,111</td>
                      <td className="p-3 text-emerald-700 font-bold">SUCCESS</td>
                      <td className="p-3">Oct 1, 2026</td>
                    </tr>
                  ) : (
                    <tr>
                      <td colSpan={5} className="p-4 text-center text-stone-500 italic">No previous transaction recorded</td>
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
