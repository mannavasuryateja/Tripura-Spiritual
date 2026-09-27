import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Smartphone, KeyRound, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  onSuccessRedirect?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccessRedirect }) => {
  const { isAuthOpen, closeAuthModal, sendOtp, verifyOtpAndLogin, triggerLoginSuccessTransition, t } = useApp();
  const [mobile, setMobile] = useState('');
  const [step, setStep] = useState<'mobile' | 'otp'>('mobile');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isAuthOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit mobile number');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await sendOtp(cleanMobile);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || 'Could not send OTP. Please ensure backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setError('Please enter OTP (Demo OTP: 123456)');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const success = await verifyOtpAndLogin(cleanMobile, cleanOtp);
      if (success) {
        closeAuthModal();
        triggerLoginSuccessTransition();
        if (onSuccessRedirect) onSuccessRedirect();
      }
    } catch (err: any) {
      setError(err.message || 'Invalid OTP code.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FAF7F0] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E6E0D2] relative overflow-hidden text-[#2C2421]">
        
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center mb-3">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl font-normal text-[#2C2421]">
            {t.auth.title}
          </h3>
          <p className="text-xs text-stone-600 mt-1">
            Tripura Spiritual Simple Sign In
          </p>
        </div>

        {/* Step 1: Mobile Form */}
        {step === 'mobile' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7067] mb-1.5">
                {t.auth.mobileLabel}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3.5 text-stone-600 font-bold text-base">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  placeholder="9999999999"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-16 pr-4 py-3 rounded-2xl border border-[#D8CFBF] bg-white focus:border-[#3B234A] focus:ring-2 focus:ring-[#3B234A]/20 text-[#2C2421] font-bold text-base outline-none transition"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-semibold text-xs tracking-widest uppercase shadow-md transition disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              ) : (
                t.auth.sendOtp
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3 bg-[#EFE9DD] rounded-2xl border border-[#D8CFBF] text-center space-y-1">
              <span className="text-xs text-stone-600 block">OTP Sent to +91 {mobile}</span>
              <span className="inline-block px-3 py-1 rounded-full bg-[#3B234A] text-white text-xs font-bold font-mono tracking-wider">
                {t.auth.demoOtpNotice}
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#7A7067] mb-1.5">
                {t.auth.enterOtp}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
                <input
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl border border-[#D8CFBF] bg-white text-[#2C2421] font-mono tracking-widest text-center text-xl font-bold outline-none transition"
                />
              </div>
            </div>

            {error && <p className="text-xs text-rose-600 font-medium text-center">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-full bg-[#3B234A] hover:bg-[#2C1838] text-white font-semibold text-xs tracking-widest uppercase shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.auth.verifyOtp}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('mobile'); setError(''); }}
              className="w-full text-xs text-stone-500 hover:text-stone-800 underline text-center"
            >
              Change Mobile Number
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
