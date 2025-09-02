import { BaseAPIClient, RequestConfig } from './base-client';
import { NIHResponseSchema } from '../types/evaluation';

/**
 * NIH RePORTER API Client
 * 
 * US research projects database that accepts POST search by text and fiscal years.
 * Returns project_title, abstract_text, funding_amount, and fiscal_year.
 * Useful for assessing grant potential in health and biomedical research.
 */
export class NIHClient extends BaseAPIClient {
  constructor(config: RequestConfig) {
    super('https://api.reporter.nih.gov/v2', 'NIH', config);
  }

  async searchProjects(query: string, fiscalYears: number[] = [2023, 2024, 2025]): Promise<any> {
    const sanitizedQuery = this.sanitizeQuery(query);
    
    const requestBody = {
      criteria: {
        advanced_text_search: {
          operator: 'and',
          search_field: 'projecttitle',
          search_text: sanitizedQuery,
        },
        fiscal_years: fiscalYears,
      },
      include_fields: [
        'ProjectTitle',
        'AbstractText', 
        'AwardAmount',
        'FiscalYear',
      ],
      offset: 0,
      limit: 50,
    };

    const response = await this.makeRequest('/projects/search', {
      method: 'POST',
      body: JSON.stringify(requestBody),
    });

    return NIHResponseSchema.parse(response);
  }
}
