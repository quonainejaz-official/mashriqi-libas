'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';

const ProfileClient = () => {
  const { user, loading, updateProfile } = useAuth();
  const [overrides, setOverrides] = useState({
    name: null,
    phone: null,
    address: {
      street: null,
      city: null,
      province: null,
      postalCode: null,
      country: null
    }
  });
  const [saving, setSaving] = useState(false);

  const formData = {
    name: overrides.name ?? user?.name ?? '',
    phone: overrides.phone ?? user?.phone ?? '',
    address: {
      street: overrides.address.street ?? user?.address?.street ?? '',
      city: overrides.address.city ?? user?.address?.city ?? '',
      province: overrides.address.province ?? user?.address?.province ?? '',
      postalCode: overrides.address.postalCode ?? user?.address?.postalCode ?? '',
      country: overrides.address.country ?? user?.address?.country ?? 'Pakistan'
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.replace('address.', '');
      setOverrides((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value }
      }));
      return;
    }
    setOverrides((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await updateProfile(formData);
    setSaving(false);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A08C5B]"></div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="flex flex-col md:flex-row gap-12">
        <div className="md:w-1/3 space-y-8">
          <div className="bg-[#1a1a1a] text-white p-8 text-center space-y-4">
            <div className="w-20 h-20 bg-[#A08C5B] rounded-full mx-auto flex items-center justify-center text-3xl font-bold">
              {user?.name?.[0]}
            </div>
            <div>
              <h2 className="text-lg font-bold uppercase tracking-widest">{user?.name}</h2>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest">{user?.role} Account</p>
            </div>
          </div>
          <nav className="border border-gray-100 divide-y flex flex-col">
            <button className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest bg-gray-50 text-[#A08C5B]">Profile Info</button>
            <button className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">Order History</button>
            <button className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50">Saved Addresses</button>
            <button className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 text-red-600">Delete Account</button>
          </nav>
        </div>

        <div className="md:w-2/3 space-y-10">
          <div className="space-y-2">
            <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-[#2C3E50]">Profile Information</h1>
            <p className="text-[10px] uppercase tracking-widest text-gray-400">Update your details below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Phone Number</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full bg-gray-100 border-none pl-12 pr-4 py-3 text-sm outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Street Address</label>
                <input
                  type="text"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Province</label>
                <input
                  type="text"
                  name="address.province"
                  value={formData.address.province}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Postal Code</label>
                <input
                  type="text"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-500">Country</label>
                <input
                  type="text"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border-none px-4 py-3 text-sm focus:ring-1 focus:ring-[#A08C5B] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center space-x-2 disabled:opacity-60"
            >
              <HiOutlineShieldCheck className="text-lg" />
              <span>{saving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
