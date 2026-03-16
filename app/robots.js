const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mashriqi-libas.vercel.app';

export default function robots() {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin',
          '/cart',
          '/checkout',
          '/profile',
          '/orders',
          '/login',
          '/signup',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
