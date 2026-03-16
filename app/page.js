import HomeClient from '@/components/HomeClient';

export const metadata = {
  title: 'Premium Eastern Wear & Pakistani Fashion',
  description: 'Shop premium unstitched, stitched, and luxury pret collections. Explore Mashriqi Libas for seasonal drops and best sellers.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Premium Eastern Wear & Pakistani Fashion',
    description: 'Shop premium unstitched, stitched, and luxury pret collections. Explore Mashriqi Libas for seasonal drops and best sellers.',
    url: '/',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Mashriqi Libas',
      },
    ],
  },
  twitter: {
    title: 'Premium Eastern Wear & Pakistani Fashion',
    description: 'Shop premium unstitched, stitched, and luxury pret collections. Explore Mashriqi Libas for seasonal drops and best sellers.',
    images: ['/twitter-image'],
  },
};

export default function Home() {
  return <HomeClient />;
}
