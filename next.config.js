/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'via.placeholder.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'nishatlinen.com' },
      { protocol: 'https', hostname: 'upload.wikimedia.org' }
    ],
  },
  allowedDevOrigins: ['http://localhost:3000', 'http://192.168.18.177:3000'],
  serverExternalPackages: ['mongoose'],
};

module.exports = nextConfig;
