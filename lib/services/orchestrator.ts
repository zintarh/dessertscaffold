import { 
  EvaluationRequest, 
  EvaluationResponse, 
  Work, 
  Funding, 
  AggregatedData,
  Config 
} from '../types/evaluation';
import { OpenAlexClient } from '../providers/openAlex';
import { SemanticScholarClient } from '../providers/semanticScholar';
import { CoreClient } from '../providers/core';
import { CrossrefClient } from '../providers/crossref';
import { NIHClient } from '../providers/nih';
import { CordisClient } from '../providers/cordis';
import { GrantsGovClient } from '../providers/grantsGov';
import { DataCleaner, DataDeduplicator } from '../utils/data-cleaning';
import { DataAggregator } from '../utils/aggregation';
import { OpenAIEvaluator } from './openai-evaluator';
import { ReportGenerator } from '../utils/report-generator';
import { CacheManager, CacheKeyGenerator } from '../utils/cache';

/**
 * Main orchestrator for research topic evaluation
 * Coordinates API calls, data processing, LLM evaluation, and report generation
 */

export interface OrchestrationMetrics {
  requestId: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  providerTimings: Record<string, number>;
  providerErrors: Record<string, string>;
  cacheHit: boolean;
  totalWorks: number;
  totalFunding: number;
}

export class ResearchTopicOrchestrator {
  private config: Config;
  private cache: CacheManager;
  private reportGenerator: ReportGenerator;
  private openaiEvaluator: OpenAIEvaluator;

  // API clients
  private openAlex: OpenAlexClient;
  private semanticScholar: SemanticScholarClient;
  private core: CoreClient;
  private crossref: CrossrefClient;
  private nih: NIHClient;
  private cordis: CordisClient;
  private grantsGov: GrantsGovClient;

  constructor(
    config: Config,
    cache: CacheManager,
    reportGenerator: ReportGenerator,
    openaiEvaluator: OpenAIEvaluator
  ) {
    this.config = config;
    this.cache = cache;
    this.reportGenerator = reportGenerator;
    this.openaiEvaluator = openaiEvaluator;

    // Initialize API clients with consistent configuration
    const requestConfig = {
      timeout: config.timeouts.default,
      retries: {
        maxRetries: config.retries.maxRetries,
        baseDelay: config.retries.baseDelay,
      },
    };

    this.openAlex = new OpenAlexClient(requestConfig);
    this.semanticScholar = new SemanticScholarClient(requestConfig);
    this.core = new CoreClient(process.env.CORE_API_KEY!, requestConfig);
    this.crossref = new CrossrefClient(requestConfig);
    this.nih = new NIHClient(requestConfig);
    this.cordis = new CordisClient(requestConfig);
    this.grantsGov = new GrantsGovClient(requestConfig);
  }

