'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineSearch, HiMenuAlt3, HiX, HiOutlineLogout, HiSun, HiMoon, HiStar } from 'react-icons/hi';
import BrandLogo from '@/components/BrandLogo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const { theme, themeKey, cycleTheme } = useTheme();
  const { cart, setIsCartOpen } = useCart();
  const { user, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const themeIcons = {
    dark: HiSun,
    light: HiMoon,
    gold: HiStar
  };
  const ThemeIcon = themeIcons[themeKey] || HiMoon;
  const renderSubcategoryLinks = (subcategories, categorySlug, depth = 0, onClick) =>
    subcategories.map((sub) => (
      <div key={`${categorySlug}-${sub.slug}`} style={{ paddingLeft: depth * 12 }}>
        <Link
          href={`/products?category=${categorySlug}&subcategory=${sub.slug}`}
          className={`hover:${theme.utilities.textPrimary} transition-all block py-1`}
          onClick={onClick}
        >
          {sub.name}
        </Link>
        {sub.subcategories?.length > 0 && renderSubcategoryLinks(sub.subcategories, categorySlug, depth + 1, onClick)}
      </div>
    ));

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${isScrolled ? `${theme.utilities.bgSurface} shadow-lg py-2` : 'bg-transparent py-4'} border-b ${theme.utilities.border} backdrop-blur-md`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-10 flex-1">
            {categories.map((category) => (
              <div key={category._id} className="relative group">
                <Link href={`/products?category=${category.slug}`} className={`text-[11px] uppercase tracking-[0.25em] font-bold ${theme.utilities.textSecondary} hover:${theme.utilities.textPrimary} transition-all`}>
                  {category.name}
                </Link>
                {category.subcategories?.length > 0 && (
                  <div className="absolute left-0 top-full pt-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                    <div className={`${theme.utilities.bgSurface} border ${theme.utilities.border} shadow-2xl p-8 w-[560px] grid grid-cols-[1.2fr_180px] gap-8 rounded-sm`}>
                      <div className="space-y-4">
                        <div className={`text-[10px] uppercase tracking-[0.3em] font-black ${theme.utilities.textMuted} mb-4 opacity-50`}>Collections</div>
                        <div className="space-y-3">
                          {renderSubcategoryLinks(category.subcategories || [], category.slug)}
                        </div>
                        <div className={`pt-4 mt-4 border-t ${theme.utilities.border} opacity-20`}>
                          <Link href={`/products?category=${category.slug}`} className={`text-[10px] uppercase tracking-[0.3em] font-black ${theme.utilities.textPrimary} hover:opacity-60 transition-opacity`}>
                            Explore All
                          </Link>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className={`h-40 w-full ${theme.utilities.bgMuted} overflow-hidden relative rounded-sm`}>
                          {category.image?.url ? (
                            <Image src={category.image.url} alt={category.name} fill className="object-cover hover:scale-110 transition-transform duration-700" />
                          ) : (
                            <div className={`h-full w-full ${theme.utilities.bgMuted} opacity-50`} />
                          )}
                        </div>
                        <p className={`text-[9px] uppercase tracking-[0.4em] font-bold ${theme.utilities.textMuted} text-center`}>{category.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Center: Logo */}
          <div className="flex-1 flex justify-center">
            <Link href="/" className="block scale-90 md:scale-100">
              <BrandLogo className="w-[180px] md:w-[220px] h-auto" />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end space-x-6 md:space-x-10">
            <button
              onClick={cycleTheme}
              className={`text-xl ${theme.utilities.textSecondary} hover:${theme.utilities.textPrimary} transition-all transform hover:scale-110 active:scale-95`}
              aria-label={`Switch theme: ${theme?.label || 'Theme'}`}
              title={theme?.label}
            >
              <ThemeIcon strokeWidth={1.5} />
            </button>
            <button onClick={() => setIsSearchOpen(true)} className={`text-xl ${theme.utilities.textSecondary} hover:${theme.utilities.textPrimary} transition-all`}>
              <HiOutlineSearch strokeWidth={1.5} />
            </button>
            
            <div
              className="relative hidden sm:block"
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  setIsProfileOpen(false);
                }
              }}
              tabIndex={0}
            >
              {user ? (
                <>
                  <button
                    onClick={() => setIsProfileOpen((prev) => !prev)}
                    className={`flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold ${theme.utilities.textSecondary} hover:${theme.utilities.textPrimary} transition-all`}
                    aria-haspopup="menu"
                    aria-expanded={isProfileOpen}
                  >
                    <span className={`w-9 h-9 rounded-full ${theme.utilities.bgContrast} ${theme.utilities.textInverse} flex items-center justify-center text-xs font-black shadow-lg overflow-hidden relative border-2 ${theme.utilities.border} opacity-90`}>
                      {user.image?.url ? (
                        <Image src={user.image.url} alt={user.name} fill className="object-cover" />
                      ) : (
                        user.name?.[0]?.toUpperCase() || <HiOutlineUser strokeWidth={1.5} />
                      )}
                    </span>
                    <span className="hidden xl:block">{user.name?.split(' ')[0]}</span>
                  </button>
                  <div
                    className={`absolute right-0 top-full pt-4 transition-all duration-300 ${
                      isProfileOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-4'
                    }`}
                  >
                    <div className={`w-72 rounded-sm border ${theme.utilities.border} ${theme.utilities.bgSurface} shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden`}>
                      <div className={`p-6 border-b ${theme.utilities.border} ${theme.utilities.bgMuted}`}>
                        <p className={`text-[9px] uppercase tracking-[0.3em] font-black ${theme.utilities.textMuted} mb-1 opacity-50`}>Member</p>
                        <p className={`text-sm font-bold tracking-tight ${theme.utilities.textPrimary}`}>{user.name}</p>
                        <p className={`text-[11px] ${theme.utilities.textMuted} mt-1 truncate`}>{user.email}</p>
                      </div>
                      <div className="p-3">
                        <Link
                          href="/profile"
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold ${theme.utilities.textSecondary} hover:${theme.utilities.bgMuted} transition-all`}
                        >
                          <HiOutlineUser className="text-lg" />
                          Profile Settings
                        </Link>
                        <Link
                          href="/orders"
                          onClick={() => setIsProfileOpen(false)}
                          className={`flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] font-bold ${theme.utilities.textSecondary} hover:${theme.utilities.bgMuted} transition-all`}
                        >
                          <HiOutlineShoppingBag className="text-lg" />
                          Order History
                        </Link>
                      </div>
                      <div className={`p-3 border-t ${theme.utilities.border}`}>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            logout();
                          }}
                          className={`w-full flex items-center gap-4 px-4 py-3 rounded-sm text-[10px] uppercase tracking-[0.2em] font-black ${theme.utilities.textDanger} hover:${theme.utilities.bgMuted} transition-all`}
                        >
                          <HiOutlineLogout className="text-lg" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <Link href="/login" className={`text-xl ${theme.utilities.textSecondary} hover:${theme.utilities.textPrimary} transition-all flex items-center`}>
                  <HiOutlineUser strokeWidth={1.5} />
                </Link>
              )}
            </div>

            <button onClick={() => setIsCartOpen(true)} className={`relative text-xl ${theme.utilities.textSecondary} hover:${theme.utilities.textPrimary} transition-all`}>
              <HiOutlineShoppingBag strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className={`absolute -top-2 -right-2 ${theme.utilities.bgContrast} ${theme.utilities.textInverse} text-[9px] w-5 h-5 rounded-full flex items-center justify-center font-black shadow-lg border-2 ${theme.utilities.bgSurface}`}>
                  {totalItems}
                </span>
              )}
            </button>

            <button className={`lg:hidden text-2xl ${theme.utilities.textPrimary}`} onClick={() => setIsMobileMenuOpen(true)}>
              <HiMenuAlt3 />
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className={`fixed inset-0 ${theme.utilities.bgSurface} z-[100] animate-fadeIn flex items-center justify-center p-8`}>
          <button onClick={() => setIsSearchOpen(false)} className={`absolute top-8 right-8 text-3xl hover:rotate-90 transition-transform ${theme.utilities.textMuted} hover:${theme.utilities.textPrimary}`}>
            <HiX />
          </button>
          <form onSubmit={handleSearch} className="w-full max-w-3xl space-y-12">
            <h2 className={`text-sm font-black uppercase tracking-[0.5em] text-center ${theme.utilities.textMuted} opacity-50`}>Find Products</h2>
            <div className="relative">
              <input 
                type="text" 
                autoFocus
                placeholder="Search Mashriqi Libas..." 
                className={`w-full bg-transparent border-b-2 ${theme.utilities.border} py-8 text-3xl md:text-6xl font-light uppercase tracking-tighter focus:border-current outline-none transition-all ${theme.utilities.textPrimary}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className={`absolute right-0 bottom-8 text-4xl ${theme.utilities.textMuted} hover:${theme.utilities.textPrimary} transition-all`}>
                <HiOutlineSearch />
              </button>
            </div>
            <p className={`text-[10px] ${theme.utilities.textMuted} uppercase tracking-[0.4em] text-center font-bold`}>Enter to search collection</p>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[60] transition-opacity duration-500 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`fixed left-0 top-0 h-full w-[85%] max-w-sm ${theme.utilities.bgSurface} z-[70] transform transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1) ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} p-10 flex flex-col shadow-2xl`}>
          <button className={`absolute top-6 right-6 text-3xl ${theme.utilities.textMuted} hover:${theme.utilities.textPrimary}`} onClick={() => setIsMobileMenuOpen(false)}>
            <HiX />
          </button>
          
          <div className="flex flex-col space-y-10 mt-16 overflow-y-auto scrollbar-hide">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-black uppercase tracking-[0.2em] border-b-2 ${theme.utilities.border} pb-4 ${theme.utilities.textPrimary}`}>Home</Link>
            
            {categories.map((category) => (
              <div key={category._id} className="space-y-6">
                <Link href={`/products?category=${category.slug}`} onClick={() => setIsMobileMenuOpen(false)} className={`text-2xl font-black uppercase tracking-[0.2em] border-b-2 ${theme.utilities.border} pb-4 flex justify-between items-center ${theme.utilities.textPrimary}`}>
                  {category.name}
                  <span className="text-sm opacity-30">+</span>
                </Link>
                {category.subcategories?.length > 0 && (
                  <div className="pl-4 space-y-4 border-l-2 border-gray-100/10">
                    {renderSubcategoryLinks(category.subcategories || [], category.slug, 0, () => setIsMobileMenuOpen(false))}
                  </div>
                )}
              </div>
            ))}
            
            <div className="pt-10 mt-auto space-y-6">
              <Link href="/orders/tracking" onClick={() => setIsMobileMenuOpen(false)} className={`block text-[11px] font-black ${theme.utilities.textMuted} uppercase tracking-[0.4em] hover:${theme.utilities.textPrimary}`}>Track Your Order</Link>
              <div className={`pt-6 border-t ${theme.utilities.border} opacity-20`}>
                <p className={`text-[9px] uppercase tracking-[0.3em] ${theme.utilities.textMuted} mb-4`}>Need assistance?</p>
                <p className={`text-xs font-bold ${theme.utilities.textPrimary}`}>+92 300 1234567</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
