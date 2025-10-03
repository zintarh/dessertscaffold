import {
  EvaluationRequest,
  Evaluation,
  AggregatedData,
  Work,
  Funding,
} from "../types/evaluation";
import { OpenAIEvaluator } from "./openai-evaluator";

export class ComprehensiveEvaluator {
  private openaiEvaluator: OpenAIEvaluator;

  constructor(openaiApiKey: string) {
    this.openaiEvaluator = new OpenAIEvaluator(openaiApiKey);
  }


  async evaluateResearchTopic(request: EvaluationRequest): Promise<Evaluation> {
    console.log(`🔍 Evaluating: ${request.research_topic}`);
    
    try {
      const [literatureData, fundingData] = await Promise.all([
        this.queryLiteratureAPIs(
          request.research_topic,
          request.additional_keywords
        ),
        this.queryFundingAPIs(
          request.research_topic,
          request.additional_keywords
        ),
      ]);

      console.log(
        `📚 Retrieved: ${literatureData.length} literature papers, ${fundingData.length} funding opportunities`
      );
      const aggregatedData = this.aggregateData(literatureData, fundingData);

      const evaluation = await this.openaiEvaluator.evaluateTopic(
        request.research_topic,
        aggregatedData
      );

      this.logEvaluationResults(
        request.research_topic,
        aggregatedData,
        evaluation
      );
      return evaluation;
    } catch (error: any) {
      console.error("❌ Evaluation failed:", error);
      throw new Error(`Research evaluation failed: ${error.message}`);
    }
  }

  /**
   * Query all literature APIs in parallel
   */
  private async queryLiteratureAPIs(
    topic: string,
    keywords?: string[]
  ): Promise<Work[]> {
    const [openAlexData, semanticScholarData, coreData, crossrefData] =
      await Promise.allSettled([
        this.queryOpenAlex(topic, keywords),
        this.querySemanticScholar(topic, keywords),
        this.queryCORE(topic, keywords),
        this.queryCrossRef(topic, keywords),
      ]);

    const allLiterature = [
      ...(openAlexData.status === "fulfilled" ? openAlexData.value : []),
      ...(semanticScholarData.status === "fulfilled"
        ? semanticScholarData.value
        : []),
      ...(coreData.status === "fulfilled" ? coreData.value : []),
      ...(crossrefData.status === "fulfilled" ? crossrefData.value : []),
    ];

    console.log(
      `📊 Literature APIs: OpenAlex(${
        openAlexData.status === "fulfilled" ? openAlexData.value.length : 0
      }), Semantic Scholar(${
        semanticScholarData.status === "fulfilled"
          ? semanticScholarData.value.length
          : 0
      }), CORE(${
        coreData.status === "fulfilled" ? coreData.value.length : 0
      }), CrossRef(${
        crossrefData.status === "fulfilled" ? crossrefData.value.length : 0
      })`
    );

    return allLiterature;
  }

  /**
   * Query all funding APIs in parallel (excluding CORDIS due to reliability issues)
   */
  private async queryFundingAPIs(
    topic: string,
    keywords?: string[]
  ): Promise<Funding[]> {
    const [nihData, grantsGovData] = await Promise.allSettled([
      this.queryNIH(topic, keywords),
      this.queryGrantsGov(topic, keywords),
    ]);

    const allFunding = [
      ...(nihData.status === "fulfilled" ? nihData.value : []),
      ...(grantsGovData.status === "fulfilled" ? grantsGovData.value : []),
    ];

    console.log(
      `💰 Funding APIs: NIH(${
        nihData.status === "fulfilled" ? nihData.value.length : 0
      }), Grants.gov(${
        grantsGovData.status === "fulfilled" ? grantsGovData.value.length : 0
      })`
    );

    return allFunding;
  }

