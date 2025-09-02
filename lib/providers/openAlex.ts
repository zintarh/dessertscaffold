import { BaseAPIClient, RequestConfig } from './base-client';
import { OpenAlexResponseSchema } from '../types/evaluation';

/**
 * OpenAlex API Client
 * 
 * OpenAlex is a global scholarly index of works that supports searching titles/abstracts.
 * Returns title, abstract, publication_year, citation_count, concepts, and IDs (including DOI).
 * Useful for volume analysis, trends, citations, and concept mapping.
 */
export class OpenAlexClient extends BaseAPIClient {
  constructor(config: RequestConfig) {
    super('https://api.openalex.org', 'OpenAlex', config);
  }

  async searchWorks(query: string, limit: number = 50): Promise<any> {
    const sanitizedQuery = this.sanitizeQuery(query);
    const params = this.buildQueryString({
      filter: `title.search:${sanitizedQuery}`,
      per_page: Math.min(limit, 200), // OpenAlex max is 200
      select: 'title,abstract,publication_year,cited_by_count,concepts,ids',
      sort: 'cited_by_count:desc',
    });

    const response = await this.makeRequest(`/works?${params}`);
    return OpenAlexResponseSchema.parse(response);
  }
}
