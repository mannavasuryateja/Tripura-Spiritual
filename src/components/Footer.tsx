import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Globe, Shield } from 'lucide-react';

interface FooterProps {
  activeTab?: string;
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ activeTab, setActiveTab }) => {
  const { t, language, setLanguage } = useApp();

  return (
    <footer className="bg-[#F8F5EE] text-[#4A3E31] border-t border-[#E6E0D2] relative overflow-hidden pt-10 sm:pt-14 pb-8 sm:pb-10 mt-12 sm:mt-16 transition-colors duration-300">
      
      {/* Decorative Oversized Brand Watermark */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 pointer-events-none select-none overflow-hidden opacity-[0.04] text-center w-full z-0">
        <span className="font-serif text-[70px] sm:text-[120px] md:text-[160px] font-bold tracking-[0.25em] text-[#4A3E31] uppercase leading-none block whitespace-nowrap">
          TRIPURA
        </span>
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-8 sm:mb-10">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-1 space-y-4">
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="flex items-center text-left cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5E34] rounded-lg p-0.5"
              aria-label="Tripura Spiritual Home"
            >
              <span className="font-serif text-2xl font-bold tracking-[0.25em] text-[#2D241E] hover:text-[#9A6B32] transition-colors duration-300">
                TRIPURA
              </span>
              <span className="font-serif text-2xl font-extrabold text-[#9A6B32] ml-0.5">.</span>
            </button>
            <p className="text-[#62584D] text-sm leading-relaxed font-light">
              {t.footer.aboutText}
            </p>
            <button
              type="button"
              onClick={() => setActiveTab('home')}
              className="inline-block text-[11px] font-medium uppercase tracking-[0.2em] text-[#9A6B32] hover:text-[#7A5224] transition-colors cursor-pointer text-left"
            >
              tripuraspiritual.com
            </button>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="font-serif text-[#2D241E] font-medium text-xs mb-5 tracking-[0.2em] uppercase">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2.5 text-xs font-light">
              {[
                { id: 'home', label: t.nav.home },
                { id: 'sessions', label: t.nav.sessions },
                { id: 'book-library', label: t.nav.bookLibrary },
                { id: 'demo', label: t.nav.demoClass },
                { id: 'onetoone', label: t.nav.oneToOne },
                { id: 'about', label: t.nav.about },
              ].map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative inline-block transition-all duration-300 ease-out hover:-translate-y-[1px] hover:drop-shadow-[0_0_8px_rgba(180,130,60,0.35)] py-0.5 cursor-pointer ${
                        isActive ? 'text-[#9A6B32] font-semibold' : 'text-[#5F554B] hover:text-[#9A6B32]'
                      }`}
                    >
                      <span>{item.label}</span>
                      <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#9A6B32] transition-transform duration-300 ease-out origin-center ${
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                      }`} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div>
            <h4 className="font-serif text-[#2D241E] font-medium text-xs mb-5 tracking-[0.2em] uppercase">
              {t.footer.legal}
            </h4>
            <ul className="space-y-2 text-xs text-stone-600 font-light">
              <li><a href="#privacy" onClick={(e) => { e.preventDefault(); alert("Tripura Spiritual Privacy Policy: All demo data remains local to your browser session."); }} className="hover:text-[#9A6B32] transition">{t.footer.privacy}</a></li>
              <li><a href="#terms" onClick={(e) => { e.preventDefault(); alert("Tripura Spiritual Terms: Prototype evaluation license."); }} className="hover:text-[#9A6B32] transition">{t.footer.terms}</a></li>
              <li><a href="#contact" onClick={(e) => { e.preventDefault(); alert("Contact Support: support@tripuraspiritual.com"); }} className="hover:text-[#9A6B32] transition">{t.footer.contact}</a></li>
              <li>
                <a 
                  href="https://chat.whatsapp.com/TripuraSpiritualCommunity" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="group relative inline-flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800 transition-all duration-300 ease-out hover:-translate-y-[1px] hover:drop-shadow-[0_0_8px_rgba(16,185,129,0.25)] py-0.5"
                >
                  <span>💬 WhatsApp Community</span>
                  <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-emerald-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-center" />
                </a>
              </li>
              <li>
                <button 
                  type="button"
                  onClick={() => setActiveTab('admin')} 
                  aria-current={activeTab === 'admin' ? 'page' : undefined}
                  className={`group relative inline-flex items-center gap-1.5 transition-all duration-300 ease-out hover:-translate-y-[1px] hover:drop-shadow-[0_0_8px_rgba(180,130,60,0.35)] pt-1.5 font-medium cursor-pointer ${
                    activeTab === 'admin' ? 'text-[#7A5224] font-semibold' : 'text-[#9A6B32] hover:text-[#7A5224]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>{t.nav.admin}</span>
                  <span className={`absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#9A6B32] transition-transform duration-300 ease-out origin-center ${
                    activeTab === 'admin' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                  }`} />
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Language Switcher */}
          <div className="space-y-4">
            <h4 className="font-serif text-[#2D241E] font-medium text-xs tracking-[0.2em] uppercase flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#9A6B32]" />
              <span>Language / భాష</span>
            </h4>
            <div className="flex gap-2" role="group" aria-label="Language Switcher">
              <button
                type="button"
                onClick={() => setLanguage('en')}
                aria-pressed={language === 'en'}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 shadow-xs cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#9A6B32] border-[#9A6B32] text-white'
                    : 'bg-[#EFEAE1] border-[#DCD3C5] text-[#5F554B] hover:bg-[#E5DEC3] hover:text-[#2D241E]'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguage('te')}
                aria-pressed={language === 'te'}
                className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 shadow-xs cursor-pointer ${
                  language === 'te'
                    ? 'bg-[#9A6B32] border-[#9A6B32] text-white'
                    : 'bg-[#EFEAE1] border-[#DCD3C5] text-[#5F554B] hover:bg-[#E5DEC3] hover:text-[#2D241E]'
                }`}
              >
                తెలుగు
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Section */}
        <div className="border-t border-[#E6E0D2] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#7A6E62] font-light">
          <p>© {new Date().getFullYear()} Tripura Spiritual ({t.footer.disclaimer || 'tripuraspiritual.com'}). All rights reserved.</p>
          <p className="flex items-center gap-1 text-[#62584D]">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-600 fill-rose-500 inline transition-transform hover:scale-110" /> for Spiritual Awakening
          </p>
        </div>
      </div>
    </footer>
  );
};


