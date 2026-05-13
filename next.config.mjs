/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // Re-enabled build checks
    ignoreBuildErrors: false,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
