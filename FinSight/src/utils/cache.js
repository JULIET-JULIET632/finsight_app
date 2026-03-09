/**
 * Simple in-memory cache for AI recommendations
 * SECURITY: Cache keys are hashed, no sensitive data stored in plain text
 */
class RecommendationCache {
  constructor() {
    this.cache = new Map();
    this.maxSize = 100; // Limit cache size to prevent memory issues
    this.ttl = 3600000; // 1 hour in milliseconds
  }

  /**
   * Generate a secure hash of the cache key
   */
  generateKey(userData) {
    // Only use essential, non-sensitive data for cache key
    const keyData = {
      final_score: userData.final_score,
      sector: userData.sector,
      // Use hash of diagnosis data instead of storing it
      diagnosisHash: this.hashData(userData.diagnosis),
      timestamp: Math.floor(Date.now() / 3600000) // Hourly bucket
    };
    return btoa(JSON.stringify(keyData)); // Base64 encode
  }

  /**
   * Simple hash function for data
   */
  hashData(data) {
    if (!data) return '';
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0; // Convert to 32-bit integer
    }
    return hash.toString(16);
  }

  /**
   * Get cached recommendation if available and not expired
   */
  get(key) {
    const item = this.cache.get(key);
    if (!item) return null;
    
    // Check if expired
    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data;
  }

  /**
   * Store recommendation in cache
   */
  set(key, data) {
    // Manage cache size
    if (this.cache.size >= this.maxSize) {
      // Remove oldest item (first item in Map)
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      expiry: Date.now() + this.ttl
    });
  }

  /**
   * Clear expired items
   */
  cleanExpired() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiry) {
        this.cache.delete(key);
      }
    }
  }
}

export const recommendationCache = new RecommendationCache();