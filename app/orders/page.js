import OrdersClient from '@/components/OrdersClient';

export const metadata = {
  title: 'My Orders',
  description: 'View your order history and track deliveries.',
  alternates: {
    canonical: '/orders',
  },
  openGraph: {
    title: 'My Orders',
    description: 'View your order history and track deliveries.',
    url: '/orders',
  },
  twitter: {
    title: 'My Orders',
    description: 'View your order history and track deliveries.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function OrderHistoryPage() {
  return <OrdersClient />;
}
