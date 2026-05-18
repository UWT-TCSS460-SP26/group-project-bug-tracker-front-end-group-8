/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://tcss460-team-8-api.onrender.com/:path*',
      },
    ];
  },
}

module.exports = nextConfig
