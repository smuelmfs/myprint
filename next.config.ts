import type { NextConfig } from "next";

const WORDPRESS_DOMAIN = process.env.WORDPRESS_DOMAIN;

const nextConfig: NextConfig = {
  async headers() {
    if (!WORDPRESS_DOMAIN) {
      return [];
    }
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "ALLOW-FROM " + WORDPRESS_DOMAIN },
          { key: "Content-Security-Policy", value: `frame-ancestors 'self' ${WORDPRESS_DOMAIN}` },
        ],
      },
    ];
  },
};

export default nextConfig;
