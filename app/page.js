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
  },
  twitter: {
    title: 'Premium Eastern Wear & Pakistani Fashion',
    description: 'Shop premium unstitched, stitched, and luxury pret collections. Explore Mashriqi Libas for seasonal drops and best sellers.',
  },
};

export default function Home() {
  return <HomeClient />;
}
