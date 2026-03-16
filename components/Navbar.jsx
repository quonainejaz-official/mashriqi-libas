'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineSearch, HiMenuAlt3, HiX } from 'react-icons/hi';
import BrandLogo from '@/components/BrandLogo';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState([]);
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
  const renderSubcategoryLinks = (subcategories, categorySlug, depth = 0, onClick) =>
    subcategories.map((sub) => (
      <div key={`${categorySlug}-${sub.slug}`} style={{ paddingLeft: depth * 12 }}>
        <Link
          href={`/products?category=${categorySlug}&subcategory=${sub.slug}`}
          className="hover:text-[#A08C5B] transition-colors block"
          onClick={onClick}
        >
          {sub.name}
        </Link>
        {sub.subcategories?.length > 0 && renderSubcategoryLinks(sub.subcategories, categorySlug, depth + 1, onClick)}
      </div>
    ));

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 bg-white border-b border-gray-100 py-3`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center space-x-8 flex-1">
            {categories.map((category) => (
              <div key={category._id} className="relative group">
                <Link href={`/products?category=${category.slug}`} className="text-[11px] uppercase tracking-[0.2em] font-medium hover:text-gray-500 transition-colors">
                  {category.name}
                </Link>
                {category.subcategories?.length > 0 && (
                  <div className="absolute left-0 top-full pt-6 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                    <div className="bg-white border border-gray-100 shadow-2xl p-6 w-[520px] grid grid-cols-[1fr_180px] gap-6">
                      <div className="space-y-2 text-[10px] uppercase tracking-widest text-gray-500">
                        {renderSubcategoryLinks(category.subcategories || [], category.slug)}
                        <Link href={`/products?category=${category.slug}`} className="text-[#A08C5B] font-semibold">
                          View All
                        </Link>
                      </div>
                      <div className="space-y-3">
                        <div className="h-28 w-full bg-gray-50 overflow-hidden relative">
                          {category.image?.url ? (
                            <Image src={category.image.url} alt={category.name} fill className="object-cover" />
                          ) : (
                            <div className="h-full w-full bg-gradient-to-br from-gray-50 to-gray-100" />
                          )}
                        </div>
                        <p className="text-[9px] uppercase tracking-widest text-gray-400">{category.name}</p>
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
          <div className="flex-1 flex items-center justify-end space-x-5 md:space-x-8">
            <button onClick={() => setIsSearchOpen(true)} className="text-xl hover:text-gray-400 transition-colors">
              <HiOutlineSearch strokeWidth={1.5} />
            </button>
            
            <div className="relative group hidden sm:block">
              <Link href={user ? "/profile" : "/login"} className="text-xl hover:text-gray-400 transition-colors flex items-center">
                <HiOutlineUser strokeWidth={1.5} />
                {user && <span className="hidden xl:block text-[10px] uppercase ml-2 tracking-widest font-medium">{user.name.split(' ')[0]}</span>}
              </Link>
            </div>

            <button onClick={() => setIsCartOpen(true)} className="relative text-xl hover:text-gray-400 transition-colors">
              <HiOutlineShoppingBag strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {totalItems}
                </span>
              )}
            </button>

            <button className="lg:hidden text-2xl" onClick={() => setIsMobileMenuOpen(true)}>
              <HiMenuAlt3 />
            </button>
          </div>
        </div>
      </div>

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-white z-[100] animate-fadeIn flex items-center justify-center p-8">
          <button onClick={() => setIsSearchOpen(false)} className="absolute top-8 right-8 text-3xl hover:rotate-90 transition-transform">
            <HiX />
          </button>
          <form onSubmit={handleSearch} className="w-full max-w-3xl space-y-8">
            <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-center text-gray-400">Search Products</h2>
            <div className="relative">
              <input 
                type="text" 
                autoFocus
                placeholder="What are you looking for?" 
                className="w-full bg-transparent border-b-2 border-gray-100 py-6 text-2xl md:text-5xl font-light uppercase tracking-tighter focus:border-[#A08C5B] outline-none transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="submit" className="absolute right-0 bottom-6 text-3xl text-gray-300 hover:text-[#A08C5B]">
                <HiOutlineSearch />
              </button>
            </div>
            <p className="text-[10px] text-gray-400 uppercase tracking-widest text-center">Press Enter to Search</p>
          </form>
        </div>
      )}

      {/* Mobile Menu Overlay */}
      <div className={`fixed inset-0 bg-black bg-opacity-50 z-[60] transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
        <div className={`fixed left-0 top-0 h-full w-4/5 max-w-sm bg-white z-[70] transform transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} p-8`}>
          <button className="absolute top-4 right-4 text-2xl" onClick={() => setIsMobileMenuOpen(false)}>
            <HiX />
          </button>
          <div className="flex flex-col space-y-6 mt-12">
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-semibold uppercase tracking-widest border-b pb-2">Home</Link>
            {categories.map((category) => (
              <div key={category._id} className="space-y-3">
                <Link href={`/products?category=${category.slug}`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-semibold uppercase tracking-widest border-b pb-2">
                  {category.name}
                </Link>
                {category.subcategories?.length > 0 && (
                  <div className="pl-3 space-y-2">
                    {renderSubcategoryLinks(category.subcategories || [], category.slug, 0, () => setIsMobileMenuOpen(false))}
                  </div>
                )}
              </div>
            ))}
            <Link href="/orders/tracking" onClick={() => setIsMobileMenuOpen(false)} className="text-sm font-medium text-gray-500 uppercase tracking-widest pt-4">Track Order</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
