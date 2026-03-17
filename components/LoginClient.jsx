'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiArrowRight, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const LoginClient = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/profile';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await login(email, password);
    setLoading(false);
  };

  return (
    <div className={`max-w-md mx-auto py-3 sm:py-16 px-4 ${theme.utilities.textPrimary}`}>
      <div className="text-center space-y-2.5 mb-4 animate-fadeIn">
        <h1 className={`text-xl sm:text-3xl font-bold uppercase tracking-[0.2em] ${theme.utilities.textPrimary}`}>Welcome Back</h1>
        <p className={`text-[10px] sm:text-xs ${theme.utilities.textMuted} uppercase tracking-[0.25em] leading-relaxed`}>Sign in to continue to Mashriqi Libas</p>
      </div>

      <div className={`rounded-2xl border ${theme.utilities.border} ${theme.utilities.bgSurface} shadow-[0_16px_50px_rgba(0,0,0,0.08)] p-5 sm:p-10 animate-fadeIn relative overflow-hidden transition-transform duration-500 hover:-translate-y-1`}>
        <div className={`absolute left-0 top-0 h-1 w-full ${theme.utilities.bgContrast} opacity-70`} />
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
          <div className="space-y-1.5">
            <label className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Email Address</label>
            <div className="relative">
              <HiOutlineMail className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full ${theme.components.input} border rounded-xl px-11 py-3 sm:py-4 text-sm outline-none ${theme.utilities.textPrimary}`}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Password</label>
              <Link href="/forgot-password" title="Forgot Password" className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${theme.components.link}`}>Forgot?</Link>
            </div>
            <div className="relative">
              <HiOutlineLockClosed className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full ${theme.components.input} border rounded-xl pl-11 pr-12 py-3 sm:py-4 text-sm outline-none ${theme.utilities.textPrimary}`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-lg ${theme.utilities.textMuted} theme-hover-text-primary transition-colors`}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <HiOutlineEyeOff /> : <HiOutlineEye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${theme.components.buttonPrimary} rounded-xl h-11 sm:h-14 flex items-center justify-center gap-3 text-[11px] sm:text-xs tracking-[0.2em] text-center disabled:opacity-50 transition-transform duration-300 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99]`}
          >
            <span className={`${theme.utilities.textInverse}`}>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <HiArrowRight className={`text-lg ${theme.utilities.textInverse}`} />}
          </button>
        </form>

        <div className={`mt-6 pt-5 border-t ${theme.utilities.border} text-center space-y-2.5`}>
          <p className={`text-[10px] sm:text-xs ${theme.utilities.textMuted} uppercase tracking-widest font-medium`}>Don&apos;t have an account?</p>
          <Link href={`/signup${redirect ? `?redirect=${redirect}` : ''}`} className={`text-[11px] sm:text-sm font-bold uppercase tracking-widest border-b-2 ${theme.utilities.border} pb-1 ${theme.components.link}`}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginClient;
