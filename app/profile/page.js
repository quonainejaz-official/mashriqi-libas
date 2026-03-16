import ProfileClient from '@/components/ProfileClient';

export const metadata = {
  title: 'My Profile',
  description: 'Manage your Mashriqi Libas profile and saved addresses.',
  alternates: {
    canonical: '/profile',
  },
  openGraph: {
    title: 'My Profile',
    description: 'Manage your Mashriqi Libas profile and saved addresses.',
    url: '/profile',
  },
  twitter: {
    title: 'My Profile',
    description: 'Manage your Mashriqi Libas profile and saved addresses.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ProfilePage() {
  return <ProfileClient />;
}
