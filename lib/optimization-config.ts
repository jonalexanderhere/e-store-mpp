// Optimization configuration for Inspiraproject
export const optimizationConfig = {
  // Webpack optimization
  webpack: {
    performance: {
      hints: 'warning',
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
            priority: 10,
          },
          common: {
            name: 'common',
            minChunks: 2,
            chunks: 'all',
            priority: 5,
            reuseExistingChunk: true,
          },
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            chunks: 'all',
            priority: 20,
          },
          supabase: {
            test: /[\\/]node_modules[\\/]@supabase[\\/]/,
            name: 'supabase',
            chunks: 'all',
            priority: 15,
          },
        },
      },
      usedExports: true,
      sideEffects: false,
    },
  },
  
  // Next.js optimization
  nextjs: {
    images: {
      domains: ['your-supabase-project.supabase.co', 'inspiraproject.supabase.co'],
    },
    trailingSlash: true,
    experimental: {
      optimizeCss: true,
    },
    compiler: {
      removeConsole: process.env.NODE_ENV === 'production',
    },
  },
  
  // Performance optimization
  performance: {
    optimizeString: (str: string, maxLength: number = 1000): string => {
      if (str.length <= maxLength) return str
      
      const buffer = Buffer.from(str, 'utf8')
      const optimized = buffer.toString('utf8', 0, maxLength)
      
      return optimized + '...'
    },
    
    optimizeMemory: () => {
      if (typeof window !== 'undefined') {
        if (window.gc) {
          window.gc()
        }
        
        const unusedListeners = document.querySelectorAll('[data-unused]')
        unusedListeners.forEach(element => {
          element.remove()
        })
      }
    },
    
    optimizeBundle: () => {
      const unusedExports = [
        'unusedFunction',
        'unusedComponent',
        'unusedUtility',
      ]
      
      unusedExports.forEach(exportName => {
        if (typeof window !== 'undefined') {
          delete (window as any)[exportName]
        }
      })
    },
    
    optimizeImage: (src: string, width: number = 800, quality: number = 75): string => {
      return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
    },
  },
  
  // Utility functions
  utils: {
    debounce: <T extends (...args: any[]) => any>(
      func: T,
      wait: number
    ): ((...args: Parameters<T>) => void) => {
      let timeout: NodeJS.Timeout | null = null
      
      return (...args: Parameters<T>) => {
        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(() => func(...args), wait)
      }
    },
    
    throttle: <T extends (...args: any[]) => any>(
      func: T,
      limit: number
    ): ((...args: Parameters<T>) => void) => {
      let inThrottle: boolean
      
      return (...args: Parameters<T>) => {
        if (!inThrottle) {
          func(...args)
          inThrottle = true
          setTimeout(() => (inThrottle = false), limit)
        }
      }
    },
  },
}
