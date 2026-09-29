import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { X, Smartphone, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';

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

  const triggerRef = useRef<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Capture previous active element and manage focus on open/close
  useEffect(() => {
    if (isAuthOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        } else {
          modalRef.current?.focus();
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      triggerRef.current?.focus();
    }
  }, [isAuthOpen, step]);

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
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-md animate-backdrop-fade"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAuthModal();
      }}
    >
      <div 
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
        tabIndex={-1}
        className="bg-[#FAF8F5] rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E6E0D2] relative overflow-hidden text-[#2C2421] animate-modal-scale-in focus:outline-none"
      >
        
        {/* Close Button */}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 p-2.5 rounded-full text-stone-400 hover:text-stone-800 hover:bg-stone-200/60 transition cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Close Authentication Modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#EFE9DD] text-[#3B234A] mx-auto flex items-center justify-center mb-3 shadow-xs">
            <Smartphone className="w-7 h-7 text-[#8B5E34]" />
          </div>
          <h3 id="auth-modal-title" className="font-serif text-2xl font-bold text-[#2C2421]">
            {t.auth.title}
          </h3>
          <p className="text-xs text-stone-600 mt-1 font-normal">
            Tripura Spiritual Simple Sign In
          </p>
        </div>

        {/* Step 1: Mobile Form */}
        {step === 'mobile' ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div className="form-group">
              <label className="form-label text-[#7A7067]">
                {t.auth.mobileLabel}
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-stone-600 font-bold text-base select-none">
                  +91
                </span>
                <input
                  ref={inputRef}
                  type="tel"
                  maxLength={10}
                  placeholder="9999999999"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-16 pr-4 py-3 rounded-full border border-[#D8CFBF] bg-white focus:border-[#D1A559] focus:ring-2 focus:ring-[#D1A559]/20 text-[#2C2421] font-bold text-base outline-none transition min-h-[48px]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-spiritual btn-primary w-full py-3.5 text-white font-semibold text-xs tracking-widest uppercase shadow-md transition disabled:opacity-60 cursor-pointer min-h-[48px]"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
              ) : (
                t.auth.sendOtp
              )}
            </button>
          </form>
        ) : (
          /* Step 2: OTP Form */
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="p-3.5 bg-[#EFE9DD] rounded-2xl border border-[#D8CFBF] text-center space-y-1">
              <span className="text-xs text-stone-600 block">OTP Sent to <strong>+91 {mobile}</strong></span>
              <span className="inline-block px-3 py-1 rounded-full bg-[#3B234A] text-white text-xs font-bold font-mono tracking-wider shadow-xs">
                {t.auth.demoOtpNotice}
              </span>
            </div>

            <div className="form-group">
              <label className="form-label text-[#7A7067]">
                {t.auth.enterOtp}
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-3.5 w-5 h-5 text-stone-400" />
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-full border border-[#D8CFBF] bg-white text-[#2C2421] font-mono tracking-widest text-center text-xl font-bold outline-none transition min-h-[48px]"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="btn-spiritual btn-primary w-full py-3.5 text-white font-semibold text-xs tracking-widest uppercase shadow-md transition flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer min-h-[48px]"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-amber-300" />
                  <span>{t.auth.verifyOtp}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => { setStep('mobile'); setError(''); }}
              className="w-full text-xs text-[#8B5E34] hover:text-[#6e4623] underline text-center cursor-pointer min-h-[36px] py-1"
            >
              Change Mobile Number
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
