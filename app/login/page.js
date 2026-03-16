import LoginClient from '@/components/LoginClient';

export const metadata = {
  title: 'Login',
  description: 'Sign in to your Mashriqi Libas account.',
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Login',
    description: 'Sign in to your Mashriqi Libas account.',
    url: '/login',
  },
  twitter: {
    title: 'Login',
    description: 'Sign in to your Mashriqi Libas account.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
