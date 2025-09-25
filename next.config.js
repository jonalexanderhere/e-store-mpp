/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co'],
  },
  // Disable static optimization for pages that use Supabase
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Force all pages to be dynamic
  trailingSlash: true,
}

module.exports = nextConfig

