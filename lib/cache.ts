// Simple in-memory cache with TTL
interface CacheItem<T> {
  data: T;
  expiresAt: number;
}

class SimpleCache {
  private cache = new Map<string, CacheItem<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes in milliseconds

  set<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl || this.defaultTTL);
    this.cache.set(key, { data, expiresAt });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Generate cache key from request parameters
  generateKey(prefix: string, params: Record<string, any>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .reduce((result, key) => {
        result[key] = params[key];
        return result;
      }, {} as Record<string, any>);
    
    return `${prefix}:${JSON.stringify(sortedParams)}`;
  }

  // Get cache stats
  getStats() {
    const now = Date.now();
    const total = this.cache.size;
    const expired = Array.from(this.cache.values()).filter(item => now > item.expiresAt).length;
    
    return {
      total,
      active: total - expired,
      expired
    };
  }

  // Clean up expired entries
  cleanup(): number {
    const now = Date.now();
    let removed = 0;
    
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
        removed++;
      }
    }
    
    return removed;
  }
}

// Export singleton instance
export const apiCache = new SimpleCache();

// Utility function to create cache key for company requests
export function createCompanyCacheKey(request: Record<string, any>): string {
  return apiCache.generateKey('companies', request);
} 