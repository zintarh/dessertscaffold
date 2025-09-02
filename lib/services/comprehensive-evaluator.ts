import { EvaluationRequest, Evaluation, AggregatedData, Work, Funding } from '../types/evaluation';
import { OpenAIEvaluator } from './openai-evaluator';

/**
 * Comprehensive Research Topic Evaluator
 * 
 * Implements the complete evaluation workflow:
 * 1. User Input (research topic + keywords)
 * 2. API Orchestration (literature + funding sources)
 * 3. Data Processing (cleaning, deduplication, aggregation)
 * 4. LLM Evaluation (six academic metrics)
 * 5. Structured Report Output
 */

export interface EvaluationMetrics {
  novelty: { score: number; justification: string };
  trends: { score: number; justification: string };
  methodological_complexity: { score: number; justification: string };
  research_gaps: { score: number; justification: string };
  grant_potential: { score: number; justification: string };
  literature_availability: { score: number; justification: string };
  overall_summary: string;
}

export interface APISource {
  name: string;
  baseUrl: string;
  apiKey?: string;
}

export interface LiteratureSource extends APISource {
  type: 'literature';
}

export interface FundingSource extends APISource {
  type: 'funding';
}

export class ComprehensiveEvaluator {
  private openaiEvaluator: OpenAIEvaluator;
  
  // Literature sources
  private literatureSources: LiteratureSource[] = [
    { name: 'OpenAlex', type: 'literature', baseUrl: 'https://api.openalex.org' },
    { name: 'Semantic Scholar', type: 'literature', baseUrl: 'https://api.semanticscholar.org' },
    { name: 'CORE', type: 'literature', baseUrl: 'https://api.core.ac.uk' },
    { name: 'CrossRef', type: 'literature', baseUrl: 'https://api.crossref.org' },
  ];
  
  // Funding sources
  private fundingSources: FundingSource[] = [
    { name: 'NIH Reporter', type: 'funding', baseUrl: 'https://reporter.nih.gov/api' },
    { name: 'Cordis', type: 'funding', baseUrl: 'https://cordis.europa.eu/api' },
    { name: 'Grants.gov', type: 'funding', baseUrl: 'https://www.grants.gov/api' },
  ];

  constructor(openaiApiKey: string) {
    this.openaiEvaluator = new OpenAIEvaluator(openaiApiKey);
  }

  /**
   * Main evaluation method
   */
  async evaluateResearchTopic(request: EvaluationRequest): Promise<Evaluation> {
    console.log('Starting comprehensive evaluation for:', request.research_topic);
    
    try {
      // Step 1: API Orchestration - Query literature and funding sources
      const [literatureData, fundingData] = await Promise.all([
        this.queryLiteratureSources(request.research_topic, request.additional_keywords),
        this.queryFundingSources(request.research_topic, request.additional_keywords)
      ]);

      console.log(`Retrieved ${literatureData.length} literature items and ${fundingData.length} funding opportunities`);

      // Step 2: Data Processing
      const processedData = this.processAndCleanData(literatureData, fundingData);
      
      // Step 3: Data Aggregation
      const aggregatedData = this.aggregateData(processedData);
      
      // Step 4: LLM Evaluation
      const evaluation = await this.performLLMEvaluation(request.research_topic, aggregatedData);
      
      console.log('Comprehensive evaluation completed successfully');
      return evaluation;
      
    } catch (error: any) {
      console.error('Evaluation failed:', error);
      throw new Error(`Research topic evaluation failed: ${error.message}`);
    }
  }

  /**
   * Query literature sources in parallel
   */
  private async queryLiteratureSources(topic: string, keywords?: string[]): Promise<any[]> {
    const query = this.buildLiteratureQuery(topic, keywords);
    const promises = this.literatureSources.map(source => 
      this.queryLiteratureSource(source, query)
    );
    
    const results = await Promise.allSettled(promises);
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<any[]> => result.status === 'fulfilled')
      .map(result => result.value)
      .flat();
    
