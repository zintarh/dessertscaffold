import { BaseAPIClient, RequestConfig } from './base-client';
import { CordisResponseSchema } from '../types/evaluation';

/**
 * CORDIS API Client
 * 
 * EU Horizon programs and calls database that returns call_title, summary, and deadline_date.
 * Useful for identifying active EU funding calls and opportunities.
 */
export class CordisClient extends BaseAPIClient {
  constructor(config: RequestConfig) {
    super('https://cordis.europa.eu/api', 'CORDIS', config);
  }

  async searchCalls(query: string, limit: number = 50): Promise<any> {
    const sanitizedQuery = this.sanitizeQuery(query);
    const params = this.buildQueryString({
      q: sanitizedQuery,
      format: 'json',
      pageSize: Math.min(limit, 100),
      page: 1,
    });

    const response = await this.makeRequest(`/calls/search?${params}`);
    return CordisResponseSchema.parse(response);
  }
}
