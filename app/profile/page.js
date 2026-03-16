'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineMail, HiOutlineShieldCheck } from 'react-icons/hi';

const ProfilePage = () => {
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
        {/* Sidebar */}
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

        {/* Content */}
        <div className="md:w-2/3 space-y-12 animate-fadeIn">
          <div className="space-y-6">
            <h1 className="text-2xl font-bold uppercase tracking-[0.2em] text-[#2C3E50]">Account Security</h1>
            <div className="grid grid-cols-1 gap-4">
              <div className="p-6 border border-gray-50 flex items-center space-x-6 bg-white shadow-sm">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-xl">
                  <HiOutlineMail />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-[#2C3E50]">{user?.email}</p>
                </div>
              </div>
              <div className="p-6 border border-gray-50 flex items-center space-x-6 bg-white shadow-sm">
                <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-xl">
                  <HiOutlineShieldCheck />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Account Status</p>
                  <p className="text-sm font-bold text-[#2C3E50]">Verified & Secure</p>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <h2 className="text-xl font-bold uppercase tracking-widest text-[#2C3E50]">Profile Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Full Name</label>
                <input type="text" name="name" className="w-full bg-gray-50 border-none p-4 text-sm outline-none" value={formData.name} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Phone</label>
                <input type="text" name="phone" className="w-full bg-gray-50 border-none p-4 text-sm outline-none" value={formData.phone} onChange={handleChange} />
              </div>
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Street Address</label>
                <input type="text" name="address.street" className="w-full bg-gray-50 border-none p-4 text-sm outline-none" value={formData.address.street} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">City</label>
                <input type="text" name="address.city" className="w-full bg-gray-50 border-none p-4 text-sm outline-none" value={formData.address.city} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Province</label>
                <input type="text" name="address.province" className="w-full bg-gray-50 border-none p-4 text-sm outline-none" value={formData.address.province} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Postal Code</label>
                <input type="text" name="address.postalCode" className="w-full bg-gray-50 border-none p-4 text-sm outline-none" value={formData.address.postalCode} onChange={handleChange} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Country</label>
                <input type="text" name="address.country" className="w-full bg-gray-50 border-none p-4 text-sm outline-none" value={formData.address.country} onChange={handleChange} />
              </div>
            </div>
            <button type="submit" disabled={saving} className="btn-primary h-12 px-8 disabled:opacity-60">
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
