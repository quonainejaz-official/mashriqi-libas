import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartSidebar from '@/components/CartSidebar';

const inter = Inter({ subsets: ['latin'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mashriqi-libas.vercel.app';
const siteName = 'Mashriqi Libas';
const defaultTitle = 'Mashriqi Libas | Premium Eastern Wear';
const defaultDescription = 'Mashriqi Libas - Your destination for premium Eastern and traditional Pakistani clothing.';
const structuredOrganization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: siteName,
  url: siteUrl,
  logo: `${siteUrl}/opengraph-image`,
};
const structuredWebsite = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: siteName,
  url: siteUrl,
};

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: defaultTitle,
    template: '%s | Mashriqi Libas',
  },
  description: defaultDescription,
  applicationName: siteName,
  keywords: [
    'Pakistani clothing',
    'Eastern wear',
    'Women fashion',
    'Unstitched suits',
    'Stitched wear',
    'Luxury pret',
    'Mashriqi Libas',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  icons: {
    icon: '/icon.svg',
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    url: siteUrl,
    title: defaultTitle,
    description: defaultDescription,
    siteName,
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: defaultTitle,
    description: defaultDescription,
    images: ['/twitter-image'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredOrganization),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredWebsite),
          }}
        />
      </head>
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
