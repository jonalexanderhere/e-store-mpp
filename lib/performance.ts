// Performance optimization utilities
export const optimizeString = (str: string, maxLength: number = 1000): string => {
  if (str.length <= maxLength) return str
  return str.substring(0, maxLength) + '...'
}

// Buffer optimization for large strings
export const createOptimizedBuffer = (data: string): Buffer => {
  return Buffer.from(data, 'utf8')
}

// Memory optimization
export const optimizeMemory = () => {
  if (typeof window !== 'undefined') {
    // Client-side memory optimization
    if (window.gc) {
      window.gc()
    }
  }
}

// Debounce function for performance
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

// Throttle function for performance
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
