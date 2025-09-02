import { Config } from '../types/evaluation';

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay?: number;
  jitter?: boolean;
}

export interface RequestConfig {
  timeout: number;
  retries: RetryConfig;
  headers?: Record<string, string>;
}

export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public provider?: string,
    public isRetryable: boolean = false
  ) {
    super(message);
    this.name = 'APIError';
  }
}

export class BaseAPIClient {
  protected config: RequestConfig;
  protected baseUrl: string;
  protected name: string;

  constructor(baseUrl: string, name: string, config: RequestConfig) {
    this.baseUrl = baseUrl;
    this.name = name;
    this.config = config;
  }

  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    customTimeout?: number
  ): Promise<T> {
    const controller = new AbortController();
    const timeout = customTimeout || this.config.timeout;
    
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
      const response = await this.retryRequest(
        () => fetch(`${this.baseUrl}${endpoint}`, {
          ...options,
          signal: controller.signal,
          headers: {
            'Content-Type': 'application/json',
            ...this.config.headers,
            ...options.headers,
          },
        }),
        this.config.retries
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const isRetryable = response.status >= 500 || response.status === 429;
        throw new APIError(
          `${this.name} API error: ${response.status} ${response.statusText}`,
          response.status,
          this.name,
          isRetryable
        );
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof APIError) {
        throw error;
      }
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new APIError(
          `${this.name} request timeout after ${timeout}ms`,
          undefined,
          this.name,
          true
        );
      }
      
      throw new APIError(
        `${this.name} request failed: ${error instanceof Error ? error.message : String(error)}`,
        undefined,
        this.name,
        false
      );
    }
  }

  private async retryRequest(
    requestFn: () => Promise<Response>,
    retryConfig: RetryConfig
  ): Promise<Response> {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= retryConfig.maxRetries; attempt++) {
      try {
        const response = await requestFn();
        
        // Don't retry on success or non-retryable errors
        if (response.ok || (response.status < 500 && response.status !== 429)) {
          return response;
        }
        
        // If this is the last attempt, return the response anyway
        if (attempt === retryConfig.maxRetries) {
          return response;
        }
        
        // Wait before retrying
        await this.delay(this.calculateDelay(attempt, retryConfig));
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));
        
        // Don't retry on non-retryable errors
        if (error instanceof APIError && !error.isRetryable) {
          throw error;
        }
        
        // If this is the last attempt, throw the error
        if (attempt === retryConfig.maxRetries) {
          throw error;
        }
        
        // Wait before retrying
        await this.delay(this.calculateDelay(attempt, retryConfig));
      }
    }
    
    throw lastError!;
  }

  private calculateDelay(attempt: number, config: RetryConfig): number {
    const exponentialDelay = config.baseDelay * Math.pow(2, attempt);
    const maxDelay = config.maxDelay || 30000;
    let delay = Math.min(exponentialDelay, maxDelay);
    
    // Add jitter to prevent thundering herd
    if (config.jitter !== false) {
      delay = delay * (0.5 + Math.random() * 0.5);
    }
    
    return delay;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, String(v)));
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    
    return searchParams.toString();
  }

  protected sanitizeQuery(query: string): string {
    return query
      .trim()
      .replace(/[^\w\s-]/g, ' ') // Remove special chars except hyphens
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, 500); // Limit length
  }
}
