import connectDB from '@/lib/db';
import Product from '@/models/Product';
import Category from '@/models/Category';

const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mashriqi-libas.vercel.app';

const getStaticRoutes = () => [
  { url: '/', changeFrequency: 'daily', priority: 1 },
  { url: '/products', changeFrequency: 'daily', priority: 0.9 },
  { url: '/contact', changeFrequency: 'monthly', priority: 0.6 },
  { url: '/faq', changeFrequency: 'monthly', priority: 0.5 },
  { url: '/shipping', changeFrequency: 'monthly', priority: 0.5 },
  { url: '/store-locator', changeFrequency: 'monthly', priority: 0.5 },
];

export default async function sitemap() {
  const baseUrl = getBaseUrl();
  const now = new Date();
  let products = [];
  let categories = [];

  try {
    await connectDB();
    products = await Product.find({ isActive: true }).select('_id updatedAt').lean();
    categories = await Category.find({ isActive: true }).select('slug updatedAt').lean();
  } catch (error) {
    products = [];
    categories = [];
  }

  const staticRoutes = getStaticRoutes().map((route) => ({
    url: `${baseUrl}${route.url}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const productRoutes = products.map((product) => ({
    url: `${baseUrl}/products/${product._id}`,
    lastModified: product.updatedAt || now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${baseUrl}/products?category=${category.slug}`,
    lastModified: category.updatedAt || now,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
