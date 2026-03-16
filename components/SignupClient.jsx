'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone, HiArrowRight } from 'react-icons/hi';

const SignupClient = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
  });
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
    <div className="max-w-md mx-auto py-20 px-4">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-3xl font-bold uppercase tracking-[0.2em] text-[#2C3E50]">Create Account</h1>
        <p className="text-xs text-gray-400 uppercase tracking-widest">Join Mashriqi Libas for a personalized experience</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Full Name</label>
          <div className="relative">
            <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none px-12 py-4 text-sm focus:ring-1 focus:ring-[#A08C5B] transition-all outline-none"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Email Address</label>
          <div className="relative">
            <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none px-12 py-4 text-sm focus:ring-1 focus:ring-[#A08C5B] transition-all outline-none"
              placeholder="name@example.com"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Phone Number</label>
          <div className="relative">
            <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none px-12 py-4 text-sm focus:ring-1 focus:ring-[#A08C5B] transition-all outline-none"
              placeholder="+92 300 1234567"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Password</label>
          <div className="relative">
            <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-gray-50 border-none px-12 py-4 text-sm focus:ring-1 focus:ring-[#A08C5B] transition-all outline-none"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn-primary h-14 flex items-center justify-center space-x-3 disabled:opacity-50"
        >
          <span>{loading ? 'Creating Account...' : 'Sign Up'}</span>
          {!loading && <HiArrowRight className="text-lg" />}
        </button>
      </form>

      <div className="mt-12 pt-8 border-t text-center space-y-4">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">Already have an account?</p>
        <Link href="/login" className="text-sm font-bold uppercase tracking-widest border-b-2 border-black pb-1 hover:text-[#A08C5B] hover:border-[#A08C5B] transition-all">
          Sign In
        </Link>
      </div>
    </div>
  );
};

export default SignupClient;
