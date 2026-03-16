import CheckoutClient from '@/components/CheckoutClient';

export const metadata = {
  title: 'Checkout',
  description: 'Secure checkout for your Mashriqi Libas order.',
  alternates: {
    canonical: '/checkout',
  },
  openGraph: {
    title: 'Checkout',
    description: 'Secure checkout for your Mashriqi Libas order.',
    url: '/checkout',
  },
  twitter: {
    title: 'Checkout',
    description: 'Secure checkout for your Mashriqi Libas order.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
