import { Work, Funding, AggregatedData } from '../types/evaluation';
import { DataCleaner } from './data-cleaning';

/**
 * Data aggregation utilities for research topic evaluation
 * Handles trend analysis, method extraction, open-access detection, and funding analysis
 */

export class DataAggregator {
  /**
   * Aggregate works and funding data into analysis-ready format
   */
  static aggregate(works: Work[], funding: Funding[]): AggregatedData {
    const trends = this.calculateTrends(works);
    const methods = this.extractMethodCounts(works);
    const openAccessRatio = this.calculateOpenAccessRatio(works);
    const totalFunding = this.calculateTotalFunding(funding);
    const activeCalls = this.countActiveCalls(funding);
    const avgCitations = this.calculateAverageCitations(works);
    const topConcepts = this.extractTopConcepts(works);

    return {
      works,
      funding,
      trends,
      methods,
      openAccessRatio,
      totalWorks: works.length,
      totalFunding,
      activeCalls,
      avgCitations,
      topConcepts,
    };
  }

  /**
   * Calculate yearly trend counts
   */
  private static calculateTrends(works: Work[]): Record<string, number> {
    const trends: Record<string, number> = {};
    
    works.forEach(work => {
      const year = work.year.toString();
      trends[year] = (trends[year] || 0) + 1;
    });

    // Fill in missing years with 0 for the last 10 years
    const currentYear = new Date().getFullYear();
    for (let year = currentYear - 9; year <= currentYear; year++) {
      const yearStr = year.toString();
      if (!(yearStr in trends)) {
        trends[yearStr] = 0;
      }
    }

    return trends;
  }

  /**
   * Extract and count research methods
   */
  private static extractMethodCounts(works: Work[]): Record<string, number> {
    const methodCounts: Record<string, number> = {};
    
    works.forEach(work => {
      // Extract methods from abstract if not explicitly provided
      const methods = work.methods || 
        (work.abstract ? DataCleaner.extractMethods(work.abstract) : []);
      
      methods.forEach(method => {
        const normalizedMethod = method.toLowerCase().trim();
        methodCounts[normalizedMethod] = (methodCounts[normalizedMethod] || 0) + 1;
      });
    });

    return methodCounts;
  }

  /**
   * Calculate open access ratio
   */
  private static calculateOpenAccessRatio(works: Work[]): number {
    if (works.length === 0) return 0;
    
    const openAccessCount = works.filter(work => work.fullTextUrl).length;
    return openAccessCount / works.length;
  }

  /**
   * Calculate total funding amount
   */
  private static calculateTotalFunding(funding: Funding[]): number {
    return funding.reduce((total, fund) => {
      return total + (fund.amount || 0);
    }, 0);
  }

