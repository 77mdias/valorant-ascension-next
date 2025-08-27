import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
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
    ],
  },
};

export default nextConfig;
