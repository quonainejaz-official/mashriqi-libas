import { Suspense } from 'react';
import ProductsClient from '@/components/ProductsClient';

const buildTitle = (category, search) => {
  if (search) return `Search results for "${search}"`;
  if (category) return `${category.replace('-', ' ')} Collection`;
  return 'All Collections';
};

export async function generateMetadata({ searchParams }) {
  const category = searchParams?.category || '';
  const search = searchParams?.search || '';
  const title = buildTitle(category, search);
  const description = search
    ? `Explore styles matching "${search}" at Mashriqi Libas.`
    : category
    ? `Shop the latest ${category.replace('-', ' ')} designs at Mashriqi Libas.`
    : 'Browse all collections including stitched, unstitched, and luxury pret.';

  const query = new URLSearchParams();
  if (category) query.set('category', category);
  if (search) query.set('search', search);
  const canonical = query.toString() ? `/products?${query.toString()}` : '/products';

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
    },
    twitter: {
      title,
      description,
    },
  };
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsClient />
    </Suspense>
  );
}