  /**
   * Count active funding calls (future deadlines)
   */
  private static countActiveCalls(funding: Funding[]): number {
    const now = new Date();
    
    return funding.filter(fund => {
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
   * Calculate average citations
   */
  private static calculateAverageCitations(works: Work[]): number {
    if (works.length === 0) return 0;
    
    const totalCitations = works.reduce((sum, work) => sum + work.citations, 0);
    return totalCitations / works.length;
  }

  /**
   * Extract top concepts from works
   */
  private static extractTopConcepts(works: Work[], limit: number = 10): Array<{name: string, count: number}> {
    const conceptCounts: Record<string, number> = {};
    
    works.forEach(work => {
      work.concepts.forEach(concept => {
        const normalizedConcept = concept.toLowerCase().trim();
        conceptCounts[normalizedConcept] = (conceptCounts[normalizedConcept] || 0) + 1;
      });
    });

    return Object.entries(conceptCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([name, count]) => ({ name, count }));
  }

  /**
   * Prepare aggregated data for LLM by truncating large arrays and including summary stats
   */
  static prepareForLLM(data: AggregatedData, maxTokens: number = 8000): any {
    // Estimate token usage (rough approximation: 1 token ≈ 4 characters)
    const estimateTokens = (obj: any): number => {
      return JSON.stringify(obj).length / 4;
    };

    // Start with summary statistics
    const summary = {
      totalWorks: data.totalWorks,
      totalFunding: data.totalFunding,
      activeCalls: data.activeCalls,
      avgCitations: data.avgCitations,
      openAccessRatio: data.openAccessRatio,
      trends: data.trends,
      topMethods: Object.entries(data.methods)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .reduce((acc, [method, count]) => ({ ...acc, [method]: count }), {}),
      topConcepts: data.topConcepts.slice(0, 10),
    };

    let currentTokens = estimateTokens(summary);
    
    // Add sample works (prioritize by citations and recency)
    const sortedWorks = [...data.works]
      .sort((a, b) => {
        // Sort by citations (desc) then by year (desc)
        if (b.citations !== a.citations) return b.citations - a.citations;
        return b.year - a.year;
      });

    const sampleWorks = [];
    for (const work of sortedWorks) {
      const workTokens = estimateTokens(work);
      if (currentTokens + workTokens > maxTokens * 0.7) break; // Reserve 30% for funding
      
      sampleWorks.push({
        title: work.title,
        year: work.year,
        citations: work.citations,
        concepts: work.concepts.slice(0, 5), // Limit concepts
        methods: work.methods?.slice(0, 3), // Limit methods
        hasFullText: !!work.fullTextUrl,
      });
      
      currentTokens += workTokens;
    }

    // Add sample funding
    const sortedFunding = [...data.funding]
      .sort((a, b) => (b.amount || 0) - (a.amount || 0));

    const sampleFunding = [];
    for (const fund of sortedFunding) {
      const fundTokens = estimateTokens(fund);
      if (currentTokens + fundTokens > maxTokens) break;
      
      sampleFunding.push({
        source: fund.source,
        title: fund.title,
        amount: fund.amount,
        fiscalYear: fund.fiscalYear,
        hasDeadline: !!fund.deadline,
      });
      
      currentTokens += fundTokens;
    }

    return {
      summary,
      sampleWorks: sampleWorks.slice(0, 20), // Limit to top 20
      sampleFunding: sampleFunding.slice(0, 10), // Limit to top 10
      metadata: {
        totalWorksInSample: sampleWorks.length,
        totalFundingInSample: sampleFunding.length,
        estimatedTokens: currentTokens,
      },
    };
  }

  /**
   * Calculate research maturity score based on publication patterns
   */
  static calculateMaturityScore(data: AggregatedData): number {
    const currentYear = new Date().getFullYear();
    const recentYears = [currentYear - 2, currentYear - 1, currentYear];
    const olderYears = [currentYear - 7, currentYear - 6, currentYear - 5, currentYear - 4, currentYear - 3];
    
    const recentCount = recentYears.reduce((sum, year) => 
      sum + (data.trends[year.toString()] || 0), 0);
    const olderCount = olderYears.reduce((sum, year) => 
      sum + (data.trends[year.toString()] || 0), 0);
    
    if (recentCount === 0 && olderCount === 0) return 0;
    if (olderCount === 0) return 3; // Very new field
    
    const growthRatio = recentCount / olderCount;
    
    if (growthRatio > 2) return 8; // Rapidly growing
    if (growthRatio > 1.5) return 7; // Growing
    if (growthRatio > 1) return 6; // Stable growth
    if (growthRatio > 0.5) return 5; // Mature/stable
    return 4; // Declining
  }

  /**
   * Calculate interdisciplinary score based on concept diversity
   */
  static calculateInterdisciplinaryScore(data: AggregatedData): number {
    const uniqueConcepts = data.topConcepts.length;
    const conceptEntropy = this.calculateEntropy(data.topConcepts.map(c => c.count));
    
    // Normalize scores
    const diversityScore = Math.min(uniqueConcepts / 20, 1) * 5; // 0-5
    const entropyScore = Math.min(conceptEntropy / 3, 1) * 5; // 0-5
    
    return Math.round(diversityScore + entropyScore);
  }

  /**
   * Calculate entropy for measuring diversity
   */
  private static calculateEntropy(counts: number[]): number {
    const total = counts.reduce((sum, count) => sum + count, 0);
    if (total === 0) return 0;
    
    return -counts.reduce((entropy, count) => {
      if (count === 0) return entropy;
      const p = count / total;
      return entropy + p * Math.log2(p);
    }, 0);
  }
}
