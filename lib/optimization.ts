// Bundle optimization utilities
export const optimizeBundle = () => {
  // Dynamic imports for better code splitting
  const dynamicImports = {
    // Lazy load heavy components
    AdminDashboard: () => import('@/app/admin/dashboard/page'),
    UserDashboard: () => import('@/app/dashboard/page'),
    ProductsPage: () => import('@/app/products/page'),
    CartPage: () => import('@/app/cart/page'),
  }
  
  return dynamicImports
}

// Memory optimization
export const optimizeMemory = () => {
  if (typeof window !== 'undefined') {
    // Clear unused memory
    if (window.gc) {
      window.gc()
    }
    
    // Clear unused event listeners
    const unusedListeners = document.querySelectorAll('[data-unused]')
    unusedListeners.forEach(element => {
      element.remove()
    })
  }
}

// String optimization for large data
export const optimizeString = (str: string, maxLength: number = 1000): string => {
  if (str.length <= maxLength) return str
  
  // Use Buffer for large strings
  const buffer = Buffer.from(str, 'utf8')
  const optimized = buffer.toString('utf8', 0, maxLength)
  
  return optimized + '...'
}

// Debounce for performance
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Throttle for performance
export const throttle = <T extends (...args: any[]) => any>(
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
}

// Image optimization
export const optimizeImage = (src: string, width: number = 800, quality: number = 75): string => {
  // Use Next.js Image optimization
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}

// Bundle size optimization
export const optimizeBundleSize = () => {
  // Tree shaking optimization
  const unusedExports = [
    'unusedFunction',
    'unusedComponent',
    'unusedUtility',
  ]
  
  // Remove unused exports
  unusedExports.forEach(exportName => {
    if (typeof window !== 'undefined') {
      delete (window as any)[exportName]
    }
  })
}
