import AdminLayoutClient from '@/components/AdminLayoutClient';

export const metadata = {
  title: 'Admin',
  description: 'Admin portal for Mashriqi Libas.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
