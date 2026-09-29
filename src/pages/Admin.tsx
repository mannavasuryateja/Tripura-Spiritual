import React from 'react';
import { AdminPanel } from '../components/AdminPanel';
import { Shield } from 'lucide-react';
import { RoleGuard } from '../components/RoleGuard';
import { useApp } from '../context/AppContext';
import { ScrollReveal } from '../components/ScrollReveal';

interface AdminProps {
  setActiveTab?: (tab: string) => void;
}

export const Admin: React.FC<AdminProps> = ({ setActiveTab }) => {
  const { openAuthModal } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <RoleGuard
        allowedRoles={['ROLE_ADMIN']}
        fallback={
          <ScrollReveal animation="hero-zoom">
            <div className="card-spiritual glass-panel max-w-lg mx-auto p-8 sm:p-10 rounded-3xl border border-[#E6E0D2] text-center space-y-5 my-12 shadow-xl">
              <div className="w-16 h-16 rounded-full bg-[#FAF5EE] text-[#3B234A] flex items-center justify-center mx-auto border border-[#E6E0D2] shadow-inner">
                <Shield className="w-8 h-8 text-[#8B5E34]" />
              </div>
              <div className="space-y-2">
                <span className="section-eyebrow">Restricted Portal</span>
                <h2 className="heading-section text-2xl text-[#2C2421]">Administrator Access Required</h2>
                <p className="text-xs text-stone-600 leading-relaxed max-w-sm mx-auto">
                  This portal is strictly restricted to platform administrators. Please sign in with your administrative credentials to access this matrix.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (setActiveTab) setActiveTab('login');
                  }}
                  className="btn-spiritual btn-primary px-7 py-3 rounded-full text-xs font-bold uppercase tracking-wider cursor-pointer min-h-[44px]"
                >
                  Sign In to Admin
                </button>
                <button
                  type="button"
                  onClick={openAuthModal}
                  className="btn-spiritual btn-outline px-7 py-3 rounded-full text-[#3B234A] border-[#3B234A] hover:bg-[#3B234A]/10 text-xs font-bold uppercase tracking-wider cursor-pointer min-h-[44px]"
                >
                  Sign In with OTP
                </button>
              </div>
            </div>
          </ScrollReveal>
        }
      >
        <AdminPanel />
      </RoleGuard>
    </div>
  );
};

export default Admin;
