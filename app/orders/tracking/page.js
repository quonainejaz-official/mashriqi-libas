import OrderTrackingClient from '@/components/OrderTrackingClient';

export const metadata = {
  title: 'Track Order',
  description: 'Track your Mashriqi Libas order status in real time.',
  alternates: {
    canonical: '/orders/tracking',
  },
  openGraph: {
    title: 'Track Order',
    description: 'Track your Mashriqi Libas order status in real time.',
    url: '/orders/tracking',
  },
  twitter: {
    title: 'Track Order',
    description: 'Track your Mashriqi Libas order status in real time.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function TrackingPage() {
  return <OrderTrackingClient />;
}
