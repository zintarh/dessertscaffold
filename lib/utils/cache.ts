import { LRUCache } from 'lru-cache';
import { EvaluationResponse } from '../types/evaluation';

/**
 * Caching layer with LRU cache for research topic evaluations
 * Provides in-memory caching with TTL and easy Redis swap capability
 */

export interface CacheConfig {
  maxSize: number;
  ttl: number; // Time to live in seconds
}

export interface CacheAdapter {
  get(key: string): Promise<EvaluationResponse | null>;
  set(key: string, value: EvaluationResponse, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
  has(key: string): Promise<boolean>;
}

/**
 * In-memory LRU cache implementation
 */
export class MemoryCache implements CacheAdapter {
  private cache: LRUCache<string, EvaluationResponse>;
  private defaultTTL: number;

  constructor(config: CacheConfig) {
    this.defaultTTL = config.ttl * 1000; // Convert to milliseconds
    this.cache = new LRUCache({
      max: config.maxSize,
      ttl: this.defaultTTL,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
    });
  }

  async get(key: string): Promise<EvaluationResponse | null> {
    const value = this.cache.get(key);
    return value || null;
  }

  async set(key: string, value: EvaluationResponse, ttl?: number): Promise<void> {
    const cacheTTL = ttl ? ttl * 1000 : this.defaultTTL;
    this.cache.set(key, value, { ttl: cacheTTL });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }

  async has(key: string): Promise<boolean> {
    return this.cache.has(key);
  }

  // Additional methods for monitoring
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      calculatedSize: this.cache.calculatedSize,
    };
  }
}

/**
 * Redis cache implementation (for future use)
 */
export class RedisCache implements CacheAdapter {
  private client: any; // Redis client
  private defaultTTL: number;

  constructor(redisClient: any, config: CacheConfig) {
    this.client = redisClient;
    this.defaultTTL = config.ttl;
  }

  async get(key: string): Promise<EvaluationResponse | null> {
    try {
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Redis get error:', error);
      return null;
    }
  }

  async set(key: string, value: EvaluationResponse, ttl?: number): Promise<void> {
    try {
      const cacheTTL = ttl || this.defaultTTL;
      await this.client.setex(key, cacheTTL, JSON.stringify(value));
    } catch (error) {
      console.error('Redis set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.client.del(key);
    } catch (error) {
      console.error('Redis delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      await this.client.flushdb();
    } catch (error) {
      console.error('Redis clear error:', error);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      const exists = await this.client.exists(key);
      return exists === 1;
    } catch (error) {
      console.error('Redis has error:', error);
      return false;
    }
  }
}

/**
 * Cache key generator for consistent key creation
 */
export class CacheKeyGenerator {
  static generateEvaluationKey(topic: string, keywords?: string[]): string {
    const normalizedTopic = topic.toLowerCase().trim().replace(/\s+/g, '_');
    const normalizedKeywords = keywords 
      ? keywords.map(k => k.toLowerCase().trim()).sort().join(',')
      : '';
    
    const keyString = normalizedKeywords 
      ? `${normalizedTopic}:${normalizedKeywords}`
      : normalizedTopic;
    
    // Create a hash for consistent key length
    return `eval:${this.simpleHash(keyString)}`;
  }

  private static simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }
}

/**
 * Cache manager with metrics and monitoring
 */
export class CacheManager {
  private adapter: CacheAdapter;
  private metrics: {
    hits: number;
    misses: number;
    sets: number;
    errors: number;
  };

  constructor(adapter: CacheAdapter) {
    this.adapter = adapter;
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      errors: 0,
    };
  }

  async get(key: string): Promise<EvaluationResponse | null> {
    try {
      const value = await this.adapter.get(key);
      if (value) {
        this.metrics.hits++;
        return value;
      } else {
        this.metrics.misses++;
        return null;
      }
    } catch (error) {
      this.metrics.errors++;
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: EvaluationResponse, ttl?: number): Promise<void> {
    try {
      await this.adapter.set(key, value, ttl);
      this.metrics.sets++;
    } catch (error) {
      this.metrics.errors++;
      console.error('Cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await this.adapter.delete(key);
    } catch (error) {
      this.metrics.errors++;
      console.error('Cache delete error:', error);
    }
  }

  async has(key: string): Promise<boolean> {
    try {
      return await this.adapter.has(key);
    } catch (error) {
      this.metrics.errors++;
      console.error('Cache has error:', error);
      return false;
    }
  }

  getMetrics() {
    const total = this.metrics.hits + this.metrics.misses;
    return {
      ...this.metrics,
      hitRate: total > 0 ? this.metrics.hits / total : 0,
      total,
    };
  }

  resetMetrics() {
    this.metrics = {
      hits: 0,
      misses: 0,
      sets: 0,
      errors: 0,
    };
  }
}

/**
 * Factory function to create cache manager with configuration
 */
export function createCacheManager(config: CacheConfig): CacheManager {
  const adapter = new MemoryCache(config);
  return new CacheManager(adapter);
}

/**
 * Singleton cache instance for the application
 */
let cacheInstance: CacheManager | null = null;

export function getCacheInstance(): CacheManager {
  if (!cacheInstance) {
    const config: CacheConfig = {
      maxSize: parseInt(process.env.CACHE_MAX_SIZE || '100'),
      ttl: parseInt(process.env.CACHE_TTL || '21600'), // 6 hours default
    };
    cacheInstance = createCacheManager(config);
  }
  return cacheInstance;
}
