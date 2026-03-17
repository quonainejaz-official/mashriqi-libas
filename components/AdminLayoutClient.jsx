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
import { useTheme } from '@/context/ThemeContext';

const AdminLayoutClient = ({ children }) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const { theme } = useTheme();

  const menuItems = [
    { label: 'Dashboard', icon: HiOutlineViewGrid, href: '/admin/dashboard' },
    { label: 'Products', icon: HiOutlineShoppingBag, href: '/admin/products' },
    { label: 'Categories', icon: HiOutlineCollection, href: '/admin/categories' },
    { label: 'Orders', icon: HiOutlineChartBar, href: '/admin/orders' },
    { label: 'Users', icon: HiOutlineUsers, href: '/admin/users' },
  ];

  return (
    <div className={`min-h-screen ${theme.utilities.bgMuted} flex`}>
      <aside className={`w-64 ${theme.utilities.bgContrast} ${theme.utilities.textInverse} hidden lg:flex flex-col sticky top-0 h-screen border-r ${theme.utilities.border} opacity-95`}>
        <div className={`p-8 border-b ${theme.utilities.border} opacity-20`}>
          <h1 className="text-xl font-bold uppercase tracking-widest text-center">Admin Portal</h1>
          <p className="text-[10px] opacity-70 text-center mt-1 uppercase tracking-widest leading-relaxed">Mashriqi Libas</p>
        </div>

        <nav className="flex-grow p-4 mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center space-x-4 px-4 py-3 text-sm font-medium transition-all
                ${pathname === item.href ? `${theme.utilities.bgContrastMuted} ${theme.utilities.textInverse} shadow-lg` : `opacity-60 hover:opacity-100 hover:${theme.utilities.bgContrastMuted}`}
              `}
            >
              <item.icon className="text-xl" />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={`p-4 border-t ${theme.utilities.border} opacity-20 space-y-4`}>
          <div className="flex items-center space-x-3 px-4">
            <div className={`w-8 h-8 rounded-full ${theme.utilities.bgContrastMuted} flex items-center justify-center font-bold overflow-hidden relative shadow-inner`}>
              {user?.image?.url ? (
                <Image src={user.image.url} alt={user?.name || 'Admin'} fill className="object-cover" />
              ) : (
                user?.name?.[0] || 'A'
              )}
            </div>
            <div className="flex-grow overflow-hidden">
              <p className="text-xs font-bold truncate">{user?.name || 'Admin User'}</p>
              <p className="text-[10px] opacity-60 truncate">{user?.email}</p>
            </div>
          </div>
          <Link href="/" className={`flex items-center space-x-4 px-4 py-2 text-xs opacity-60 hover:opacity-100 border-t ${theme.utilities.border} pt-4 transition-opacity`}>
            <HiOutlineArrowLeft />
            <span>Back to Website</span>
          </Link>
        </div>
      </aside>

      <main className="flex-grow lg:p-8 overflow-y-auto">
        <div className={`lg:hidden ${theme.utilities.bgContrast} ${theme.utilities.textInverse} p-4 flex items-center justify-between`}>
          <h1 className="font-bold uppercase tracking-widest">Admin</h1>
          <div className="flex space-x-4">
            <Link href="/admin/dashboard" className="text-xl"><HiOutlineViewGrid /></Link>
            <Link href="/" className="text-xl"><HiOutlineArrowLeft /></Link>
          </div>
        </div>

        <div className={`p-4 md:p-0 ${theme.utilities.bgMuted}`}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayoutClient;