  private async queryOpenAlex(
    topic: string,
    keywords?: string[]
  ): Promise<Work[]> {
    try {
      const query = this.buildSearchQuery(topic, keywords);
      const url = `https://api.openalex.org/works?search=${encodeURIComponent(
        query
      )}&per-page=50&sort=cited_by_count:desc`;

      const response = await this.fetchWithTimeout(url, {
        headers: {
          "User-Agent": "DissertScaffold/1.0 (https://dissertscaffold.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`OpenAlex API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processOpenAlexResults(data.results || []);
    } catch (error: any) {
      if (error.message?.includes("timed out")) {
        console.warn("⚠️ OpenAlex query timed out");
      } else {
        console.warn("⚠️ OpenAlex query failed:", error);
      }
      return [];
    }
  }


  private async querySemanticScholar(
    topic: string,
    keywords?: string[]
  ): Promise<Work[]> {
    try {
      const query = this.buildSearchQuery(topic, keywords);
      const url = `https://api.semanticscholar.org/graph/v1/paper/search?query=${encodeURIComponent(
        query
      )}&limit=50&sort=relevance`;

      const response = await this.fetchWithTimeout(url, {
        headers: {
          "User-Agent": "DissertScaffold/1.0 (https://dissertscaffold.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`Semantic Scholar API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processSemanticScholarResults(data.data || []);
    } catch (error: any) {
      if (error.message?.includes("timed out")) {
        console.warn("⚠️ Semantic Scholar query timed out");
      } else {
        console.warn("⚠️ Semantic Scholar query failed:", error);
      }
      return [];
    }
  }


  private async queryCORE(topic: string, keywords?: string[]): Promise<Work[]> {
    try {
      const query = this.buildSearchQuery(topic, keywords);
      const url = `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(
        query
      )}&limit=50&sort=relevance`;

      const response = await this.fetchWithTimeout(url, {
        headers: {
          "User-Agent": "DissertScaffold/1.0 (https://dissertscaffold.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`CORE API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processCOREResults(data.results || []);
    } catch (error: any) {
      if (error.message?.includes("timed out")) {
        console.warn("⚠️ CORE query timed out");
      } else {
        console.warn("⚠️ CORE query failed:", error);
      }
      return [];
    }
  }


  private async queryCrossRef(
    topic: string,
    keywords?: string[]
  ): Promise<Work[]> {
    try {
      const query = this.buildSearchQuery(topic, keywords);
      const url = `https://api.crossref.org/works?query=${encodeURIComponent(
        query
      )}&rows=50&sort=relevance`;

      const response = await this.fetchWithTimeout(url, {
        headers: {
          "User-Agent": "DissertScaffold/1.0 (https://dissertscaffold.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`CrossRef API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processCrossRefResults(data.message?.items || []);
    } catch (error: any) {
      if (error.message?.includes("timed out")) {
        console.warn("⚠️ CrossRef query timed out");
      } else {
        console.warn("⚠️ CrossRef query failed:", error);
      }
      return [];
    }
  }

 
  private async queryNIH(
    topic: string,
    keywords?: string[]
  ): Promise<Funding[]> {
    try {
      const query = this.buildSearchQuery(topic, keywords);
      const url = `https://api.reporter.nih.gov/v2/projects/search`;

      const response = await this.fetchWithTimeout(url, {
        method: "POST",
        headers: {
          "User-Agent": "DissertScaffold/1.0 (https://dissertscaffold.com)",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          criteria: {
            advanced_text_search: {
              operator: "and",
              search_field: "all",
              search_text: query,
            },
          },
          offset: 0,
          limit: 50,
        }),
      });

      if (!response.ok) {
        throw new Error(`NIH API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processNIHResults(data.results || []);
    } catch (error: any) {
      if (error.message?.includes("timed out")) {
        console.warn("⚠️ NIH query timed out");
      } else {
        console.warn("⚠️ NIH query failed:", error);
      }
      return [];
    }
  }




  private async queryGrantsGov(
    topic: string,
    keywords?: string[]
  ): Promise<Funding[]> {
    try {
      const query = this.buildSearchQuery(topic, keywords);
      const url = `https://www.grants.gov/api/search?q=${encodeURIComponent(
        query
      )}&limit=50`;

      const response = await this.fetchWithTimeout(url, {
        headers: {
          "User-Agent": "DissertScaffold/1.0 (https://dissertscaffold.com)",
        },
      });

      if (!response.ok) {
        throw new Error(`Grants.gov API error: ${response.status}`);
      }

      const data = await response.json();
      return this.processGrantsGovResults(data.results || []);
    } catch (error: any) {
      if (error.message?.includes("timed out")) {
        console.warn("⚠️ Grants.gov query timed out");
      } else {
        console.warn("⚠️ Grants.gov query failed:", error);
      }
      return [];
    }
  }


  private processOpenAlexResults(results: any[]): Work[] {
    return results
      .map((item) => ({
        title: item.title || "",
        abstract: item.abstract || "",
        year: this.extractYear(item.publication_year),
        doi: item.ids?.doi,
        concepts: item.concepts?.map((c: any) => c.display_name) || [],
        citations: item.cited_by_count || 0,
        methods: this.extractMethods(item.abstract),
        fullTextUrl: item.open_access?.oa_url,
      }))
      .filter((work) => work.title && work.abstract);
  }


  private processSemanticScholarResults(results: any[]): Work[] {
    return results
      .map((item) => ({
        title: item.title || "",
        abstract: item.abstract || "",
        year: this.extractYear(item.year),
        doi: item.externalIds?.DOI,
        concepts: item.fieldsOfStudy || [],
        citations: item.citationCount || 0,
        methods: this.extractMethods(item.abstract),
        fullTextUrl: item.openAccessPdf?.url,
      }))
      .filter((work) => work.title && work.abstract);
  }


  private processCOREResults(results: any[]): Work[] {
    return results
      .map((item) => ({
        title: item.title || "",
        abstract: item.abstract || "",
        year: this.extractYear(item.publishedDate),
        doi: item.doi,
        concepts: item.subjects || [],
        citations: item.citationCount || 0,
        methods: this.extractMethods(item.abstract),
        fullTextUrl: item.downloadUrl,
      }))
      .filter((work) => work.title && work.abstract);
  }


  private processCrossRefResults(results: any[]): Work[] {
    return results
      .map((item) => ({
        title: item.title?.[0] || "",
        abstract: item.abstract || "",
        year: this.extractYear(item.published),
        doi: item.DOI,
        concepts: item.subject || [],
        citations: item.citationCount || 0,
        methods: this.extractMethods(item.abstract),
        fullTextUrl: item.link?.[0]?.URL,
      }))
      .filter((work) => work.title && work.abstract);
  }

  /**
   * Process NIH API results
   */
  private processNIHResults(results: any[]): Funding[] {
    return results
      .map((item) => ({
        source: "NIH",
        title: item.projectTitle || "",
        abstractOrDesc: item.abstractText || "",
        amount: item.awardAmount || 0,
        fiscalYear: item.fiscalYear,
        deadline: item.projectStartDate,
      }))
      .filter((funding) => funding.title);
  }


 
  private processGrantsGovResults(results: any[]): Funding[] {
    return results
      .map((item) => ({
        source: "Grants.gov",
        title: item.opportunityTitle || "",
        abstractOrDesc: item.description || "",
        amount: item.estimatedTotalProgramFunding || 0,
        fiscalYear: item.fiscalYear,
        deadline: item.closeDate,
      }))
      .filter((funding) => funding.title);
  }


  private extractMethods(abstract: string): string[] {
    if (!abstract) return [];

    const methodKeywords = [
      "machine learning",
      "deep learning",
      "neural networks",
      "statistical analysis",
      "qualitative research",
      "quantitative research",
      "case study",
      "survey",
      "experiment",
      "simulation",
      "modeling",
      "data mining",
      "text mining",
      "meta-analysis",
      "systematic review",
      "randomized controlled trial",
      "longitudinal study",
      "cross-sectional study",
      "ethnography",
      "interview",
      "focus group",
      "content analysis",
      "discourse analysis",
      "regression analysis",
      "clustering",
      "classification",
      "natural language processing",
      "computer vision",
    ];

    const foundMethods = methodKeywords.filter((keyword) =>
      abstract.toLowerCase().includes(keyword.toLowerCase())
    );

    return foundMethods;
  }

  /**
   * Extract year from various date formats
   */
  private extractYear(dateValue: any): number {
    if (typeof dateValue === "number") return dateValue;
    if (typeof dateValue === "string") {
      const year = parseInt(dateValue.split("-")[0]);
      if (!isNaN(year) && year >= 1900 && year <= 2030) return year;
    }
    return new Date().getFullYear();
  }

  /**
   * Build search query from topic and keywords
   */
  private buildSearchQuery(topic: string, keywords?: string[]): string {
    if (!topic || topic.trim().length === 0) {
      throw new Error("Research topic cannot be empty");
    }

    const validKeywords =
      keywords?.filter((k) => k && k.trim().length > 0) || [];
    return [topic.trim(), ...validKeywords].join(" ");
  }

  /**
   * Helper method for API calls with timeout
   */
  private async fetchWithTimeout(
    url: string,
    options: RequestInit = {},
    timeoutMs: number = 10000
  ): Promise<Response> {
    const controller = new AbortController();
    let timeoutId: NodeJS.Timeout | null = null;

    try {
      timeoutId = setTimeout(() => {
        controller.abort();
      }, timeoutMs);

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      return response;
    } catch (error: any) {
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }

      if (error.name === "AbortError") {
        throw new Error(`Request timed out after ${timeoutMs}ms`);
      }
      throw error;
    }
  }

  /**
   * Aggregate processed data for LLM evaluation with enhanced detail
   */
  private aggregateData(
    literatureData: Work[],
    fundingData: Funding[]
  ): AggregatedData {
    // Remove duplicates by DOI or title (O(n) complexity)
    const seenDois = new Set<string>();
    const seenTitles = new Set<string>();
    const uniqueWorks = literatureData.filter((work) => {
      const hasDoi = work.doi && !seenDois.has(work.doi);
      const hasUniqueTitle = !seenTitles.has(work.title.toLowerCase());

      if (hasDoi) {
        seenDois.add(work.doi!);
        return true;
      }
      if (hasUniqueTitle) {
        seenTitles.add(work.title.toLowerCase());
        return true;
      }
      return false;
    });

    // Calculate metrics
    const trends = this.calculateTrends(uniqueWorks);
    const methods = this.calculateMethods(uniqueWorks);
    const openAccessRatio = this.calculateOpenAccessRatio(uniqueWorks);
    const avgCitations = this.calculateAverageCitations(uniqueWorks);
    const topConcepts = this.calculateTopConcepts(uniqueWorks);
    const totalFunding = this.calculateTotalFunding(fundingData);
    const activeCalls = this.calculateActiveCalls(fundingData);

    // Enhanced data for detailed analysis
    const topCitedPapers = this.getTopCitedPapers(uniqueWorks, 10);
    const recentPapers = this.getRecentPapers(uniqueWorks, 5);
    const topFundingOpportunities = this.getTopFundingOpportunities(fundingData, 5);
    const methodDistribution = this.getMethodDistribution(uniqueWorks);
    const conceptTrends = this.getConceptTrends(uniqueWorks);

    return {
      works: uniqueWorks,
      funding: fundingData,
      trends,
      methods,
      openAccessRatio,
      totalWorks: uniqueWorks.length,
      totalFunding,
      activeCalls,
      avgCitations,
      topConcepts,
      // Enhanced data for detailed analysis
      topCitedPapers,
      recentPapers,
      topFundingOpportunities,
      methodDistribution,
      conceptTrends,
    };
  }

  /**
   * Calculate publication trends by year
   */
  private calculateTrends(works: Work[]): Record<string, number> {
    const trends: Record<string, number> = {};
    works.forEach((work) => {
      const year = work.year.toString();
      trends[year] = (trends[year] || 0) + 1;
    });
    return trends;
  }

  /**
   * Calculate research methods distribution
   */
  private calculateMethods(works: Work[]): Record<string, number> {
    const methodCounts: Record<string, number> = {};
    works.forEach((work) => {
      work.methods?.forEach((method) => {
        methodCounts[method] = (methodCounts[method] || 0) + 1;
      });
    });
    return methodCounts;
  }

  /**
   * Calculate open access ratio
   */
  private calculateOpenAccessRatio(works: Work[]): number {
    if (works.length === 0) return 0;
    const openAccessCount = works.filter((work) => work.fullTextUrl).length;
    return openAccessCount / works.length;
  }

  /**
   * Calculate average citations
   */
  private calculateAverageCitations(works: Work[]): number {
    if (works.length === 0) return 0;
    const totalCitations = works.reduce((sum, work) => sum + work.citations, 0);
    return totalCitations / works.length;
  }

  /**
   * Calculate top concepts from all works
   */
  private calculateTopConcepts(
    works: Work[]
  ): Array<{ name: string; count: number }> {
    const conceptCounts: Record<string, number> = {};

    works.forEach((work) => {
      work.concepts?.forEach((concept) => {
        conceptCounts[concept] = (conceptCounts[concept] || 0) + 1;
      });
    });
    
    return Object.entries(conceptCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));
  }

  /**
   * Calculate total funding amount
   */
  private calculateTotalFunding(funding: Funding[]): number {
    return funding.reduce((total, fund) => total + (fund.amount || 0), 0);
  }

  /**
   * Calculate active funding calls
   */
  private calculateActiveCalls(funding: Funding[]): number {
    const now = new Date();
    return funding.filter((fund) => {
      if (!fund.deadline) return false;
      try {
        const deadline = new Date(fund.deadline);
        return deadline > now;
      } catch {
        return false;
      }
    }).length;
  }

  /**
   * Get top cited papers for detailed analysis
   */
  private getTopCitedPapers(works: Work[], limit: number): Array<{
    title: string;
    citations: number;
    year: number;
    doi?: string;
    authors?: string[];
  }> {
    return works
      .sort((a, b) => b.citations - a.citations)
      .slice(0, limit)
      .map(work => ({
        title: work.title,
        citations: work.citations,
        year: work.year,
        doi: work.doi,
        authors: [], // Could be enhanced if author data is available
      }));
  }

  /**
   * Get most recent papers for trend analysis
   */
  private getRecentPapers(works: Work[], limit: number): Array<{
    title: string;
    year: number;
    citations: number;
    doi?: string;
  }> {
    const currentYear = new Date().getFullYear();
    return works
      .filter(work => work.year >= currentYear - 2) // Last 2 years
      .sort((a, b) => b.year - a.year)
      .slice(0, limit)
      .map(work => ({
        title: work.title,
        year: work.year,
        citations: work.citations,
        doi: work.doi,
      }));
  }

  /**
   * Get top funding opportunities by amount
   */
  private getTopFundingOpportunities(funding: Funding[], limit: number): Array<{
    title: string;
    amount: number;
    source: string;
    fiscalYear?: number;
  }> {
    return funding
      .sort((a, b) => (b.amount || 0) - (a.amount || 0))
      .slice(0, limit)
      .map(fund => ({
        title: fund.title,
        amount: fund.amount || 0,
        source: fund.source,
        fiscalYear: fund.fiscalYear,
      }));
  }

  /**
   * Get detailed method distribution
   */
  private getMethodDistribution(works: Work[]): Array<{
    method: string;
    count: number;
    percentage: number;
  }> {
    const methodCounts: Record<string, number> = {};
    let totalMethods = 0;

    works.forEach(work => {
      work.methods?.forEach(method => {
        methodCounts[method] = (methodCounts[method] || 0) + 1;
        totalMethods++;
      });
    });

    return Object.entries(methodCounts)
      .map(([method, count]) => ({
        method,
        count,
        percentage: totalMethods > 0 ? (count / totalMethods) * 100 : 0,
      }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get concept trends over time
   */
  private getConceptTrends(works: Work[]): Array<{
    concept: string;
    count: number;
    recentCount: number;
    trend: 'increasing' | 'decreasing' | 'stable';
  }> {
    const conceptCounts: Record<string, { total: number; recent: number }> = {};
    const currentYear = new Date().getFullYear();

    works.forEach(work => {
      const isRecent = work.year >= currentYear - 2;
      work.concepts?.forEach(concept => {
        if (!conceptCounts[concept]) {
          conceptCounts[concept] = { total: 0, recent: 0 };
        }
        conceptCounts[concept].total++;
        if (isRecent) {
          conceptCounts[concept].recent++;
        }
      });
    });

    return Object.entries(conceptCounts)
      .map(([concept, counts]) => {
        const trend: 'increasing' | 'decreasing' | 'stable' = 
          counts.recent > counts.total * 0.3 ? 'increasing' : 
          counts.recent < counts.total * 0.1 ? 'decreasing' : 'stable';
        return {
          concept,
          count: counts.total,
          recentCount: counts.recent,
          trend,
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * Log evaluation results for debugging
   */
  private logEvaluationResults(
    topic: string,
    data: AggregatedData,
    evaluation: Evaluation
  ): void {
    console.log("\n🎯 EVALUATION RESULTS");
    console.log(`📝 Topic: ${topic}`);
    console.log(
      `📊 Data: ${
        data.totalWorks
      } papers, $${data.totalFunding.toLocaleString()} funding, ${data.avgCitations.toFixed(
        1
      )} avg citations, ${(data.openAccessRatio * 100).toFixed(1)}% open access`
    );
    console.log(
      `🔬 Methods: ${Object.keys(data.methods).length} unique methods`
    );
    console.log(
      `💰 Funding: $${data.totalFunding.toLocaleString()} total, ${
        data.activeCalls
      } active calls`
    );
    console.log("\n📈 6 METRICS SCORES (with API sources):");
    console.log(
      `1️⃣  Novelty: ${evaluation.novelty.score}/10 (OpenAlex + Semantic Scholar)`
    );
    console.log(`2️⃣  Trends: ${evaluation.trends.score}/10 (OpenAlex + CORE)`);
    console.log(
      `3️⃣  Methodological Complexity: ${evaluation.methodological_complexity.score}/10 (Semantic Scholar + CrossRef)`
    );
    console.log(
      `4️⃣  Research Gaps: ${evaluation.research_gaps.score}/10 (CORE + OpenAlex + GPT analysis)`
    );
    console.log(
      `5️⃣  Grant Potential: ${evaluation.grant_potential.score}/10 (NIH + Grants.gov)`
    );
    console.log(
      `6️⃣  Literature Availability: ${evaluation.literature_availability.score}/10 (All literature APIs)`
    );
    console.log("\n✅ Evaluation completed successfully\n");
  }
}
