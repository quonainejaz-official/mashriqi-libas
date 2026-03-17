'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineShoppingBag,
  HiOutlineUsers,
  HiOutlineArrowLeft,
  HiOutlineChartBar
} from 'react-icons/hi';
import { useAuth } from '@/context/AuthContext';

const AdminLayoutClient = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuth();

  const menuItems = [
    { label: 'Dashboard', icon: HiOutlineViewGrid, href: '/admin/dashboard' },
    { label: 'Products', icon: HiOutlineShoppingBag, href: '/admin/products' },
    { label: 'Categories', icon: HiOutlineCollection, href: '/admin/categories' },
    { label: 'Orders', icon: HiOutlineChartBar, href: '/admin/orders' },
    { label: 'Users', icon: HiOutlineUsers, href: '/admin/users' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-[#2C3E50] text-white hidden lg:flex flex-col sticky top-0 h-screen">
        <div className="p-8 border-b border-gray-700">
          <h1 className="text-xl font-bold uppercase tracking-widest text-center">Admin Portal</h1>
          <p className="text-[10px] text-gray-400 text-center mt-1 uppercase tracking-widest leading-relaxed">Mashriqi Libas</p>
        </div>

        <nav className="flex-grow p-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-4 px-4 py-3 text-sm font-medium transition-all
                ${pathname === item.href ? 'bg-[#A08C5B] text-white shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}
              `}
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-700 space-y-4">
          <div className="flex items-center space-x-3 px-4">
            <div className="w-8 h-8 rounded-full bg-[#A08C5B] flex items-center justify-center font-bold overflow-hidden relative">
              {user?.image?.url ? (
                <Image src={user.image.url} alt={user?.name || 'Admin'} fill className="object-cover" />
              ) : (
                user?.name?.[0] || 'A'
              )}
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <Link href="/" className="flex items-center space-x-4 px-4 py-2 text-xs text-gray-400 hover:text-white border-t border-gray-700 pt-4">
            <HiOutlineArrowLeft />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      <main className="flex-grow lg:p-8 overflow-y-auto">
        <div className="lg:hidden bg-[#2C3E50] text-white p-4 flex items-center justify-between">
          <h1 className="font-bold uppercase tracking-widest">Admin</h1>
          <div className="flex space-x-4">
            <Link href="/admin/dashboard" className="text-xl"><HiOutlineViewGrid /></Link>
            <Link href="/" className="text-xl"><HiOutlineArrowLeft /></Link>
          </div>
        </div>

        <div className="p-4 md:p-0">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayoutClient;
