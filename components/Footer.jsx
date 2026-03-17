'use client';

import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPinterestP } from 'react-icons/fa';
import BrandLogo from '@/components/BrandLogo';
import { useTheme } from '@/context/ThemeContext';

const Footer = () => {
  const { theme } = useTheme();
  return (
    <footer className={`${theme.utilities.bgSurface} ${theme.utilities.textPrimary} pt-24 pb-12 border-t ${theme.utilities.border}`}>
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="space-y-8">
            <Link href="/" className="inline-flex">
              <BrandLogo className="w-[170px] h-auto" />
            </Link>
            <p className={`${theme.utilities.textMuted} text-sm leading-relaxed font-light max-w-xs`}>
              Redefining Eastern elegance through timeless designs and premium craftsmanship. Discover the fabric of our heritage.
            </p>
            <div className="flex space-x-6 pt-2">
              <a href="#" className={`${theme.utilities.textMuted} theme-hover-text-primary transition-colors`}><FaFacebookF /></a>
              <a href="#" className={`${theme.utilities.textMuted} theme-hover-text-primary transition-colors`}><FaInstagram /></a>
              <a href="#" className={`${theme.utilities.textMuted} theme-hover-text-primary transition-colors`}><FaWhatsapp /></a>
              <a href="#" className={`${theme.utilities.textMuted} theme-hover-text-primary transition-colors`}><FaPinterestP /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme.utilities.textMuted}`}>Shop</h4>
            <ul className={`space-y-4 text-xs tracking-widest uppercase font-medium ${theme.utilities.textSecondary}`}>
              <li><Link href="/products" className="theme-hover-text-primary transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?category=stitched" className="theme-hover-text-primary transition-colors">Stitched</Link></li>
              <li><Link href="/products?category=unstitched" className="theme-hover-text-primary transition-colors">Unstitched</Link></li>
              <li><Link href="/products?category=accessories" className="theme-hover-text-primary transition-colors">Accessories</Link></li>
              <li><Link href="/products?sale=true" className="theme-hover-text-danger transition-colors">Sale %</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-8">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme.utilities.textMuted}`}>Customer Care</h4>
            <ul className={`space-y-4 text-xs tracking-widest uppercase font-medium ${theme.utilities.textSecondary}`}>
              <li><Link href="/orders/tracking" className="theme-hover-text-primary transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="theme-hover-text-primary transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="theme-hover-text-primary transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="theme-hover-text-primary transition-colors">FAQs</Link></li>
              <li><Link href="/store-locator" className="theme-hover-text-primary transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className={`text-[10px] font-bold uppercase tracking-[0.3em] ${theme.utilities.textMuted}`}>Information</h4>
            <div className={`space-y-4 text-xs tracking-widest uppercase font-medium ${theme.utilities.textSecondary}`}>
              <p className="leading-relaxed">Head Office: 123 Fashion Ave, Lahore, Pakistan</p>
              <p>Email: info@mashriqilibas.com</p>
              <p>Phone: +92 300 1234567</p>
              <p className={`pt-4 text-[10px] ${theme.utilities.textMuted}`}>Available Mon-Sat: 9am - 6pm</p>
            </div>
          </div>
        </div>

        <div className={`border-t ${theme.utilities.border} pt-10 flex flex-col md:flex-row items-center justify-between text-[10px] ${theme.utilities.textMuted} uppercase tracking-[0.3em] font-medium`}>
          <p>© 2024 Mashriqi Libas. All Rights Reserved.</p>
          <div className="flex items-center space-x-8 mt-6 md:mt-0">
            <Link href="/privacy" className="theme-hover-text-primary transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="theme-hover-text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
