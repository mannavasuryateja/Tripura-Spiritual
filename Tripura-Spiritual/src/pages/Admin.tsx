import React from 'react';
import { useApp } from '../context/AppContext';
import { Users, CreditCard, Video, Shield, Lock, Unlock, CheckCircle2 } from 'lucide-react';

export const Admin: React.FC = () => {
  const { t, adminOverrides, toggleAdminUserDayAccess } = useApp();

  const demoUsersList = [
    { phone: '9999999999', name: 'Suryateja (Demo User A)', plan: '11-Day Spiritual Session Plan', status: 'Active' },
    { phone: '8888888888', name: 'Vikram Kumar (Demo User B)', plan: 'Restricted Access Plan', status: 'Restricted' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fadeIn">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-900 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Management Console</span>
          </div>
          <h1 className="font-serif text-3xl font-bold text-stone-900">{t.admin.title}</h1>
          <p className="text-stone-600 text-sm">{t.admin.subtitle}</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
          <Users className="w-5 h-5 text-amber-600" />
          <span className="text-[11px] text-stone-500 font-semibold uppercase block">{t.admin.totalUsers}</span>
          <span className="text-2xl font-bold font-sans text-stone-900">1,240</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          <span className="text-[11px] text-stone-500 font-semibold uppercase block">{t.admin.activeSubscribers}</span>
          <span className="text-2xl font-bold font-sans text-stone-900">890</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
          <CreditCard className="w-5 h-5 text-amber-600" />
          <span className="text-[11px] text-stone-500 font-semibold uppercase block">{t.admin.totalPayments}</span>
          <span className="text-2xl font-bold font-sans text-stone-900">₹5.34L</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1">
          <Video className="w-5 h-5 text-amber-600" />
          <span className="text-[11px] text-stone-500 font-semibold uppercase block">{t.admin.activeSessions}</span>
          <span className="text-2xl font-bold font-sans text-stone-900">3</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-amber-200 shadow-xs space-y-1 col-span-2 lg:col-span-1">
          <Shield className="w-5 h-5 text-amber-600" />
          <span className="text-[11px] text-stone-500 font-semibold uppercase block">{t.admin.recordingsCount}</span>
          <span className="text-2xl font-bold font-sans text-stone-900">11</span>
        </div>
      </div>

      {/* User Recording Access Management Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-amber-200 shadow-xl space-y-6">
        <div>
          <h3 className="font-serif text-2xl font-bold text-stone-900">{t.admin.userTable}</h3>
          <p className="text-xs text-stone-500">Toggle individual recording day access (Day 1 - Day 11) per user in real time for client demonstration.</p>
        </div>

        <div className="space-y-6">
          {demoUsersList.map((userItem) => {
            const userDays = adminOverrides[userItem.phone] || [];

            return (
              <div key={userItem.phone} className="p-5 bg-white rounded-2xl border border-stone-200 space-y-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-stone-900 text-base">{userItem.name}</h4>
                    <p className="text-xs text-stone-500 font-mono">+91 {userItem.phone} • {userItem.plan}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    userItem.status === 'Active' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                  }`}>
                    {userItem.status}
                  </span>
                </div>

                <div>
                  <span className="text-xs font-semibold text-stone-700 block mb-2">
                    Granular Recording Access Controls (Click to toggle Day lock state):
                  </span>

                  <div className="flex flex-wrap gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((dayNum) => {
                      const isUnlocked = userDays.includes(dayNum);

                      return (
                        <button
                          key={dayNum}
                          onClick={() => toggleAdminUserDayAccess(userItem.phone, dayNum)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 border transition ${
                            isUnlocked
                              ? 'bg-emerald-600 border-emerald-700 text-white shadow-xs'
                              : 'bg-stone-100 border-stone-300 text-stone-500 hover:bg-stone-200'
                          }`}
                        >
                          {isUnlocked ? <Unlock className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
                          <span>Day {dayNum}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
