const getBaseUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL || 'https://mashriqi-libas.vercel.app';

export default function robots() {
  const baseUrl = getBaseUrl();
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
