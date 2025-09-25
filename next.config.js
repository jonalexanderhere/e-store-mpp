/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co', 'inspiraproject.supabase.co'],
  },
  // Force all pages to be dynamic
  trailingSlash: true,
}

module.exports = nextConfig