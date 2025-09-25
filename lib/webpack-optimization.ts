// Webpack optimization for Inspiraproject
export const webpackOptimization = {
  // Performance optimization
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  
  // Bundle optimization
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
  
  // Resolve optimization
  resolve: {
    alias: {
      '@': './',
      '@/components': './components',
      '@/lib': './lib',
      '@/app': './app',
    },
  },
  
  // Module optimization
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['next/babel'],
            plugins: [
              [
                'babel-plugin-import',
                {
                  libraryName: 'lucide-react',
                  libraryDirectory: '',
                  camel2DashComponentName: false,
                },
                'lucide-react',
              ],
            ],
          },
        },
      },
    ],
  },
}

// Export optimization utilities
export const optimizationUtils = {
  // String optimization
  optimizeString: (str: string, maxLength: number = 1000): string => {
    if (str.length <= maxLength) return str
    
    const buffer = Buffer.from(str, 'utf8')
    const optimized = buffer.toString('utf8', 0, maxLength)
    
    return optimized + '...'
  },
  
  // Memory optimization
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
  
  // Bundle optimization
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
  
  // Image optimization
  optimizeImage: (src: string, width: number = 800, quality: number = 75): string => {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
  },
}
