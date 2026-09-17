import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Globe, Shield } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { t, language, setLanguage } = useApp();

  return (
    <footer className="bg-[#201812] text-[#D8CFBF] border-t border-[#362A20] pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center">
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-white">
                TRIPURA
              </span>
              <span className="font-serif text-2xl font-extrabold text-[#D1A559] ml-1">.</span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed font-light">
              {t.footer.aboutText}
            </p>
            <span className="inline-block text-[11px] uppercase tracking-widest text-[#D1A559]">
              tripuraspiritual.com
            </span>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-serif text-white font-normal text-base mb-4 tracking-widest uppercase text-xs">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 text-xs font-light">
              {[
                { id: 'home', label: t.nav.home },
                { id: 'sessions', label: t.nav.sessions },
                { id: 'book-library', label: t.nav.bookLibrary },
                { id: 'demo', label: t.nav.demoClass },
                { id: 'onetoone', label: t.nav.oneToOne },
                { id: 'about', label: t.nav.about },
              ].map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => { setActiveTab(item.id); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="hover:text-[#D1A559] transition-colors"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div>
            <h4 className="font-serif text-white font-normal text-base mb-4 tracking-widest uppercase text-xs">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs text-stone-400 font-light">
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Tripura Spiritual Privacy Policy: All demo data remains local to your browser session."); }} className="hover:text-[#D1A559] transition">{t.footer.privacy}</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Tripura Spiritual Terms: Prototype evaluation license."); }} className="hover:text-[#D1A559] transition">{t.footer.terms}</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); alert("Contact Support: support@tripuraspiritual.com"); }} className="hover:text-[#D1A559] transition">{t.footer.contact}</a></li>
              <li>
                <a 
                  href="https://chat.whatsapp.com/TripuraSpiritualCommunity" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1.5 transition pt-1"
                >
                  <span>💬 WhatsApp Community</span>
                </a>
              </li>
              <li>
                <button onClick={() => { setActiveTab('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }} className="text-[#D1A559] hover:underline flex items-center gap-1 mt-2">
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t.nav.admin}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Language Switcher */}
          <div className="space-y-3">
            <h4 className="font-serif text-white font-normal text-base mb-2 tracking-widest uppercase text-xs flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#D1A559]" />
              <span>Language / భాష</span>
            </h4>
            <div className="flex gap-2">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  language === 'en'
                    ? 'bg-[#3B234A] border-[#3B234A] text-white'
                    : 'bg-[#2E231C] border-[#423329] text-stone-300 hover:bg-[#362A20]'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('te')}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition ${
                  language === 'te'
                    ? 'bg-[#3B234A] border-[#3B234A] text-white'
                    : 'bg-[#2E231C] border-[#423329] text-stone-300 hover:bg-[#362A20]'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-[#362A20] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500 font-light">
          <p>© {new Date().getFullYear()} Tripura Spiritual (tripuraspiritual.com). All rights reserved.</p>
          <p className="flex items-center gap-1 text-stone-400">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for Spiritual Awakening
          </p>
        </div>
      </div>
    </footer>
  );
};
