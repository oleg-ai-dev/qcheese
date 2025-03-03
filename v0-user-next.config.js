/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Generate static HTML files for deployment
  images: {
    unoptimized: true, // For static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "qcheese.com",
      },
    ],
  },
  // Increase the timeout for builds to handle large datasets
  experimental: {
    staticPageGenerationTimeout: 180, // 3 minutes
  },
}

module.exports = nextConfig

