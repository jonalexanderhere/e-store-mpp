/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-supabase-project.supabase.co', 'inspiraproject.supabase.co'],
  },
  // Force all pages to be dynamic
  trailingSlash: true,
  // Optimize webpack for better performance
  webpack: (config, { isServer, dev }) => {
    // Optimize for better performance
    if (!dev) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all',
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true,
            },
          },
        },
        usedExports: true,
        sideEffects: false,
      }
    }
    
    // Performance optimization
    config.performance = {
      hints: 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    }
    
    return config
  },
  // Experimental features
  experimental: {
    optimizeCss: true,
    // Remove deprecated options
  },
  // Compiler optimization
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
}

module.exports = nextConfig