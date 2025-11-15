/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "static.valorantzone.gg",
      },
      {
        protocol: "https",
        hostname: "noticias.maisesports.com.br",
      },
      {
        protocol: "https",
        hostname: "s2-techtudo.glbimg.com",
      },
      {
        protocol: "https",
        hostname: "s2-ge.glbimg.com",
      },
      {
        protocol: "https",
        hostname: "cdn.thespike.gg",
      },
      {
        protocol: "https",
        hostname: "static.wikia.nocookie.net",
      },
      {
        protocol: "https",
        hostname: "cmsassets.rgpub.io",
      },
      {
        protocol: "https",
        hostname: "encrypted-tbn0.gstatic.com",
      },
      {
        protocol: "https",
        hostname: "media.valorant-api.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/api/webhooks',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/json',
          },
        ],
      },
    ];
  },
};

export default nextConfig;