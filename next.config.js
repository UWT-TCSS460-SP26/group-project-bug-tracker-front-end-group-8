/** @type {import('next').NextConfig} */
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    if (!API_BASE) return [];
    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE}/v1/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
