import { BaseAPIClient, RequestConfig } from './base-client';
import { CoreResponseSchema } from '../types/evaluation';


export class CoreClient extends BaseAPIClient {
  private apiKey: string;

  constructor(apiKey: string, config: RequestConfig) {
    super('https://api.core.ac.uk/v3', 'CORE', {
      ...config,
      headers: {
        ...config.headers,
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    this.apiKey = apiKey;
  }

  async searchWorks(query: string, limit: number = 50): Promise<any> {
    const sanitizedQuery = this.sanitizeQuery(query);
    const params = this.buildQueryString({
      q: sanitizedQuery,
      limit: Math.min(limit, 100), // CORE max is 100
      offset: 0,
    });

    const response = await this.makeRequest(`/search/works?${params}`);
    return CoreResponseSchema.parse(response);
  }
}
