// Performance utilities for optimizing component rendering and data operations

// Debounce function for expensive operations
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Throttle function for limiting frequent calls
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Batch array operations to prevent blocking UI
export async function batchProcess<T, R>(
  items: T[],
  processor: (item: T) => R | Promise<R>,
  batchSize: number = 10
): Promise<R[]> {
  const results: R[] = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processor));
    results.push(...batchResults);
    
    // Yield control to prevent blocking
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return results;
}

// Intersection Observer for lazy loading
export function createIntersectionObserver(
  callback: (entries: IntersectionObserverEntry[]) => void,
  options?: IntersectionObserverInit
): IntersectionObserver {
  return new IntersectionObserver(callback, {
    root: null,
    rootMargin: '50px',
    threshold: 0.1,
    ...options
  });
}

// Memoization utility with TTL
export function memoizeWithTTL<T extends (...args: any[]) => any>(
  fn: T,
  ttl: number = 300000 // 5 minutes default
): T {
  const cache = new Map<string, { result: ReturnType<T>; timestamp: number }>();
  
  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.result;
    }
    
    const result = fn(...args);
    cache.set(key, { result, timestamp: Date.now() });
    
    // Cleanup old entries periodically
    if (cache.size > 100) {
      const now = Date.now();
      for (const [k, v] of cache.entries()) {
        if (now - v.timestamp > ttl) {
          cache.delete(k);
        }
      }
    }
    
    return result;
  }) as T;
}

// Virtual scrolling utility
export interface VirtualScrollOptions {
  itemHeight: number;
  containerHeight: number;
  overscan?: number;
}

export function calculateVirtualScrollRange(
  scrollTop: number,
  totalItems: number,
  options: VirtualScrollOptions
): { startIndex: number; endIndex: number; offsetY: number } {
  const { itemHeight, containerHeight, overscan = 5 } = options;
  
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / itemHeight);
  const endIndex = Math.min(totalItems - 1, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * itemHeight;
  
  return { startIndex, endIndex, offsetY };
}

// Performance monitoring
export class PerformanceMonitor {
  private static measurements = new Map<string, number[]>();
  
  static start(label: string): () => void {
    const startTime = performance.now();
    
    return () => {
      const duration = performance.now() - startTime;
      
      if (!this.measurements.has(label)) {
        this.measurements.set(label, []);
      }
      
      const measurements = this.measurements.get(label)!;
      measurements.push(duration);
      
      // Keep only last 50 measurements
      if (measurements.length > 50) {
        measurements.shift();
      }
      
      // Log slow operations
      if (duration > 100) {
        console.warn(`Slow operation detected: ${label} took ${duration.toFixed(2)}ms`);
      }
    };
  }
  
  static getStats(label: string): { avg: number; max: number; min: number; count: number } | null {
    const measurements = this.measurements.get(label);
    if (!measurements || measurements.length === 0) return null;
    
    const avg = measurements.reduce((sum, val) => sum + val, 0) / measurements.length;
    const max = Math.max(...measurements);
    const min = Math.min(...measurements);
    
    return { avg, max, min, count: measurements.length };
  }
  
  static getAllStats(): Record<string, ReturnType<typeof PerformanceMonitor.getStats>> {
    const stats: Record<string, any> = {};
    for (const [label] of this.measurements) {
      stats[label] = this.getStats(label);
    }
    return stats;
  }
}

// Image loading optimization
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

export function preloadImages(srcs: string[], batchSize: number = 3): Promise<void[]> {
  return batchProcess(srcs, preloadImage, batchSize);
}
