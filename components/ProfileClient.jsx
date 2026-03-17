'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { 
  HiOutlineMail, 
  HiOutlineShieldCheck, 
  HiOutlineLogout, 
  HiOutlineUser, 
  HiOutlineShoppingBag, 
  HiOutlineLocationMarker,
  HiOutlineTrash,
  HiOutlineCamera
} from 'react-icons/hi';

const ProfileClient = () => {
  const { user, loading, updateProfile, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const fileInputRef = useRef(null);
  const [selectedImage, setSelectedImage] = useState(null);
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

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setSaving(true);

      const formDataObj = new FormData();
      formDataObj.append('name', formData.name);
      formDataObj.append('phone', formData.phone);
      formDataObj.append('address', JSON.stringify(formData.address));
      formDataObj.append('image', file);

      await updateProfile(formDataObj);
      setSaving(false);
      setSelectedImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const formDataObj = new FormData();
    formDataObj.append('name', formData.name);
    formDataObj.append('phone', formData.phone);
    formDataObj.append('address', JSON.stringify(formData.address));
    if (selectedImage) {
      formDataObj.append('image', selectedImage);
    }

    await updateProfile(formDataObj);
    setSaving(false);
    setSelectedImage(null);
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A08C5B]"></div>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 py-10 md:py-12 bg-[#fafafa]/50 min-h-screen">
      <div className="flex flex-col gap-10">
        {/* Header Section */}
        <div className="flex flex-col items-center text-center gap-4 max-w-2xl mx-auto border-b border-gray-100 pb-10 w-full">
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[9px] uppercase tracking-[0.6em] font-black text-[#A08C5B]">Member Profile</span>
              <div className="h-[2px] w-6 bg-[#A08C5B]/40 rounded-full" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-[0.15em] text-[#1a1a1a]">My Account</h1>
            <p className="text-[13px] text-gray-500 font-light leading-relaxed max-w-sm">
              Welcome back, <span className="font-semibold text-[#1a1a1a]">{user?.name}</span>. <br className="hidden md:block" /> 
              Manage your personal information and track your orders.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-10">
          {/* Sidebar Navigation */}
          <aside className="space-y-6">
            <div className="group relative rounded-[2rem] overflow-hidden bg-[#1a1a1a] p-8 shadow-2xl transition-all duration-700 hover:shadow-[#A08C5B]/10">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#A08C5B]/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-[#A08C5B]/20 transition-colors duration-700" />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative group/avatar">
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-tr from-[#A08C5B] to-[#c5b38a] flex items-center justify-center text-4xl font-black text-white shadow-2xl ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                    {selectedImage ? (
                      <Image 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="Preview" 
                        fill 
                        className="object-cover rounded-full"
                      />
                    ) : user?.image?.url ? (
                      <Image 
                        src={user.image.url} 
                        alt={user.name} 
                        fill 
                        className="object-cover rounded-full"
                      />
                    ) : (
                      user?.name?.[0]
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-1 -right-1 w-8 h-8 bg-[#A08C5B] border-4 border-[#1a1a1a] rounded-full shadow-lg flex items-center justify-center text-white hover:scale-110 transition-transform cursor-pointer"
                  >
                    <HiOutlineCamera className="text-sm" />
                  </button>
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <div className="mt-6 space-y-1">
                  <h2 className="text-xl font-bold uppercase tracking-widest text-white">{user?.name}</h2>
                  <p className="text-[10px] text-[#A08C5B] uppercase tracking-[0.3em] font-black">{user?.role} Account</p>
                  <p className="text-xs text-gray-400 font-light">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="rounded-[2rem] bg-white border border-gray-100 p-4 shadow-xl shadow-black/[0.02] space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeTab === 'profile' ? 'bg-[#1a1a1a] text-white shadow-lg shadow-black/20 translate-x-2' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]'}`}
              >
                <HiOutlineUser className={`text-xl ${activeTab === 'profile' ? 'text-[#A08C5B]' : ''}`} />
                Profile Information
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeTab === 'orders' ? 'bg-[#1a1a1a] text-white shadow-lg shadow-black/20 translate-x-2' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]'}`}
              >
                <HiOutlineShoppingBag className={`text-xl ${activeTab === 'orders' ? 'text-[#A08C5B]' : ''}`} />
                Order History
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeTab === 'addresses' ? 'bg-[#1a1a1a] text-white shadow-lg shadow-black/20 translate-x-2' : 'text-gray-500 hover:bg-gray-50 hover:text-[#1a1a1a]'}`}
              >
                <HiOutlineLocationMarker className={`text-xl ${activeTab === 'addresses' ? 'text-[#A08C5B]' : ''}`} />
                Saved Addresses
              </button>
              
              <div className="pt-6 mt-6 border-t border-gray-50 space-y-2">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold text-red-500 hover:bg-red-50 transition-all duration-500 group"
                >
                  <HiOutlineLogout className="text-xl group-hover:scale-110 transition-transform" />
                  Sign Out
                </button>
                <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all duration-500 group">
                  <HiOutlineTrash className="text-xl group-hover:rotate-12 transition-transform" />
                  Close Account
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="rounded-[2.5rem] bg-white border border-gray-100 p-8 md:p-12 shadow-2xl shadow-black/[0.03] relative overflow-hidden flex flex-col h-full">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#A08C5B]/5 rounded-full blur-3xl -mr-40 -mt-40" />
            
            <div className="relative z-10 flex flex-col h-full space-y-10">
              <div className="flex items-center justify-between gap-6 border-b border-gray-100 pb-10">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-center justify-center text-[#A08C5B] transition-transform duration-500 hover:scale-110">
                    <HiOutlineUser className="text-3xl" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#1a1a1a] tracking-[0.05em] uppercase">Personal Information</h2>
                    <p className="text-[13px] text-gray-400 font-light">Update your profile and contact details to keep them current.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className="group px-10 py-4 bg-[#1a1a1a] text-white rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black hover:bg-[#A08C5B] transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-4 active:scale-95 disabled:opacity-50"
                >
                  {saving ? (
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <HiOutlineShieldCheck className="text-xl group-hover:rotate-12 transition-transform duration-500" />
                  )}
                  <span>{saving ? 'Processing...' : 'Save Changes'}</span>
                </button>
              </div>

              <form id="profile-form" onSubmit={handleSubmit} className="flex-1 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <div className="group space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 group-focus-within:text-[#A08C5B] transition-colors pl-1">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold text-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:border-[#A08C5B]/30 focus:ring-4 focus:ring-[#A08C5B]/5 outline-none transition-all duration-500 placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                  <div className="group space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 group-focus-within:text-[#A08C5B] transition-colors pl-1">Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold text-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:border-[#A08C5B]/30 focus:ring-4 focus:ring-[#A08C5B]/5 outline-none transition-all duration-500 placeholder:text-gray-300"
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 pl-1">Email Address</label>
                    <div className="relative group/input">
                      <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300">
                        <HiOutlineMail className="text-xl" />
                      </div>
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl pl-14 pr-6 py-4.5 text-sm font-semibold text-gray-400 outline-none cursor-not-allowed transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-10 pt-8">
                  <div className="flex items-center gap-6">
                    <h3 className="text-[11px] uppercase tracking-[0.5em] font-black text-[#A08C5B] bg-[#A08C5B]/5 px-4 py-2 rounded-lg">Shipping & Delivery</h3>
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-gray-100 to-transparent" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="group space-y-2 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 group-focus-within:text-[#A08C5B] transition-colors pl-1">Street Address</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold text-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:border-[#A08C5B]/30 focus:ring-4 focus:ring-[#A08C5B]/5 outline-none transition-all duration-500"
                      />
                    </div>
                    <div className="group space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 group-focus-within:text-[#A08C5B] transition-colors pl-1">City</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold text-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:border-[#A08C5B]/30 focus:ring-4 focus:ring-[#A08C5B]/5 outline-none transition-all duration-500"
                      />
                    </div>
                    <div className="group space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 group-focus-within:text-[#A08C5B] transition-colors pl-1">Province</label>
                      <input
                        type="text"
                        name="address.province"
                        value={formData.address.province}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold text-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:border-[#A08C5B]/30 focus:ring-4 focus:ring-[#A08C5B]/5 outline-none transition-all duration-500"
                      />
                    </div>
                    <div className="group space-y-2">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 group-focus-within:text-[#A08C5B] transition-colors pl-1">Postal Code</label>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                        className="w-full bg-white border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold text-[#1a1a1a] shadow-[0_4px_20px_rgba(0,0,0,0.02)] focus:border-[#A08C5B]/30 focus:ring-4 focus:ring-[#A08C5B]/5 outline-none transition-all duration-500"
                      />
                    </div>
                    <div className="group space-y-2 md:col-span-2">
                      <label className="text-[10px] uppercase tracking-[0.25em] font-black text-gray-400 pl-1">Country</label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl px-6 py-4.5 text-sm font-semibold text-gray-400 outline-none transition-all duration-500"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileClient;
