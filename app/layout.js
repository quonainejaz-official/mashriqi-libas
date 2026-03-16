import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Mashriqi Libas | Premium Eastern Wear',
  description: 'Mashriqi Libas - Your destination for premium Eastern and traditional Pakistani clothing.',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <CartSidebar />
          <main className="min-h-screen pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
