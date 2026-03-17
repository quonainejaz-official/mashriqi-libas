'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone, HiArrowRight, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

const SignupClient = () => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await signup(formData);
    setLoading(false);
  };

  return (
    <div className={`max-w-md mx-auto py-3 sm:py-16 px-4 ${theme.utilities.textPrimary}`}>
      <div className="text-center space-y-2.5 mb-4 animate-fadeIn">
        <h1 className={`text-xl sm:text-3xl font-bold uppercase tracking-[0.2em] ${theme.utilities.textPrimary}`}>Create Account</h1>
        <p className={`text-[10px] sm:text-xs ${theme.utilities.textMuted} uppercase tracking-[0.25em] leading-relaxed`}>Join Mashriqi Libas for a personalized experience</p>
      </div>

      <div className={`rounded-2xl border ${theme.utilities.border} ${theme.utilities.bgSurface} shadow-[0_16px_50px_rgba(0,0,0,0.08)] p-5 sm:p-10 animate-fadeIn relative overflow-hidden transition-transform duration-500 hover:-translate-y-1`}>
        <div className={`absolute left-0 top-0 h-1 w-full ${theme.utilities.bgContrast} opacity-70`} />
        <form onSubmit={handleSubmit} className="space-y-3.5 sm:space-y-5">
          <div className="space-y-1.5">
            <label className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Full Name</label>
            <div className="relative">
              <HiOutlineUser className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={`w-full ${theme.components.input} border rounded-xl px-11 py-3 sm:py-4 text-sm outline-none ${theme.utilities.textPrimary}`}
                placeholder="John Doe"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Email Address</label>
            <div className="relative">
              <HiOutlineMail className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`w-full ${theme.components.input} border rounded-xl px-11 py-3 sm:py-4 text-sm outline-none ${theme.utilities.textPrimary}`}
                placeholder="name@example.com"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Phone Number</label>
            <div className="relative">
              <HiOutlinePhone className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className={`w-full ${theme.components.input} border rounded-xl px-11 py-3 sm:py-4 text-sm outline-none ${theme.utilities.textPrimary}`}
                placeholder="+92 300 1234567"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${theme.utilities.textMuted}`}>Password</label>
            <div className="relative">
              <HiOutlineLockClosed className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
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
            <span className={`${theme.utilities.textInverse}`}>{loading ? 'Creating Account...' : 'Sign Up'}</span>
            {!loading && <HiArrowRight className={`text-lg ${theme.utilities.textInverse}`} />}
          </button>
        </form>

        <div className={`mt-6 pt-5 border-t ${theme.utilities.border} text-center space-y-2.5`}>
          <p className={`text-[10px] sm:text-xs ${theme.utilities.textMuted} uppercase tracking-widest font-medium`}>Already have an account?</p>
          <Link href="/login" className={`text-[11px] sm:text-sm font-bold uppercase tracking-widest border-b-2 ${theme.utilities.border} pb-1 ${theme.components.link}`}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupClient;
