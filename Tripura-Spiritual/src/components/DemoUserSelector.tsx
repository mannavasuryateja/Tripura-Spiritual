import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserCheck, Lock, RotateCcw, ChevronUp, ChevronDown, Sliders } from 'lucide-react';

export const DemoUserSelector: React.FC = () => {
  const { user, switchDemoUser, resetDemoState } = useApp();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {isOpen ? (
        <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-2xl border border-amber-500/40 w-72 space-y-3 animate-fadeIn">
          <div className="flex justify-between items-center pb-2 border-b border-stone-800">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Demo Mode Selector</span>
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="text-stone-400 hover:text-white p-1"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-stone-400">
            Current user: <strong className="text-white">{user.name}</strong> ({user.phone || 'Guest'})
          </p>

          <div className="space-y-2">
            <button
              onClick={() => switchDemoUser('9999999999')}
              className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                user.phone === '9999999999' && user.subscription.hasActivePlan
                  ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
                  : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750'
              }`}
            >
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <div>
                  <span className="block font-bold">Subscribed User</span>
                  <span className="text-[10px] text-stone-400 font-mono">9999999999 (Full Access)</span>
                </div>
              </div>
              <span className="bg-emerald-600 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">Active</span>
            </button>

            <button
              onClick={() => switchDemoUser('8888888888')}
              className={`w-full p-2.5 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition ${
                user.phone === '8888888888' || !user.subscription.hasActivePlan
                  ? 'bg-rose-950/80 border-rose-500 text-rose-300'
                  : 'bg-stone-800 border-stone-700 text-stone-300 hover:bg-stone-750'
              }`}
            >
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-rose-400" />
                <div>
                  <span className="block font-bold">Restricted User</span>
                  <span className="text-[10px] text-stone-400 font-mono">8888888888 (Locked Days)</span>
                </div>
              </div>
              <span className="bg-rose-600 text-white text-[9px] px-1.5 py-0.5 rounded uppercase font-bold">Locked</span>
            </button>
          </div>

          <div className="pt-2 border-t border-stone-800">
            <button
              onClick={resetDemoState}
              className="w-full py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center justify-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Reset Prototype State</span>
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-stone-900 text-amber-400 border border-amber-500/40 shadow-xl hover:bg-stone-800 text-xs font-bold transition transform hover:scale-105"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>Demo Users Switcher</span>
          <ChevronUp className="w-3.5 h-3.5 text-stone-400" />
        </button>
      )}
    </div>
  );
};
