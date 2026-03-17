'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiArrowRight } from 'react-icons/hi';

const LoginClient = () => {
  const { theme } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className={`max-w-md mx-auto py-20 px-4 ${theme.utilities.textPrimary}`}>
      <div className="text-center space-y-4 mb-12">
        <h1 className={`text-3xl font-bold uppercase tracking-[0.2em] ${theme.utilities.textPrimary}`}>Welcome Back</h1>
        <p className={`text-xs ${theme.utilities.textMuted} uppercase tracking-widest`}>Sign in to continue to Mashriqi Libas</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Email Address</label>
          <div className="relative">
            <HiOutlineMail className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${theme.components.input} border px-12 py-4 text-sm outline-none ${theme.utilities.textPrimary}`}
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <label className={`text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Password</label>
            <Link href="/forgot-password" title="Forgot Password" className={`text-[10px] uppercase tracking-widest font-bold ${theme.components.link}`}>Forgot?</Link>
          </div>
          <div className="relative">
            <HiOutlineLockClosed className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full ${theme.components.input} border px-12 py-4 text-sm outline-none ${theme.utilities.textPrimary}`}
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full ${theme.components.buttonPrimary} h-14 flex items-center justify-center space-x-3 disabled:opacity-50`}
        >
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          {!loading && <HiArrowRight className="text-lg" />}
        </button>
      </form>

      <div className={`mt-12 pt-8 border-t ${theme.utilities.border} text-center space-y-4`}>
        <p className={`text-xs ${theme.utilities.textMuted} uppercase tracking-widest font-medium`}>Don&apos;t have an account?</p>
        <Link href={`/signup${redirect ? `?redirect=${redirect}` : ''}`} className={`text-sm font-bold uppercase tracking-widest border-b-2 ${theme.utilities.border} pb-1 ${theme.components.link}`}>
          Create Account
        </Link>
      </div>
    </div>
  );
};

export default LoginClient;
