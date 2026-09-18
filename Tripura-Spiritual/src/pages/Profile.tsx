import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut } from 'lucide-react';

interface ProfileProps {
  setActiveTab: (tab: string) => void;
}

export const Profile: React.FC<ProfileProps> = ({ setActiveTab }) => {
  const { user, logout, language, setLanguage, t } = useApp();

  if (!user.isLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-16 text-center">
        <p className="text-stone-600 text-sm">Please login to view profile settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8 animate-fadeIn">
      
      <div className="glass-panel p-8 rounded-3xl border border-amber-200 shadow-xl space-y-6">
        <div className="flex justify-between items-start border-b border-amber-200/60 pb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-800 font-serif font-bold text-2xl flex items-center justify-center border border-amber-300">
              {user.name.charAt(0)}
            </div>
            <div>
              <h1 className="font-serif text-2xl font-bold text-stone-900">{user.name}</h1>
              <p className="text-xs text-stone-500 font-mono">+91 {user.phone}</p>
            </div>
          </div>

          <button
            onClick={() => { logout(); setActiveTab('home'); }}
            className="px-4 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.nav.logout}</span>
          </button>
        </div>

        {/* Subscription Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-white rounded-2xl border border-amber-100">
            <span className="text-stone-500 uppercase font-semibold text-[10px]">Active Subscription</span>
            <p className="font-serif font-bold text-stone-900 text-base mt-1">{user.subscription.planName}</p>
            <p className="text-stone-500 mt-1">Valid until {user.subscription.validUntil}</p>
          </div>

          <div className="p-4 bg-white rounded-2xl border border-amber-100">
            <span className="text-stone-500 uppercase font-semibold text-[10px]">Language Preference</span>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  language === 'en' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  language === 'te' ? 'bg-amber-600 text-white' : 'bg-stone-100 text-stone-700'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>

        {/* Purchase History Table */}
        <div className="pt-4 space-y-3">
          <h3 className="font-serif font-bold text-stone-900 text-lg">Transaction & Purchase History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-amber-50 text-amber-900 uppercase">
                <tr>
                  <th className="p-3 rounded-l-xl">Transaction ID</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 rounded-r-xl">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 text-stone-700">
                {user.subscription.hasActivePlan ? (
                  <tr>
                    <td className="p-3">TRIPURA-DEMO-984321</td>
                    <td className="p-3 font-semibold">{user.subscription.planName}</td>
                    <td className="p-3">₹599</td>
                    <td className="p-3 text-emerald-700 font-bold">SUCCESS</td>
                    <td className="p-3">Sept 1, 2026</td>
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

    </div>
  );
};
