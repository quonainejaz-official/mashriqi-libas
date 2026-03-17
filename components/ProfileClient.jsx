'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import Image from 'next/image';
import { useTheme } from '@/context/ThemeContext';
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
  const { theme } = useTheme();
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
    <div className={`h-screen flex items-center justify-center ${theme.utilities.bgPage}`}>
      <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme.utilities.borderStrong}`}></div>
    </div>
  );

  return (
    <div className={`max-w-[1400px] mx-auto px-4 py-10 md:py-12 ${theme.utilities.bgPage} min-h-screen`}>
      <div className="flex flex-col gap-10">
        {/* Header Section */}
        <div className={`flex flex-col items-center text-center gap-4 max-w-2xl mx-auto border-b ${theme.utilities.border} pb-10 w-full`}>
          <div className="space-y-2">
            <div className="flex flex-col items-center gap-2">
              <span className={`text-[9px] uppercase tracking-[0.6em] font-black ${theme.utilities.textPrimary}`}>Member Profile</span>
              <div className={`h-[2px] w-6 ${theme.utilities.bgContrast} opacity-40 rounded-full`} />
            </div>
            <h1 className={`text-3xl md:text-4xl font-black uppercase tracking-[0.15em] ${theme.utilities.textPrimary}`}>My Account</h1>
            <p className={`text-[13px] ${theme.utilities.textMuted} font-light leading-relaxed max-w-sm`}>
              Welcome back, <span className={`font-semibold ${theme.utilities.textPrimary}`}>{user?.name}</span>. <br className="hidden md:block" /> 
              Manage your personal information and track your orders.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[320px_1fr] gap-10">
          {/* Sidebar Navigation */}
          <aside className="space-y-6">
            <div className={`group relative rounded-[2rem] overflow-hidden ${theme.utilities.bgContrast} p-8 shadow-2xl transition-all duration-700`}>
              <div className={`absolute top-0 right-0 w-32 h-32 ${theme.utilities.bgSurface} opacity-10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:opacity-20 transition-colors duration-700`} />
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative group/avatar">
                  <div className={`relative w-24 h-24 rounded-full theme-bg-contrast-muted flex items-center justify-center text-4xl font-black ${theme.utilities.textInverse} shadow-2xl ring-4 ring-white/10 group-hover:scale-105 transition-transform duration-500 overflow-hidden`}>
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
                    className={`absolute -bottom-1 -right-1 w-8 h-8 theme-bg-contrast-muted border-4 ${theme.utilities.bgContrast} rounded-full shadow-lg flex items-center justify-center ${theme.utilities.textInverse} hover:scale-110 transition-transform cursor-pointer`}
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
                  <h2 className={`text-xl font-bold uppercase tracking-widest ${theme.utilities.textInverse}`}>{user?.name}</h2>
                  <p className={`text-[10px] ${theme.utilities.textInverse} opacity-70 uppercase tracking-[0.3em] font-black`}>{user?.role} Account</p>
                  <p className={`text-xs ${theme.utilities.textInverse} opacity-50 font-light`}>{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className={`rounded-[2rem] ${theme.utilities.bgSurface} border ${theme.utilities.border} p-4 shadow-xl shadow-black/[0.02] space-y-2`}>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeTab === 'profile' ? `${theme.utilities.bgContrast} ${theme.utilities.textInverse} shadow-lg shadow-black/20 translate-x-2` : `${theme.utilities.textMuted} theme-hover-bg-muted theme-hover-text-primary`}`}
              >
                <HiOutlineUser className={`text-xl ${activeTab === 'profile' ? theme.utilities.textInverse : ''}`} />
                Profile Information
              </button>
              <button 
                onClick={() => setActiveTab('orders')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeTab === 'orders' ? `${theme.utilities.bgContrast} ${theme.utilities.textInverse} shadow-lg shadow-black/20 translate-x-2` : `${theme.utilities.textMuted} theme-hover-bg-muted theme-hover-text-primary`}`}
              >
                <HiOutlineShoppingBag className={`text-xl ${activeTab === 'orders' ? theme.utilities.textInverse : ''}`} />
                Order History
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold transition-all duration-500 ${activeTab === 'addresses' ? `${theme.utilities.bgContrast} ${theme.utilities.textInverse} shadow-lg shadow-black/20 translate-x-2` : `${theme.utilities.textMuted} theme-hover-bg-muted theme-hover-text-primary`}`}
              >
                <HiOutlineLocationMarker className={`text-xl ${activeTab === 'addresses' ? theme.utilities.textInverse : ''}`} />
                Saved Addresses
              </button>
              
              <div className={`pt-6 mt-6 border-t ${theme.utilities.border} opacity-20 space-y-2`}>
                <button
                  type="button"
                  onClick={logout}
                  className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold ${theme.utilities.textDanger} theme-hover-bg-muted transition-all duration-500 group`}
                >
                  <HiOutlineLogout className="text-xl group-hover:scale-110 transition-transform" />
                  Sign Out
                </button>
                <button className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] uppercase tracking-[0.2em] font-bold ${theme.utilities.textMuted} theme-hover-text-danger theme-hover-bg-muted transition-all duration-500 group`}>
                  <HiOutlineTrash className="text-xl group-hover:rotate-12 transition-transform" />
                  Close Account
                </button>
              </div>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className={`rounded-[2.5rem] ${theme.utilities.bgSurface} border ${theme.utilities.border} p-8 md:p-12 shadow-2xl shadow-black/[0.03] relative overflow-hidden flex flex-col h-full`}>
            <div className={`absolute top-0 right-0 w-80 h-80 ${theme.utilities.bgContrast} opacity-5 rounded-full blur-3xl -mr-40 -mt-40`} />
            
            <div className="relative z-10 flex flex-col h-full space-y-10">
              <div className={`flex items-center justify-between gap-6 border-b ${theme.utilities.border} pb-10`}>
                <div className="flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-3xl ${theme.utilities.bgSurface} shadow-[0_8px_30px_rgb(0,0,0,0.04)] border ${theme.utilities.border} flex items-center justify-center ${theme.utilities.textPrimary} transition-transform duration-500 hover:scale-110`}>
                    <HiOutlineUser className="text-3xl" />
                  </div>
                  <div>
                    <h2 className={`text-2xl font-black ${theme.utilities.textPrimary} tracking-[0.05em] uppercase`}>Personal Information</h2>
                    <p className={`text-[13px] ${theme.utilities.textMuted} font-light`}>Update your profile and contact details to keep them current.</p>
                  </div>
                </div>

                <button
                  type="submit"
                  form="profile-form"
                  disabled={saving}
                  className={`group px-10 py-4 ${theme.components.buttonPrimary} rounded-2xl text-[10px] uppercase tracking-[0.3em] font-black transition-all duration-500 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex items-center gap-4 active:scale-95 disabled:opacity-50`}
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
                    <label className={`text-[10px] uppercase tracking-[0.25em] font-black ${theme.utilities.textMuted} transition-colors pl-1`}>Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className={`w-full ${theme.components.input} border rounded-2xl px-6 py-4.5 text-sm font-semibold ${theme.utilities.textPrimary} shadow-[0_4px_20px_rgba(0,0,0,0.02)] outline-none`}
                      />
                    </div>
                  </div>
                  <div className="group space-y-2">
                    <label className={`text-[10px] uppercase tracking-[0.25em] font-black ${theme.utilities.textMuted} transition-colors pl-1`}>Phone Number</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+92 300 0000000"
                      className={`w-full ${theme.components.input} border rounded-2xl px-6 py-4.5 text-sm font-semibold ${theme.utilities.textPrimary} shadow-[0_4px_20px_rgba(0,0,0,0.02)] outline-none`}
                    />
                  </div>
                  <div className="group space-y-2">
                    <label className={`text-[10px] uppercase tracking-[0.25em] font-black ${theme.utilities.textMuted} pl-1`}>Email Address</label>
                    <div className="relative group/input">
                      <div className={`absolute left-6 top-1/2 -translate-y-1/2 ${theme.utilities.textMuted}`}>
                        <HiOutlineMail className="text-xl" />
                      </div>
                      <input
                        type="email"
                        value={user?.email || ''}
                        readOnly
                      className={`w-full ${theme.utilities.bgMuted} opacity-50 border ${theme.utilities.border} rounded-2xl pl-14 pr-6 py-4.5 text-sm font-semibold ${theme.utilities.textMuted} outline-none cursor-not-allowed transition-all`}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-10 pt-8">
                  <div className="flex items-center gap-6">
                    <h3 className={`text-[11px] uppercase tracking-[0.5em] font-black ${theme.utilities.textPrimary} ${theme.utilities.bgMuted} px-4 py-2 rounded-lg`}>Shipping & Delivery</h3>
                    <div className={`h-[1px] flex-1 bg-gradient-to-r from-${theme.key === 'dark' ? 'gray-800' : 'gray-100'} to-transparent`} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div className="group space-y-2 md:col-span-2">
                    <label className={`text-[10px] uppercase tracking-[0.25em] font-black ${theme.utilities.textMuted} transition-colors pl-1`}>Street Address</label>
                      <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                      className={`w-full ${theme.components.input} border rounded-2xl px-6 py-4.5 text-sm font-semibold ${theme.utilities.textPrimary} shadow-[0_4px_20px_rgba(0,0,0,0.02)] outline-none`}
                      />
                    </div>
                    <div className="group space-y-2">
                    <label className={`text-[10px] uppercase tracking-[0.25em] font-black ${theme.utilities.textMuted} transition-colors pl-1`}>City</label>
                      <input
                        type="text"
                        name="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                      className={`w-full ${theme.components.input} border rounded-2xl px-6 py-4.5 text-sm font-semibold ${theme.utilities.textPrimary} shadow-[0_4px_20px_rgba(0,0,0,0.02)] outline-none`}
                      />
                    </div>
                    <div className="group space-y-2">
                    <label className={`text-[10px] uppercase tracking-[0.25em] font-black ${theme.utilities.textMuted} transition-colors pl-1`}>Province</label>
                      <input
                        type="text"
                        name="address.province"
                        value={formData.address.province}
                        onChange={handleChange}
                      className={`w-full ${theme.components.input} border rounded-2xl px-6 py-4.5 text-sm font-semibold ${theme.utilities.textPrimary} shadow-[0_4px_20px_rgba(0,0,0,0.02)] outline-none`}
                      />
                    </div>
                    <div className="group space-y-2">
                    <label className={`text-[10px] uppercase tracking-[0.25em] font-black ${theme.utilities.textMuted} transition-colors pl-1`}>Postal Code</label>
                      <input
                        type="text"
                        name="address.postalCode"
                        value={formData.address.postalCode}
                        onChange={handleChange}
                      className={`w-full ${theme.components.input} border rounded-2xl px-6 py-4.5 text-sm font-semibold ${theme.utilities.textPrimary} shadow-[0_4px_20px_rgba(0,0,0,0.02)] outline-none`}
                      />
                    </div>
                    <div className="group space-y-2 md:col-span-2">
                      <label className={`text-[10px] uppercase tracking-[0.25em] font-black ${theme.utilities.textMuted} pl-1`}>Country</label>
                      <input
                        type="text"
                        name="address.country"
                        value={formData.address.country}
                        onChange={handleChange}
                        className={`w-full ${theme.utilities.bgMuted} opacity-50 border ${theme.utilities.border} rounded-2xl px-6 py-4.5 text-sm font-semibold ${theme.utilities.textMuted} outline-none transition-all duration-500`}
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
