import React, { useState } from 'react';
import { User as UserIcon, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, AlertCircle, Check, ShieldCheck, Smartphone, KeyRound, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ScrollReveal } from '../components/ScrollReveal';

interface SignUpProps {
  setActiveTab: (tab: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ setActiveTab }) => {
  const { signUpWithEmailPassword, sendOtp, verifyOtpAndLogin, loginWithEmailPassword, triggerLoginSuccessTransition } = useApp();

  const [authMethod, setAuthMethod] = useState<'otp' | 'email'>('otp');

  // Mobile OTP States
  const [mobile, setMobile] = useState('');
  const [otpStep, setOtpStep] = useState<'mobile' | 'otp'>('mobile');
  const [otp, setOtp] = useState('');

  // Email States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Common States
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
      setError(import.meta.env.DEV ? 'Please enter the OTP sent to your phone (Demo OTP: 123456)' : 'Please enter the OTP sent to your phone');
      return;
    }

    setIsLoading(true);
    try {
      const cleanMobile = mobile.replace(/\D/g, '');
      const success = await verifyOtpAndLogin(cleanMobile, cleanOtp);
      if (success) {
        setSuccessMsg('Account created successfully! Welcome to Tripura Spiritual.');
        triggerLoginSuccessTransition();
      } else {
        setError(import.meta.env.DEV ? 'Invalid OTP. Use Demo OTP: 123456' : 'Invalid OTP. Please check the code sent to your phone.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || (import.meta.env.DEV ? 'OTP verification failed. Use Demo OTP: 123456' : 'OTP verification failed.'));
      setIsLoading(false);
    }
  };

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!validate()) return;

    setIsLoading(true);

    try {
      const success = await signUpWithEmailPassword(name, email, password, phone);
      if (success) {
        setSuccessMsg('Account created successfully! Welcome to Tripura Spiritual.');
        triggerLoginSuccessTransition();
      } else {
        setError('Unable to create account. Please verify your details and try again.');
        setIsLoading(false);
      }
    } catch (err: any) {
      setError(err.message || 'We could not complete your signup. Please try again.');
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
    <div className="relative min-h-screen w-full flex flex-col justify-between font-sans selection:bg-amber-200 selection:text-amber-900 bg-gradient-to-br from-[#1C1613] via-[#2A1E2B] to-[#120D16] overflow-x-hidden">
      
      {/* Full-Screen Background Image with motion-safe animation */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 motion-safe:animate-kenburns opacity-85"
        style={{ backgroundImage: `url('/auth_bg_lotus.jpg')` }}
      />
      {/* Dark Ambient Overlay with High Contrast */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/70 backdrop-blur-xs" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full px-6 sm:px-12 py-3 sm:py-4 flex items-center justify-between shrink-0">
        <button 
          type="button"
          onClick={() => setActiveTab('home')}
          className="cursor-pointer group flex items-center gap-2 focus-visible:outline-none min-h-[44px]"
        >
          <span className="font-serif text-2xl sm:text-3xl font-bold tracking-[0.25em] text-white drop-shadow-md group-hover:text-[#D1A559] transition">
            T R I P U R A
          </span>
          <span className="w-2.5 h-2.5 rounded-full bg-[#D1A559] inline-block shadow-sm"></span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('home')}
          className="btn-spiritual text-xs font-medium text-stone-200 hover:text-white transition-colors flex items-center gap-2 bg-black/30 hover:bg-black/50 px-4 py-2 rounded-full backdrop-blur-md border border-white/20 min-h-[44px] cursor-pointer"
        >
          <span>←</span> Back to Home
        </button>
      </header>

      {/* Main Content Grid - Vertical centering with viewport fit */}
      <main className="relative z-10 flex-1 grid grid-cols-1 lg:grid-cols-12 items-center px-4 sm:px-8 lg:px-16 py-2 sm:py-4 max-w-7xl mx-auto w-full gap-6 my-auto">
        
        {/* Left Side Hero Tagline */}
        <div className="lg:col-span-6 space-y-4 max-w-lg hidden sm:block">
          <ScrollReveal animation="hero-zoom">
            <div className="space-y-3">
              <h1 className="heading-hero text-white leading-[1.12] drop-shadow-lg text-3xl sm:text-4xl lg:text-5xl">
                Begin your<br />
                journey within.
              </h1>
              <div className="w-14 h-1 bg-[#D1A559] rounded-full my-2" />
              <p className="text-stone-200 text-sm sm:text-base font-light tracking-wide leading-relaxed drop-shadow">
                Learn. Practice. Grow.<br />
                At your own pace.
              </p>
            </div>

            {/* Bottom Left Quote */}
            <div className="pt-4">
              <div className="pl-4 border-l-2 border-[#D1A559] space-y-0.5">
                <p className="font-serif italic text-white/95 text-xs sm:text-sm tracking-wide drop-shadow-sm">
                  &ldquo;Small steps create profound change.&rdquo;
                </p>
                <p className="text-[11px] text-stone-300 font-light">— Master Gorli Peddi Raju Garu</p>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Right Side Form Card - Fits snugly in standard 730px height without clipping */}
        <div className="lg:col-span-6 flex justify-center lg:justify-end">
          <ScrollReveal animation="fade-up" delay={100} className="w-full max-w-md">
            <div className="card-spiritual glass-panel p-5 sm:p-6 shadow-2xl border border-white/30 text-[#2C2421] w-full max-h-[calc(100vh-5.5rem)] overflow-y-auto">
              
              {/* Card Header */}
              <div className="space-y-0.5 mb-3">
                <h2 className="heading-card text-xl sm:text-2xl text-[#2C2421] font-bold">
                  Create an account
                </h2>
                <p className="text-[11px] text-stone-600 font-normal">
                  Join our community using Mobile OTP or Email.
                </p>
              </div>

              {/* Auth Method Segmented Tabs */}
              <div className="tab-group flex w-full mb-3 p-1">
                <button
                  type="button"
                  onClick={() => { setAuthMethod('otp'); setError(''); setSuccessMsg(''); }}
                  className={`tab-btn flex-1 py-1.5 px-3 min-h-[38px] text-xs ${
                    authMethod === 'otp'
                      ? 'tab-btn-active'
                      : ''
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5 text-[#8B5E34]" />
                  <span>Mobile OTP</span>
                  <span className="badge-spiritual py-0.5 px-1.5 text-[8px] font-bold">Easy</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMethod('email'); setError(''); setSuccessMsg(''); }}
                  className={`tab-btn flex-1 py-1.5 px-3 min-h-[38px] text-xs ${
                    authMethod === 'email'
                      ? 'tab-btn-active'
                      : ''
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-[#8B5E34]" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* Notifications */}
              {error && (
                <div className="mb-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-3 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-fadeIn font-medium">
                  <Check className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* MOBILE OTP FLOW */}
              {authMethod === 'otp' ? (
                otpStep === 'mobile' ? (
                  <form onSubmit={handleSendOtp} className="space-y-3">
                    <div className="form-group mb-0">
                      <label className="form-label text-[10px]">
                        Mobile Number / మొబైల్ నంబర్
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-stone-700 font-bold text-xs">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          required
                          placeholder="9876543210"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          className="form-input pl-12 text-sm font-semibold min-h-[40px] py-2"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-spiritual btn-primary w-full py-2.5 px-4 font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group min-h-[40px]"
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                      ) : (
                        <>
                          <span>Get Verification OTP</span>
                          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                        </>
                      )}
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleVerifyOtp} className="space-y-3">
                    <div className="p-2.5 bg-[#FAF8F5] rounded-xl border border-[#E6E0D2] text-center space-y-0.5">
                      <span className="text-xs text-stone-600 block">OTP Sent to <strong>+91 {mobile}</strong></span>
                      {import.meta.env.DEV && (
                        <span className="badge-plum font-mono text-[9px]">
                          Demo OTP: 123456
                        </span>
                      )}
                    </div>

                    <div className="form-group mb-0">
                      <label className="form-label text-[10px]">
                        Enter 6-Digit OTP / ఓటీపీ నమోదు చేయండి
                      </label>
                      <div className="relative flex items-center">
                        <KeyRound className="absolute left-3.5 w-4 h-4 text-stone-400" />
                        <input
                          type="text"
                          maxLength={6}
                          required
                          placeholder={import.meta.env.DEV ? "123456" : "••••••"}
                          value={otp}
                          onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                          className="form-input pl-10 font-mono tracking-widest text-center text-base font-bold min-h-[40px] py-2"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn-spiritual btn-primary w-full py-2.5 px-4 font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 disabled:opacity-70 group min-h-[40px]"
                    >
                      {isLoading ? (
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Verify & Create Account</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => { setOtpStep('mobile'); setError(''); }}
                      className="btn-spiritual w-full text-[11px] text-stone-600 hover:text-[#8B5E34] underline text-center block pt-0.5 cursor-pointer min-h-[32px]"
                    >
                      Change Mobile Number
                    </button>
                  </form>
                )
              ) : (
                /* EMAIL & PASSWORD SIGN UP */
                <form onSubmit={handleEmailSubmit} className="space-y-2.5">
                  
                  {/* Full Name Field */}
                  <div className="form-group mb-0">
                    <label className="form-label text-[10px]">
                      Full Name
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <UserIcon className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="form-input pl-10 text-xs sm:text-sm min-h-[38px] py-1.5"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div className="form-group mb-0">
                    <label className="form-label text-[10px]">
                      Email
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="m@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input pl-10 text-xs sm:text-sm min-h-[38px] py-1.5"
                      />
                    </div>
                  </div>

                  {/* Mobile Number Field */}
                  <div className="form-group mb-0">
                    <label className="form-label text-[10px]">
                      Mobile Number (Optional)
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        placeholder="9876543210"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="form-input pl-10 text-xs sm:text-sm min-h-[38px] py-1.5"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="form-group mb-0">
                    <label className="form-label text-[10px]">
                      Password
                    </label>
                    <div className="relative flex items-center">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                        <Lock className="w-4 h-4" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-input pl-10 pr-10 text-xs sm:text-sm min-h-[38px] py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition cursor-pointer"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {password.length > 0 && (
                      <div className="mt-1 space-y-1 px-1">
                        <div className="flex gap-1 h-1">
                          <div className={`flex-1 rounded-full transition-colors ${score >= 1 ? 'bg-amber-500' : 'bg-stone-200'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${score >= 2 ? 'bg-[#D1A559]' : 'bg-stone-200'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${score >= 3 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
                        </div>
                        <p className="text-[10px] text-stone-500 flex items-center justify-between">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#8B5E34]" />
                            Security Check
                          </span>
                          <span className="font-semibold text-stone-700">
                            {score === 1 && 'Weak'}
                            {score === 2 && 'Moderate'}
                            {score === 3 && 'Strong Password'}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="btn-spiritual btn-primary w-full py-2.5 px-4 font-bold text-xs tracking-wider uppercase shadow-md flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed group min-h-[40px] mt-1"
                  >
                    {isLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full motion-safe:animate-spin" />
                    ) : (
                      <>
                        <span>Sign Up</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Social Auth Separator */}
              <div className="relative my-3">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#E6E0D2]" />
                </div>
                <div className="relative flex justify-center text-[9px] uppercase">
                  <span className="bg-[#FAF8F5] px-2.5 text-stone-500 font-semibold tracking-wider">
                    Or continue with
                  </span>
                </div>
              </div>

              {/* Google OAuth Button */}
              <button
                type="button"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
                className="btn-spiritual w-full py-2 px-3.5 rounded-full border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2.5 transition shadow-xs cursor-pointer min-h-[38px]"
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
              <div className="mt-3 text-center text-[11px] text-stone-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="text-[#8B5E34] hover:underline font-bold ml-1 cursor-pointer min-h-[32px] inline-flex items-center"
                >
                  Sign in
                </button>
              </div>

            </div>
          </ScrollReveal>
        </div>

      </main>

      {/* Footer spacer */}
      <footer className="relative z-10 w-full py-2 text-center text-[11px] text-white/60 shrink-0">
        &copy; {new Date().getFullYear()} Tripura Spiritual. All rights reserved.
      </footer>
    </div>
  );
};