    return successfulResults;
  }

  /**
   * Query funding sources in parallel
   */
  private async queryFundingSources(topic: string, keywords?: string[]): Promise<any[]> {
    const query = this.buildFundingQuery(topic, keywords);
    const promises = this.fundingSources.map(source => 
      this.queryFundingSource(source, query)
    );
    
    const results = await Promise.allSettled(promises);
    const successfulResults = results
      .filter((result): result is PromiseFulfilledResult<any[]> => result.status === 'fulfilled')
      .map(result => result.value)
      .flat();
    
    return successfulResults;
  }

  /**
   * Build literature search query
   */
  private buildLiteratureQuery(topic: string, keywords?: string[]): string {
    const terms = [topic, ...(keywords || [])].filter(Boolean);
    return terms.join(' AND ');
  }

  /**
   * Build funding search query
   */
  private buildFundingQuery(topic: string, keywords?: string[]): string {
    const terms = [topic, ...(keywords || [])].filter(Boolean);
    return terms.join(' ');
  }

  /**
   * Query individual literature source
   */
  private async queryLiteratureSource(source: LiteratureSource, query: string): Promise<any[]> {
    try {
      // Mock implementation - in real app, this would make actual API calls
      console.log(`Querying ${source.name} for: ${query}`);
      
      // Simulate API response with realistic data
      return this.generateMockLiteratureData(query, source.name);
      
    } catch (error) {
      console.warn(`Failed to query ${source.name}:`, error);
      return [];
    }
  }

  /**
   * Query individual funding source
   */
  private async queryFundingSource(source: FundingSource, query: string): Promise<any[]> {
    try {
      // Mock implementation - in real app, this would make actual API calls
      console.log(`Querying ${source.name} for: ${query}`);
      
      // Simulate API response with realistic data
      return this.generateMockFundingData(query, source.name);
      
    } catch (error) {
      console.warn(`Failed to query ${source.name}:`, error);
      return [];
    }
  }

  /**
   * Process and clean raw data
   */
  private processAndCleanData(literatureData: any[], fundingData: any[]): { works: Work[], funding: Funding[] } {
    // Clean and standardize literature data
    const works = literatureData
      .map(item => this.standardizeWork(item))
      .filter(Boolean) as Work[];

    // Clean and standardize funding data
    const funding = fundingData
      .map(item => this.standardizeFunding(item))
      .filter(Boolean) as Funding[];

    // Remove duplicates by DOI/title similarity
    const deduplicatedWorks = this.deduplicateWorks(works);
    const deduplicatedFunding = this.deduplicateFunding(funding);

    return {
      works: deduplicatedWorks,
      funding: deduplicatedFunding
    };
  }

  /**
   * Standardize work data from various sources
   */
  private standardizeWork(item: any): Work | null {
    try {
      return {
        title: this.cleanText(item.title || ''),
        abstract: this.cleanText(item.abstract || ''),
        year: this.extractYear(item.year || item.publication_year || item.yearPublished),
        doi: item.doi || item.DOI || item.ids?.doi,
        concepts: this.extractConcepts(item.concepts || item.fieldsOfStudy || item.subject),
        citations: item.citations || item.cited_by_count || item.citationCount || 0,
        methods: this.extractMethods(item.methods || item.methodology),
        fullTextUrl: item.fullTextUrl || item.downloadUrl || item.url,
      };
    } catch (error) {
      console.warn('Failed to standardize work:', error);
      return null;
    }
  }

  /**
   * Standardize funding data from various sources
   */
  private standardizeFunding(item: any): Funding | null {
    try {
      return {
        source: item.source || item.agency || 'Unknown',
        title: this.cleanText(item.title || item.project_title || item.opportunityTitle),
        abstractOrDesc: this.cleanText(item.abstractOrDesc || item.abstract_text || item.description),
        amount: this.extractAmount(item.amount || item.award_amount),
        fiscalYear: item.fiscalYear || item.fiscal_year,
        deadline: item.deadline || item.closeDate,
      };
    } catch (error) {
      console.warn('Failed to standardize funding:', error);
      return null;
    }
  }

  /**
   * Clean text by removing HTML tags and normalizing whitespace
   */
  private cleanText(text: string): string {
    if (!text) return '';
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Extract publication year from various formats
   */
  private extractYear(yearData: any): number {
    if (typeof yearData === 'number') return yearData;
    if (typeof yearData === 'string') {
      const year = parseInt(yearData);
      if (!isNaN(year) && year >= 1900 && year <= 2030) return year;
    }
    if (Array.isArray(yearData) && yearData.length > 0) {
      const year = parseInt(yearData[0].toString());
      if (!isNaN(year) && year >= 1900 && year <= 2030) return year;
    }
    return new Date().getFullYear(); // Default to current year
  }

  /**
   * Extract concepts from various formats
   */
  private extractConcepts(concepts: any): string[] {
    if (!concepts) return [];
    if (Array.isArray(concepts)) {
      return concepts
        .map(concept => typeof concept === 'string' ? concept : concept.display_name || concept.name)
        .filter(Boolean);
    }
    return [];
  }

  /**
   * Extract methods from various formats
   */
  private extractMethods(methods: any): string[] | undefined {
    if (!methods) return undefined;
    if (Array.isArray(methods)) {
      return methods.filter(method => typeof method === 'string');
    }
    return undefined;
  }

  /**
   * Extract amount from various formats
   */
  private extractAmount(amount: any): number | undefined {
    if (typeof amount === 'number') return amount;
    if (typeof amount === 'string') {
      const parsed = parseFloat(amount.replace(/[^\d.-]/g, ''));
      return isNaN(parsed) ? undefined : parsed;
    }
    return undefined;
  }

  /**
   * Deduplicate works by DOI or title similarity
   */
  private deduplicateWorks(works: Work[]): Work[] {
    const seen = new Set<string>();
    const unique: Work[] = [];
    
    for (const work of works) {
      const key = work.doi || work.title.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(work);
      }
    }
    
    return unique;
  }

  /**
   * Deduplicate funding by title similarity
   */
  private deduplicateFunding(funding: Funding[]): Funding[] {
    const seen = new Set<string>();
    const unique: Funding[] = [];
    
    for (const item of funding) {
      const key = item.title.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(item);
      }
    }
    
    return unique;
  }

  /**
   * Aggregate processed data for analysis
   */
  private aggregateData(processedData: { works: Work[], funding: Funding[] }): AggregatedData {
    const { works, funding } = processedData;
    
    // Calculate trends (publications per year)
    const trends: Record<string, number> = {};
    works.forEach(work => {
      const year = work.year.toString();
      trends[year] = (trends[year] || 0) + 1;
    });

    // Calculate methods distribution
    const methods: Record<string, number> = {};
    works.forEach(work => {
      if (work.methods) {
        work.methods.forEach(method => {
          methods[method] = (methods[method] || 0) + 1;
        });
      }
    });

    // Calculate open access ratio
    const openAccessCount = works.filter(work => work.fullTextUrl).length;
    const openAccessRatio = works.length > 0 ? openAccessCount / works.length : 0;

    // Calculate average citations
    const totalCitations = works.reduce((sum, work) => sum + work.citations, 0);
    const avgCitations = works.length > 0 ? totalCitations / works.length : 0;

    // Extract top concepts
    const conceptCounts: Record<string, number> = {};
    works.forEach(work => {
      work.concepts.forEach(concept => {
        conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
      });
    });
    
    const topConcepts = Object.entries(conceptCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    return {
      works,
      funding,
      trends,
      methods,
      openAccessRatio,
      totalWorks: works.length,
      totalFunding: funding.length,
      activeCalls: funding.filter(f => f.deadline && new Date(f.deadline) > new Date()).length,
      avgCitations,
      topConcepts,
    };
  }

  /**
   * Perform LLM evaluation using the aggregated data
   */
  private async performLLMEvaluation(topic: string, aggregatedData: AggregatedData): Promise<Evaluation> {
    try {
      return await this.openaiEvaluator.evaluateTopic(topic, aggregatedData);
    } catch (error) {
      console.error('LLM evaluation failed:', error);
      // Return a default evaluation if LLM fails
      return this.generateDefaultEvaluation(topic, aggregatedData);
    }
  }

  /**
   * Generate default evaluation when LLM fails
   */
  private generateDefaultEvaluation(topic: string, data: AggregatedData): Evaluation {
    return {
      novelty: {
        score: Math.min(10, Math.max(1, Math.floor(data.totalWorks / 10))),
        justification: `Based on ${data.totalWorks} existing publications, this topic shows ${data.totalWorks > 50 ? 'moderate' : 'high'} novelty potential.`
      },
      trends: {
        score: Math.min(10, Math.max(1, Math.floor(Object.keys(data.trends).length / 2))),
        justification: `Publication trends span ${Object.keys(data.trends).length} years, indicating ${Object.keys(data.trends).length > 5 ? 'sustained' : 'emerging'} interest.`
      },
      methodological_complexity: {
        score: Math.min(10, Math.max(1, Math.floor(Object.keys(data.methods).length / 2))),
        justification: `Diverse methodologies (${Object.keys(data.methods).length} identified) suggest ${Object.keys(data.methods).length > 3 ? 'complex' : 'moderate'} research requirements.`
      },
      research_gaps: {
        score: Math.min(10, Math.max(1, Math.floor(data.totalWorks / 20))),
        justification: `With ${data.totalWorks} publications, there are likely unexplored areas and methodological gaps to investigate.`
      },
      grant_potential: {
        score: Math.min(10, Math.max(1, Math.floor(data.totalFunding / 5))),
        justification: `Found ${data.totalFunding} funding opportunities, indicating ${data.totalFunding > 10 ? 'strong' : 'moderate'} grant potential.`
      },
      literature_availability: {
        score: Math.min(10, Math.max(1, Math.floor(data.openAccessRatio * 10))),
        justification: `${Math.round(data.openAccessRatio * 100)}% of publications are open access, providing ${data.openAccessRatio > 0.5 ? 'good' : 'limited'} literature availability.`
      },
      overall_summary: `The research topic "${topic}" shows promise with ${data.totalWorks} publications and ${data.totalFunding} funding opportunities. The field demonstrates ${data.totalWorks > 50 ? 'maturity' : 'emerging potential'} with diverse methodologies and ${Math.round(data.openAccessRatio * 100)}% open access literature. This suggests a viable research area suitable for dissertation-level investigation.`
    };
  }

  /**
   * Generate mock literature data for demonstration
   */
  private generateMockLiteratureData(query: string, source: string): any[] {
    const mockData = [];
    const baseYear = new Date().getFullYear();
    
    for (let i = 0; i < Math.floor(Math.random() * 20) + 10; i++) {
      mockData.push({
        title: `Research on ${query} - Study ${i + 1}`,
        abstract: `This study investigates ${query} using advanced methodologies and provides insights into current research trends.`,
        year: baseYear - Math.floor(Math.random() * 10),
        doi: `10.1000/mock.${source.toLowerCase()}.${i}`,
        concepts: [`${query}`, 'Research Methodology', 'Data Analysis'],
        citations: Math.floor(Math.random() * 100),
        methods: ['Quantitative Analysis', 'Literature Review'],
        fullTextUrl: Math.random() > 0.3 ? `https://example.com/paper${i}` : undefined,
      });
    }
    
    return mockData;
  }

  /**
   * Generate mock funding data for demonstration
   */
  private generateMockFundingData(query: string, source: string): any[] {
    const mockData = [];
    
    for (let i = 0; i < Math.floor(Math.random() * 8) + 3; i++) {
      mockData.push({
        source: source,
        title: `${query} Research Grant - Opportunity ${i + 1}`,
        abstractOrDesc: `Funding opportunity for research projects related to ${query}.`,
        amount: Math.floor(Math.random() * 500000) + 50000,
        fiscalYear: new Date().getFullYear() + Math.floor(Math.random() * 3),
        deadline: new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      });
    }
    
    return mockData;
  }
}
