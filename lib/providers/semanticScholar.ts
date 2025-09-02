import { BaseAPIClient, RequestConfig } from './base-client';
import { SemanticScholarResponseSchema } from '../types/evaluation';

/**
 * Semantic Scholar API Client
 * 
 * AI-powered scholarly graph that provides paper search with title, abstract, citations,
 * and methods/fieldsOfStudy when available. Useful for methodology insights and citation context.
 */
export class SemanticScholarClient extends BaseAPIClient {
  constructor(config: RequestConfig) {
    super('https://api.semanticscholar.org/graph/v1', 'SemanticScholar', config);
  }

  async searchPapers(query: string, limit: number = 50): Promise<any> {
    const sanitizedQuery = this.sanitizeQuery(query);
    const params = this.buildQueryString({
      query: sanitizedQuery,
      limit: Math.min(limit, 100), // Semantic Scholar max is 100
      fields: 'title,abstract,year,citationCount,fieldsOfStudy,externalIds',
    });

    const response = await this.makeRequest(`/paper/search?${params}`);
    return SemanticScholarResponseSchema.parse(response);
  }
}
