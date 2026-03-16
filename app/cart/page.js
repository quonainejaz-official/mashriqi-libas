import CartClient from '@/components/CartClient';

export const metadata = {
  title: 'Your Shopping Bag',
  description: 'Review your selected items, update quantities, and proceed to checkout.',
  alternates: {
    canonical: '/cart',
  },
  openGraph: {
    title: 'Your Shopping Bag',
    description: 'Review your selected items, update quantities, and proceed to checkout.',
    url: '/cart',
  },
  twitter: {
    title: 'Your Shopping Bag',
    description: 'Review your selected items, update quantities, and proceed to checkout.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function CartPage() {
  return <CartClient />;
}
