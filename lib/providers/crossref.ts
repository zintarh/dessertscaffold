import { BaseAPIClient, RequestConfig } from './base-client';
import { CrossrefResponseSchema } from '../types/evaluation';

/**
 * Crossref API Client
 * 
 * Authoritative DOI and metadata registry that returns title, DOI, journal, subject, and publishedDate.
 * Useful for deduplication and publisher/subject normalization.
 */
export class CrossrefClient extends BaseAPIClient {
  constructor(config: RequestConfig) {
    super('https://api.crossref.org', 'Crossref', config);
  }

  async searchWorks(query: string, limit: number = 50): Promise<any> {
    const sanitizedQuery = this.sanitizeQuery(query);
    const params = this.buildQueryString({
      query: sanitizedQuery,
      rows: Math.min(limit, 1000), // Crossref max is 1000
      sort: 'score',
      order: 'desc',
    });

    const response = await this.makeRequest(`/works?${params}`);
    return CrossrefResponseSchema.parse(response);
  }
}
