import { BaseAPIClient, RequestConfig } from './base-client';
import { GrantsGovResponseSchema } from '../types/evaluation';

/**
 * Grants.gov API Client
 * 
 * US government opportunities database that returns opportunityTitle, opportunityNumber, 
 * closeDate, and description. Useful for identifying open federal funding calls outside health research.
 */
export class GrantsGovClient extends BaseAPIClient {
  constructor(config: RequestConfig) {
    super('https://www.grants.gov/grantsws/rest', 'GrantsGov', config);
  }

  async searchOpportunities(query: string, limit: number = 50): Promise<any> {
    const sanitizedQuery = this.sanitizeQuery(query);
    const params = this.buildQueryString({
      keyword: sanitizedQuery,
      rows: Math.min(limit, 1000),
      sortBy: 'relevance',
      sortOrder: 'DESC',
    });

    const response = await this.makeRequest(`/opportunities/search?${params}`);
    return GrantsGovResponseSchema.parse(response);
  }
}
