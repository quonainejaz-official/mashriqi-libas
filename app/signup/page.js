import SignupClient from '@/components/SignupClient';

export const metadata = {
  title: 'Create Account',
  description: 'Create your Mashriqi Libas account to manage orders and checkout faster.',
  alternates: {
    canonical: '/signup',
  },
  openGraph: {
    title: 'Create Account',
    description: 'Create your Mashriqi Libas account to manage orders and checkout faster.',
    url: '/signup',
  },
  twitter: {
    title: 'Create Account',
    description: 'Create your Mashriqi Libas account to manage orders and checkout faster.',
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function SignupPage() {
  return <SignupClient />;
}
