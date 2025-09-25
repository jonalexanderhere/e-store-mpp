// Performance optimization for Inspiraproject
export class PerformanceOptimizer {
  private static instance: PerformanceOptimizer
  private cache: Map<string, any> = new Map()
  
  static getInstance(): PerformanceOptimizer {
    if (!PerformanceOptimizer.instance) {
      PerformanceOptimizer.instance = new PerformanceOptimizer()
    }
    return PerformanceOptimizer.instance
  }
  
  // Optimize large strings
  optimizeString(str: string, maxLength: number = 1000): string {
    if (str.length <= maxLength) return str
    
    const buffer = Buffer.from(str, 'utf8')
    const optimized = buffer.toString('utf8', 0, maxLength)
    
    return optimized + '...'
  }
  
  // Cache optimization
  setCache(key: string, value: any): void {
    this.cache.set(key, value)
  }
  
  getCache(key: string): any {
    return this.cache.get(key)
  }
  
  clearCache(): void {
    this.cache.clear()
  }
  
  // Memory optimization
  optimizeMemory(): void {
    if (typeof window !== 'undefined') {
      if (window.gc) {
        window.gc()
      }
      
      const unusedListeners = document.querySelectorAll('[data-unused]')
      unusedListeners.forEach(element => {
        element.remove()
      })
    }
  }
  
  // Bundle optimization
  optimizeBundle(): void {
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
  }
  
  // Image optimization
  optimizeImage(src: string, width: number = 800, quality: number = 75): string {
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
  }
  
  // Debounce for performance
  debounce<T extends (...args: any[]) => any>(
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
  throttle<T extends (...args: any[]) => any>(
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
}

// Export singleton instance
export const performanceOptimizer = PerformanceOptimizer.getInstance()