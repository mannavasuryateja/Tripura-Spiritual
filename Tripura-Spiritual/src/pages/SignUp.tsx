import React, { useState } from 'react';
import { User as UserIcon, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScrollReveal } from '../components/ScrollReveal';

interface SignUpProps {
  setActiveTab: (tab: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ setActiveTab }) => {
  const { signUpWithEmailPassword, loginWithEmailPassword, triggerLoginSuccessTransition } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Password Security Analysis
  const passwordCriteria = {
    length: password.length >= 6,
    number: /\d/.test(password),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };

  const getPasswordScore = () => {
    let score = 0;
    if (passwordCriteria.length) score += 1;
    if (passwordCriteria.number) score += 1;
    if (passwordCriteria.specialChar) score += 1;
    return score;
  };

  const score = getPasswordScore();

  const validate = () => {
    if (!name.trim() || name.trim().length < 2) {
      setError('Please enter your full name (at least 2 characters)');
      return false;
    }
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
      setError('Please create a password');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const success = await signUpWithEmailPassword(name, email, password);
      if (success) {
        setSuccessMsg('Account created successfully! Welcome to Tripura Spiritual.');
        triggerLoginSuccessTransition();
      } else {
        setError('Could not create account. An account with this email may already exist.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please check your details.');
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
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
        style={{ backgroundImage: `url('/auth_bg_lotus.jpg')` }}
      />
      {/* Dark Ambient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/60" />

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
                Begin your<br />
                journey within.
              </h1>
              <div className="w-12 h-1 bg-[#C59B63] rounded-full my-3" />
              <p className="text-stone-200 text-sm font-light tracking-wide leading-relaxed drop-shadow">
                Learn. Practice. Grow.<br />
                At your own pace.
              </p>
            </div>

            {/* Bottom Left Quote */}
            <div className="pt-4">
              <div className="pl-4 border-l-2 border-[#C59B63] space-y-1">
                <p className="font-serif italic text-white/90 text-sm tracking-wide drop-shadow-sm">
                  &ldquo;Small steps create profound change.&rdquo;
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
                  Create an account
                </h2>
                <p className="text-xs text-stone-600 font-normal">
                  Join our community and start your journey.
                </p>
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

              {/* Sign Up Form */}
              <form onSubmit={handleSubmit} className="space-y-3">
                
                {/* Full Name Field */}
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <UserIcon className="w-3.5 h-3.5" />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-full border border-stone-300 bg-white/90 focus:bg-white focus:border-[#A3733A] focus:ring-2 focus:ring-[#A3733A]/20 text-xs text-stone-900 outline-none transition placeholder:text-stone-400"
                    />
                  </div>
                </div>

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
                      placeholder="Create a password"
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

                  {/* Password Strength Indicator */}
                  {password.length > 0 && (
                    <div className="mt-1.5 space-y-1 px-1">
                      <div className="flex gap-1 h-1">
                        <div className={`flex-1 rounded-full transition-colors ${score >= 1 ? 'bg-amber-500' : 'bg-stone-200'}`} />
                        <div className={`flex-1 rounded-full transition-colors ${score >= 2 ? 'bg-amber-600' : 'bg-stone-200'}`} />
                        <div className={`flex-1 rounded-full transition-colors ${score >= 3 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-stone-500">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#A3733A]" />
                          Security Check
                        </span>
                        <span>
                          {score === 1 && 'Weak'}
                          {score === 2 && 'Good'}
                          {score === 3 && 'Strong Password'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 px-5 rounded-full bg-[#A3733A] hover:bg-[#8E612B] active:bg-[#785122] text-white font-medium text-xs transition-all duration-200 shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group mt-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Sign Up</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>

              {/* Social Auth Separator */}
              <div className="relative my-3">
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
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="w-full py-2 px-4 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2.5 transition shadow-xs"
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
              <div className="mt-3.5 text-center text-[11px] text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-[#A3733A] hover:underline font-semibold ml-1"
                >
                  Sign in
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
