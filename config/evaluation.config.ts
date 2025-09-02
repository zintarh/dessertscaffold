import { Config } from '@/lib/types/evaluation';

/**
 * Configuration for the research topic evaluation system
 * Loads settings from environment variables with sensible defaults
 */

export const evaluationConfig: Config = {
  timeouts: {
    default: parseInt(process.env.API_TIMEOUT || '8000'),
    openai: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
  },
  retries: {
    maxRetries: parseInt(process.env.MAX_RETRIES || '2'),
    baseDelay: parseInt(process.env.RETRY_BASE_DELAY || '1000'),
  },
  similarity: {
    threshold: parseFloat(process.env.SIMILARITY_THRESHOLD || '0.85'),
  },
  cache: {
    ttl: parseInt(process.env.CACHE_TTL || '21600'), // 6 hours
    maxSize: parseInt(process.env.CACHE_MAX_SIZE || '100'),
  },
  limits: {
    maxWorksPerProvider: parseInt(process.env.MAX_WORKS_PER_PROVIDER || '50'),
    maxTokensForLLM: parseInt(process.env.MAX_TOKENS_FOR_LLM || '8000'),
  },
};

/**
 * Validate required environment variables
 */
export function validateEnvironment(): string[] {
  const errors: string[] = [];
  
  if (!process.env.OPENAI_API_KEY) {
    errors.push('OPENAI_API_KEY is required');
  }
  
  // Validate numeric configurations
  const numericConfigs = [
    'API_TIMEOUT',
    'OPENAI_TIMEOUT', 
    'MAX_RETRIES',
    'RETRY_BASE_DELAY',
    'SIMILARITY_THRESHOLD',
    'CACHE_TTL',
    'CACHE_MAX_SIZE',
    'MAX_WORKS_PER_PROVIDER',
    'MAX_TOKENS_FOR_LLM'
  ];
  
  numericConfigs.forEach(config => {
    const value = process.env[config];
    if (value && isNaN(Number(value))) {
      errors.push(`${config} must be a valid number`);
    }
  });
  
  // Validate similarity threshold range
  const threshold = parseFloat(process.env.SIMILARITY_THRESHOLD || '0.85');
  if (threshold < 0 || threshold > 1) {
    errors.push('SIMILARITY_THRESHOLD must be between 0 and 1');
  }
  
  return errors;
}

/**
 * API provider configuration
 */
export const providerConfig = {
  openAlex: {
    baseUrl: 'https://api.openalex.org',
    requiresAuth: false,
  },
  semanticScholar: {
    baseUrl: 'https://api.semanticscholar.org/graph/v1',
    requiresAuth: false,
  },
  core: {
    baseUrl: 'https://api.core.ac.uk/v3',
    requiresAuth: true,
    apiKeyEnv: 'CORE_API_KEY',
  },
  crossref: {
    baseUrl: 'https://api.crossref.org',
    requiresAuth: false,
  },
  nih: {
    baseUrl: 'https://api.reporter.nih.gov/v2',
    requiresAuth: false,
  },
  cordis: {
    baseUrl: 'https://cordis.europa.eu/api',
    requiresAuth: false,
  },
  grantsGov: {
    baseUrl: 'https://www.grants.gov/grantsws/rest',
    requiresAuth: false,
  },
};

/**
 * Rate limiting configuration per provider
 */
export const rateLimits = {
  openAlex: {
    requestsPerSecond: 10,
    burstLimit: 50,
  },
  semanticScholar: {
    requestsPerSecond: 1,
    burstLimit: 10,
  },
  core: {
    requestsPerSecond: 2,
    burstLimit: 20,
  },
  crossref: {
    requestsPerSecond: 5,
    burstLimit: 25,
  },
  nih: {
    requestsPerSecond: 1,
    burstLimit: 5,
  },
  cordis: {
    requestsPerSecond: 2,
    burstLimit: 10,
  },
  grantsGov: {
    requestsPerSecond: 1,
    burstLimit: 5,
  },
};
