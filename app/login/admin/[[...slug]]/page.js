import { redirect } from 'next/navigation';

export default function AdminLoginRedirect({ params }) {
  const slug = params?.slug || [];
  if (slug.includes('dashboard') || slug.includes('dashboad')) {
    redirect('/admin/dashboard');
  }
  redirect('/login');
}