  /**
   * Main orchestration method
   */
  async evaluateTopic(request: EvaluationRequest): Promise<EvaluationResponse> {
    const requestId = this.generateRequestId();
    const metrics: OrchestrationMetrics = {
      requestId,
      startTime: Date.now(),
      providerTimings: {},
      providerErrors: {},
      cacheHit: false,
      totalWorks: 0,
      totalFunding: 0,
    };

    try {
      // Check cache first
      const cacheKey = CacheKeyGenerator.generateEvaluationKey(
        request.research_topic,
        request.additional_keywords
      );

      const cachedResult = await this.cache.get(cacheKey);
      if (cachedResult) {
        metrics.cacheHit = true;
        metrics.endTime = Date.now();
        metrics.duration = metrics.endTime - metrics.startTime;
        
        this.logMetrics(metrics);
        return cachedResult;
      }

      // Build search query
      const query = this.buildSearchQuery(request.research_topic, request.additional_keywords);

      // Execute parallel API calls
      const rawData = await this.executeParallelAPICalls(query, metrics);

      // Process and clean data
      const { works, funding } = await this.processRawData(rawData, metrics);

      // Aggregate data for analysis
      const aggregatedData = DataAggregator.aggregate(works, funding);
      metrics.totalWorks = works.length;
      metrics.totalFunding = funding.length;

      // LLM evaluation
      const evaluation = await this.performLLMEvaluation(
        request.research_topic,
        aggregatedData,
        metrics
      );

      // Generate reports
      const reportUrls = await this.generateReports(
        request.research_topic,
        evaluation,
        aggregatedData,
        requestId
      );

      // Build final response
      const response: EvaluationResponse = {
        topic: request.research_topic,
        raw_data: rawData,
        evaluation,
        report: reportUrls,
      };

      // Cache the result
      await this.cache.set(cacheKey, response);

      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      this.logMetrics(metrics);

      return response;

    } catch (error) {
      metrics.endTime = Date.now();
      metrics.duration = metrics.endTime - metrics.startTime;
      
      console.error('Orchestration error:', error);
      this.logMetrics(metrics);
      
      throw new Error(`Research topic evaluation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Build search query from topic and keywords
   */
  private buildSearchQuery(topic: string, keywords?: string[]): string {
    const normalizedTopic = topic.trim();
    const additionalTerms = keywords?.join(' ') || '';
    
    return additionalTerms 
      ? `${normalizedTopic} ${additionalTerms}`.trim()
      : normalizedTopic;
  }

  /**
   * Execute all API calls in parallel with error handling
   */
  private async executeParallelAPICalls(
    query: string,
    metrics: OrchestrationMetrics
  ): Promise<Record<string, any>> {
    const apiCalls = [
      this.timedAPICall('openAlex', () => this.openAlex.searchWorks(query, this.config.limits.maxWorksPerProvider)),
      this.timedAPICall('semanticScholar', () => this.semanticScholar.searchPapers(query, this.config.limits.maxWorksPerProvider)),
      this.timedAPICall('core', () => this.core.searchWorks(query, this.config.limits.maxWorksPerProvider)),
      this.timedAPICall('crossref', () => this.crossref.searchWorks(query, this.config.limits.maxWorksPerProvider)),
      this.timedAPICall('nih', () => this.nih.searchProjects(query)),
      this.timedAPICall('cordis', () => this.cordis.searchCalls(query)),
      this.timedAPICall('grants', () => this.grantsGov.searchOpportunities(query)),
    ];

    const results = await Promise.allSettled(apiCalls);
    const rawData: Record<string, any> = {};

    results.forEach((result, index) => {
      const providerNames = ['openAlex', 'semanticScholar', 'core', 'crossref', 'nih', 'cordis', 'grants'];
      const providerName = providerNames[index];

      if (result.status === 'fulfilled') {
        const { data, timing } = result.value;
        rawData[providerName] = data;
        metrics.providerTimings[providerName] = timing;
      } else {
        console.error(`${providerName} API call failed:`, result.reason);
        metrics.providerErrors[providerName] = result.reason.message;
        rawData[providerName] = null; // Graceful degradation
      }
    });

    return rawData;
  }

  /**
   * Time an API call and return both data and timing
   */
  private async timedAPICall<T>(
    name: string,
    apiCall: () => Promise<T>
  ): Promise<{ data: T; timing: number }> {
    const start = Date.now();
    try {
      const data = await apiCall();
      const timing = Date.now() - start;
      return { data, timing };
    } catch (error) {
      const timing = Date.now() - start;
      console.error(`${name} API call failed after ${timing}ms:`, error);
      throw error;
    }
  }

  /**
   * Process and clean raw API data
   */
  private async processRawData(
    rawData: Record<string, any>,
    metrics: OrchestrationMetrics
  ): Promise<{ works: Work[]; funding: Funding[] }> {
    const allWorks: Work[] = [];
    const allFunding: Funding[] = [];

    // Process OpenAlex data
    if (rawData.openAlex?.results) {
      rawData.openAlex.results.forEach((item: any) => {
        const work = DataCleaner.cleanWork({
          title: item.title,
          abstract: item.abstract,
          year: item.publication_year,
          doi: item.ids?.doi,
          concepts: item.concepts?.map((c: any) => c.display_name) || [],
          citations: item.cited_by_count || 0,
        });
        allWorks.push(work);
      });
    }

    // Process Semantic Scholar data
    if (rawData.semanticScholar?.data) {
      rawData.semanticScholar.data.forEach((item: any) => {
        const work = DataCleaner.cleanWork({
          title: item.title,
          abstract: item.abstract,
          year: item.year,
          doi: item.externalIds?.DOI,
          concepts: item.fieldsOfStudy || [],
          citations: item.citationCount || 0,
          methods: item.fieldsOfStudy,
        });
        allWorks.push(work);
      });
    }

    // Process CORE data
    if (rawData.core?.data) {
      rawData.core.data.forEach((item: any) => {
        const work = DataCleaner.cleanWork({
          title: item.title,
          abstract: item.abstract,
          year: item.yearPublished,
          doi: item.doi,
          fullTextUrl: item.downloadUrl,
        });
        allWorks.push(work);
      });
    }

    // Process Crossref data
    if (rawData.crossref?.message?.items) {
      rawData.crossref.message.items.forEach((item: any) => {
        const work = DataCleaner.cleanWork({
          title: item.title?.[0],
          abstract: item.abstract,
          year: item.published?.['date-parts']?.[0]?.[0],
          doi: item.DOI,
          concepts: item.subject || [],
        });
        allWorks.push(work);
      });
    }

    // Process NIH data
    if (rawData.nih?.results) {
      rawData.nih.results.forEach((item: any) => {
        const funding = DataCleaner.cleanFunding({
          source: 'NIH',
          title: item.project_title,
          abstractOrDesc: item.abstract_text,
          amount: item.award_amount,
          fiscalYear: item.fiscal_year,
        });
        allFunding.push(funding);
      });
    }

    // Process CORDIS data
    if (rawData.cordis?.results) {
      rawData.cordis.results.forEach((item: any) => {
        const funding = DataCleaner.cleanFunding({
          source: 'CORDIS',
          title: item.title,
          abstractOrDesc: item.objective,
          deadline: item.call?.deadline,
        });
        allFunding.push(funding);
      });
    }

    // Process Grants.gov data
    if (rawData.grants?.opportunitySynopsisDetail_1_0) {
      rawData.grants.opportunitySynopsisDetail_1_0.forEach((item: any) => {
        const funding = DataCleaner.cleanFunding({
          source: 'Grants.gov',
          title: item.opportunityTitle,
          abstractOrDesc: item.description,
          deadline: item.closeDate,
        });
        allFunding.push(funding);
      });
    }

    // Deduplicate data
    const deduplicatedWorks = DataDeduplicator.deduplicateWorks(
      allWorks,
      this.config.similarity.threshold
    );
    const deduplicatedFunding = DataDeduplicator.deduplicateFunding(
      allFunding,
      this.config.similarity.threshold
    );

    return {
      works: deduplicatedWorks,
      funding: deduplicatedFunding,
    };
  }

  /**
   * Perform LLM evaluation with error handling
   */
  private async performLLMEvaluation(
    topic: string,
    aggregatedData: AggregatedData,
    metrics: OrchestrationMetrics
  ) {
    const start = Date.now();
    
    try {
      const evaluation = aggregatedData.totalWorks > 0
        ? await this.openaiEvaluator.evaluateTopic(topic, aggregatedData, this.config.limits.maxTokensForLLM)
        : await this.openaiEvaluator.evaluateWithEmptyData(topic);
      
      metrics.providerTimings.openai = Date.now() - start;
      return evaluation;
    } catch (error) {
      metrics.providerTimings.openai = Date.now() - start;
      metrics.providerErrors.openai = error instanceof Error ? error.message : String(error);
      throw error;
    }
  }

  /**
   * Generate HTML and PDF reports
   */
  private async generateReports(
    topic: string,
    evaluation: any,
    aggregatedData: AggregatedData,
    requestId: string
  ) {
    return await this.reportGenerator.generateReports(
      topic,
      evaluation,
      aggregatedData,
      requestId
    );
  }

  /**
   * Generate unique request ID
   */
  private generateRequestId(): string {
    return `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Log orchestration metrics
   */
  private logMetrics(metrics: OrchestrationMetrics): void {
    const logData = {
      requestId: metrics.requestId,
      duration: metrics.duration,
      cacheHit: metrics.cacheHit,
      totalWorks: metrics.totalWorks,
      totalFunding: metrics.totalFunding,
      providerTimings: metrics.providerTimings,
      providerErrors: Object.keys(metrics.providerErrors).length > 0 ? metrics.providerErrors : undefined,
      timestamp: new Date().toISOString(),
    };

    console.log('Research evaluation metrics:', JSON.stringify(logData));
  }
}
