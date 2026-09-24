import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check, Smartphone, KeyRound, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScrollReveal } from '../components/ScrollReveal';

interface LoginProps {
  setActiveTab: (tab: string) => void;
}

export const Login: React.FC<LoginProps> = ({ setActiveTab }) => {
  const { loginWithEmailPassword, sendOtp, verifyOtpAndLogin, triggerLoginSuccessTransition } = useApp();
  
  const [authMethod, setAuthMethod] = useState<'otp' | 'email'>('otp');
  
  // Mobile OTP States
  const [mobile, setMobile] = useState('');
  const [otpStep, setOtpStep] = useState<'mobile' | 'otp'>('mobile');
  const [otp, setOtp] = useState('');

  // Email States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  
  // Common States
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanMobile = mobile.replace(/\D/g, '');
    if (!cleanMobile || cleanMobile.length !== 10) {
      setError('Please enter a valid 10-digit Indian mobile number');
      return;
    }

    setIsLoading(true);
    try {
      const res = await sendOtp(cleanMobile);
      setSuccessMsg(res.message);
      setOtpStep('otp');
    } catch (err: any) {
      setError(err.message || 'Could not send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length < 4) {
      setError('Please enter the OTP sent to your phone (Demo OTP: 123456)');
      return;
    }

    setIsLoading(true);
    try {
      const cleanMobile = mobile.replace(/\D/g, '');
      const success = await verifyOtpAndLogin(cleanMobile, cleanOtp);
      if (success) {
        setSuccessMsg('Sign in successful! Welcome to Tripura Spiritual.');
        triggerLoginSuccessTransition();
      } else {
        setError('Invalid OTP. Use Demo OTP: 123456');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'OTP verification failed. Use Demo OTP: 123456');
      setIsLoading(false);
    }
  };

  const validateEmail = () => {
    if (!email) {
      setError('Please enter your email address');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Please enter your password');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validateEmail()) return;

    setIsLoading(true);

    try {
      const success = await loginWithEmailPassword(email, password, rememberMe);
      if (success) {
        setSuccessMsg('Authentication successful!');
        triggerLoginSuccessTransition();
      } else {
        setError('Invalid email or password. Please try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      loginWithEmailPassword('google.seeker@tripura.org', 'GoogleAuth2026!', true);
      triggerLoginSuccessTransition();
    }, 600);
  };

  return (
    <div className="relative h-screen max-h-screen w-full flex flex-col justify-between overflow-hidden font-sans selection:bg-amber-200 selection:text-amber-900">
      
      {/* Full-Screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 scale-105"
        style={{ backgroundImage: `url('/auth_bg_meditation.jpg')` }}
      />
      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/60" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-4 flex items-center justify-between shrink-0">
        <div 
          onClick={() => setActiveTab('home')}
          className="cursor-pointer group flex items-center gap-1.5"
        >
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-white drop-shadow-md group-hover:text-amber-300 transition">
            T R I P U R A
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#D1A559] inline-block mb-1 shadow-sm"></span>
        </div>

        <button
          onClick={() => setActiveTab('home')}
          className="text-xs font-medium text-stone-200 hover:text-white transition-colors flex items-center gap-2 bg-black/20 hover:bg-black/40 px-3.5 py-1.5 rounded-full backdrop-blur-sm border border-white/10"
        >
          <span>←</span> Back to Home
        </button>
      </header>

      {/* Main Content Grid Fits Completely Inside 100vh Window */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center px-6 sm:px-12 lg:px-16 py-2 max-w-7xl mx-auto w-full gap-6 overflow-hidden">
        
        {/* Left Side Hero Tagline */}
        <div className="lg:col-span-6 space-y-6 max-w-lg hidden sm:block">
          <ScrollReveal variant="hero-zoom">
            <div className="space-y-3">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl text-white font-normal leading-[1.15] drop-shadow-lg">
                Be present.<br />
                Be open.<br />
                Be you.
              </h1>
              <div className="w-12 h-1 bg-[#C59B63] rounded-full my-3" />
              <p className="text-stone-200 text-sm font-light tracking-wide drop-shadow">
                A quieter mind for a brighter tomorrow.
              </p>
            </div>

            {/* Bottom Left Quote */}
            <div className="pt-4">
              <div className="pl-4 border-l-2 border-[#C59B63] space-y-1">
                <p className="font-serif italic text-white/90 text-sm tracking-wide drop-shadow-sm">
                  &ldquo;A calm mind is a powerful mind.&rdquo;
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side Form Card */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <ScrollReveal variant="fade-up" delay={100}>
            <div className="w-full max-w-md bg-[#FAF8F3]/95 backdrop-blur-md rounded-3xl p-6 sm:p-7 shadow-2xl border border-white/30 text-[#2C2421]">
              
              {/* Card Header */}
              <div className="space-y-1 mb-3">
                <h2 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C2421]">
                  Sign in to your account
                </h2>
                <p className="text-xs text-stone-600 font-normal">
                  Welcome back! Enter your mobile number or email.
                </p>
              </div>

              {/* Auth Method Segmented Tabs */}
              <div className="flex rounded-2xl bg-[#ECE7DC] p-1 mb-3.5 border border-[#DFD8CA]">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('otp'); setError(''); setSuccessMsg(''); }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    authMethod === 'otp'
                      ? 'bg-white text-[#2C2421] shadow-xs font-bold border border-amber-200/50'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#A3733A]" />
                  <span>Mobile OTP</span>
                  <span className="text-[9px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded-full font-medium">Easy</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('email'); setError(''); setSuccessMsg(''); }}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                    authMethod === 'email'
                      ? 'bg-white text-[#2C2421] shadow-xs font-bold border border-amber-200/50'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#A3733A]" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* Notifications */}
              {error && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn">
                  <Check className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* MOBILE OTP FLOW */}
              {authMethod === 'otp' ? (
                otpStep === 'mobile' ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Mobile Number / మొబైల్ నంబర్
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-2.5 text-stone-700 font-bold text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="9876543210"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-12 pr-4 py-2 rounded-full border border-stone-300 bg-white/90 focus:bg-white focus:border-[#A3733A] focus:ring-2 focus:ring-[#A3733A]/20 text-xs text-stone-900 font-semibold outline-none transition placeholder:text-stone-400"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-5 rounded-full bg-[#A3733A] hover:bg-[#8E612B] active:bg-[#785122] text-white font-medium text-xs transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-1"
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Get OTP / ఓటీపీ పొందండి</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="p-2.5 bg-[#EFE9DD] rounded-2xl border border-[#D8CFBF] text-center space-y-1">
                      <span className="text-[11px] text-stone-600 block">OTP Sent to <strong>+91 {mobile}</strong></span>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#3B234A] text-white text-[10px] font-bold font-mono tracking-wider">
                        Demo OTP: 123456
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                        Enter 6-Digit OTP / ఓటీపీ నమోదు చేయండి
                      </label>
                      <div className="relative">
                        <KeyRound className="absolute left-3.5 top-2.5 w-3.5 h-3.5 text-stone-400" />
                        <input
                          type="text"
                          maxLength={6}
                          required
                          placeholder="123456"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-300 bg-white text-[#2C2421] font-mono tracking-widest text-center text-base font-bold outline-none transition"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-2.5 px-5 rounded-full bg-[#A3733A] hover:bg-[#8E612B] text-white font-medium text-xs transition-all duration-200 shadow-md flex items-center justify-center gap-2 disabled:opacity-70 group"
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Verify & Sign In / లాగిన్</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setOtpStep('mobile'); setError(''); }}
                      className="w-full text-[11px] text-stone-500 hover:text-stone-800 underline text-center block pt-1"
                    >
                      Change Mobile Number
                    </button>
                  </form>
                )
              ) : (
                /* EMAIL & PASSWORD FLOW */
                <form onSubmit={handleEmailSubmit} className="space-y-3">
                  {/* Email Field */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Email
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-300 bg-white/90 focus:bg-white focus:border-[#A3733A] focus:ring-2 focus:ring-[#A3733A]/20 text-xs text-stone-900 outline-none transition placeholder:text-stone-400"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 rounded-full border border-stone-300 bg-white/90 focus:bg-white focus:border-[#A3733A] focus:ring-2 focus:ring-[#A3733A]/20 text-xs text-stone-900 outline-none transition placeholder:text-stone-400"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition"
                      >
                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password Row */}
                  <div className="flex items-center justify-between text-[11px] pt-0.5">
                    <label className="flex items-center gap-1.5 cursor-pointer text-stone-700 select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="w-3.5 h-3.5 rounded border-stone-300 text-[#A3733A] focus:ring-[#A3733A] accent-[#A3733A]"
                      />
                      <span>Remember me</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => setError('Password reset instructions have been sent if account exists.')}
                      className="text-[#A3733A] hover:underline font-medium transition"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 px-5 rounded-full bg-[#A3733A] hover:bg-[#8E612B] active:bg-[#785122] text-white font-medium text-xs transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-1"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Social Auth Separator */}
              <div className="relative my-3.5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-stone-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase">
                  <span className="bg-[#FAF8F3] px-2.5 text-stone-400 tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition shadow-xs"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* Footer Navigation Link */}
              <div className="mt-4 text-center text-[11px] text-stone-600">
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="text-[#A3733A] hover:underline font-semibold ml-1"
                >
                  Sign up
                </button>
              </div>

            </div>
          </ScrollReveal>
        </div>

      </main>

      {/* Footer spacer */}
      <footer className="relative z-10 w-full py-2 text-center text-[10px] text-white/50 shrink-0">
        &copy; {new Date().getFullYear()} Tripura Spiritual. All rights reserved.
      </footer>
    </div>
  );
};
