import Link from 'next/link';
import { FaFacebookF, FaInstagram, FaWhatsapp, FaPinterestP } from 'react-icons/fa';
import BrandLogo from '@/components/BrandLogo';

const Footer = () => {
  return (
    <footer className="bg-white text-black pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-[1600px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand & Mission */}
          <div className="space-y-8">
            <Link href="/" className="inline-flex">
              <BrandLogo className="w-[170px] h-auto" />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed font-light max-w-xs">
              Redefining Eastern elegance through timeless designs and premium craftsmanship. Discover the fabric of our heritage.
            </p>
            <div className="flex space-x-6 pt-2">
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaFacebookF /></a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaWhatsapp /></a>
              <a href="#" className="text-gray-400 hover:text-black transition-colors"><FaPinterestP /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Shop</h4>
            <ul className="space-y-4 text-xs tracking-widest uppercase font-medium text-gray-600">
              <li><Link href="/products" className="hover:text-black transition-colors">New Arrivals</Link></li>
              <li><Link href="/products?category=stitched" className="hover:text-black transition-colors">Stitched</Link></li>
              <li><Link href="/products?category=unstitched" className="hover:text-black transition-colors">Unstitched</Link></li>
              <li><Link href="/products?category=accessories" className="hover:text-black transition-colors">Accessories</Link></li>
              <li><Link href="/products?sale=true" className="hover:text-red-500 transition-colors">Sale %</Link></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Customer Care</h4>
            <ul className="space-y-4 text-xs tracking-widest uppercase font-medium text-gray-600">
              <li><Link href="/orders/tracking" className="hover:text-black transition-colors">Track Order</Link></li>
              <li><Link href="/shipping" className="hover:text-black transition-colors">Shipping & Returns</Link></li>
              <li><Link href="/contact" className="hover:text-black transition-colors">Contact Us</Link></li>
              <li><Link href="/faq" className="hover:text-black transition-colors">FAQs</Link></li>
              <li><Link href="/store-locator" className="hover:text-black transition-colors">Store Locator</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">Information</h4>
            <div className="space-y-4 text-xs tracking-widest uppercase font-medium text-gray-600">
              <p className="leading-relaxed">Head Office: 123 Fashion Ave, Lahore, Pakistan</p>
              <p>Email: info@mashriqilibas.com</p>
              <p>Phone: +92 300 1234567</p>
              <p className="pt-4 text-[10px] text-gray-400">Available Mon-Sat: 9am - 6pm</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row items-center justify-between text-[10px] text-gray-400 uppercase tracking-[0.3em] font-medium">
          <p>© 2024 Mashriqi Libas. All Rights Reserved.</p>
          <div className="flex items-center space-x-8 mt-6 md:mt-0">
            <Link href="/privacy" className="hover:text-black transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-black transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
