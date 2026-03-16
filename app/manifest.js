const getBaseUrl = () => process.env.NEXT_PUBLIC_SITE_URL || 'https://mashriqilibas.com';

export default function manifest() {
  const baseUrl = getBaseUrl();
  return {
    name: 'Mashriqi Libas',
    short_name: 'Mashriqi Libas',
    description: 'Premium Eastern and traditional Pakistani clothing.',
    start_url: `${baseUrl}/`,
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#2C3E50',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
