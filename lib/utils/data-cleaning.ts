import { Work, Funding } from '../types/evaluation';

/**
 * Data cleaning utilities for research topic evaluation
 * Handles HTML stripping, normalization, stopword filtering, and deduplication
 */

// Common stopwords for keyword analysis
const STOPWORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he',
  'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 'with',
  'using', 'based', 'study', 'research', 'analysis', 'approach', 'method', 'methods',
  'results', 'data', 'paper', 'article', 'journal', 'conference', 'proceedings'
]);

// Method detection keywords for heuristic extraction
const METHOD_KEYWORDS = {
  'machine learning': ['machine learning', 'ml', 'artificial intelligence', 'ai'],
  'deep learning': ['deep learning', 'neural network', 'cnn', 'rnn', 'lstm', 'transformer'],
  'random forest': ['random forest', 'rf'],
  'support vector machine': ['svm', 'support vector machine', 'support vector'],
  'regression': ['regression', 'linear regression', 'logistic regression'],
  'clustering': ['clustering', 'k-means', 'hierarchical clustering'],
  'classification': ['classification', 'classifier'],
  'natural language processing': ['nlp', 'natural language processing', 'text mining'],
  'computer vision': ['computer vision', 'image processing', 'object detection'],
  'reinforcement learning': ['reinforcement learning', 'rl', 'q-learning'],
  'transfer learning': ['transfer learning', 'fine-tuning'],
  'ensemble methods': ['ensemble', 'bagging', 'boosting', 'adaboost', 'xgboost'],
  'statistical analysis': ['statistical analysis', 'statistics', 'statistical test'],
  'experimental design': ['experimental design', 'randomized controlled trial', 'rct'],
  'survey': ['survey', 'questionnaire', 'interview'],
  'case study': ['case study', 'case studies'],
  'meta-analysis': ['meta-analysis', 'systematic review'],
  'simulation': ['simulation', 'monte carlo', 'modeling']
};

export class DataCleaner {
  /**
   * Strip HTML tags from text while preserving content
   */
  static stripHtml(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/<[^>]*>/g, '') // Remove HTML tags
      .replace(/&nbsp;/g, ' ') // Replace non-breaking spaces
      .replace(/&amp;/g, '&') // Replace HTML entities
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  /**
   * Normalize year to 4-digit number
   */
  static normalizeYear(year: any): number {
    if (!year) return new Date().getFullYear();
    
    const yearNum = typeof year === 'string' ? parseInt(year, 10) : year;
    
    if (isNaN(yearNum)) return new Date().getFullYear();
    
    // Handle 2-digit years
    if (yearNum < 100) {
      return yearNum < 50 ? 2000 + yearNum : 1900 + yearNum;
    }
    
    // Validate reasonable range
    if (yearNum < 1900 || yearNum > 2030) {
      return new Date().getFullYear();
    }
    
    return yearNum;
  }

  /**
   * Extract keywords from text, removing stopwords
   */
  static extractKeywords(text: string, minLength: number = 3): string[] {
    if (!text) return [];
    
    const words = text
      .toLowerCase()
      .replace(/[^\w\s-]/g, ' ') // Keep only alphanumeric, spaces, and hyphens
      .split(/\s+/)
      .filter(word => 
        word.length >= minLength && 
        !STOPWORDS.has(word) &&
        !/^\d+$/.test(word) // Exclude pure numbers
      );
    
    // Count frequency and return sorted by frequency
    const frequency: Record<string, number> = {};
    words.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    return Object.entries(frequency)
      .sort(([, a], [, b]) => b - a)
      .map(([word]) => word);
  }

  /**
   * Extract research methods from abstract using heuristic keyword matching
   */
  static extractMethods(abstract: string, explicitMethods?: string[]): string[] {
    const methods = new Set<string>();
    
    // Add explicit methods if provided (from Semantic Scholar)
    if (explicitMethods) {
      explicitMethods.forEach(method => methods.add(method.toLowerCase()));
    }
    
    if (!abstract) return Array.from(methods);
    
    const lowerAbstract = abstract.toLowerCase();
    
    // Check for method keywords
    Object.entries(METHOD_KEYWORDS).forEach(([method, keywords]) => {
      if (keywords.some(keyword => lowerAbstract.includes(keyword))) {
        methods.add(method);
      }
    });
    
    return Array.from(methods);
  }

  /**
   * Calculate similarity between two strings using token set ratio
   * Returns value between 0 and 1
   */
  static calculateSimilarity(str1: string, str2: string): number {
    if (!str1 || !str2) return 0;
    
    const normalize = (s: string) => s.toLowerCase().replace(/[^\w\s]/g, '').trim();
    const s1 = normalize(str1);
    const s2 = normalize(str2);
    
    if (s1 === s2) return 1;
    
    const tokens1 = new Set(s1.split(/\s+/));
    const tokens2 = new Set(s2.split(/\s+/));
    
    const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
    const union = new Set([...tokens1, ...tokens2]);
    
    return intersection.size / union.size;
  }

  /**
   * Clean and normalize a work object
   */
  static cleanWork(work: Partial<Work>): Work {
    return {
      title: this.stripHtml(work.title || ''),
      abstract: work.abstract ? this.stripHtml(work.abstract) : undefined,
      year: this.normalizeYear(work.year),
      doi: work.doi?.toLowerCase().trim(),
      concepts: work.concepts || [],
      citations: Math.max(0, work.citations || 0),
      methods: work.methods,
      fullTextUrl: work.fullTextUrl,
    };
  }

  /**
   * Clean and normalize a funding object
   */
  static cleanFunding(funding: Partial<Funding>): Funding {
    return {
      source: funding.source || '',
      title: this.stripHtml(funding.title || ''),
      abstractOrDesc: funding.abstractOrDesc ? this.stripHtml(funding.abstractOrDesc) : undefined,
      amount: funding.amount && funding.amount > 0 ? funding.amount : undefined,
      fiscalYear: funding.fiscalYear ? this.normalizeYear(funding.fiscalYear) : undefined,
      deadline: funding.deadline,
    };
  }
}

export class DataDeduplicator {
  /**
   * Deduplicate works using DOI as primary key and title similarity as secondary
   */
  static deduplicateWorks(works: Work[], similarityThreshold: number = 0.85): Work[] {
    const seen = new Map<string, Work>();
    const doiSeen = new Set<string>();
    
    for (const work of works) {
      // Primary deduplication by DOI
      if (work.doi) {
        const normalizedDoi = work.doi.toLowerCase().trim();
        if (doiSeen.has(normalizedDoi)) {
          continue; // Skip duplicate DOI
        }
        doiSeen.add(normalizedDoi);
        seen.set(normalizedDoi, work);
        continue;
      }
      
      // Secondary deduplication by title similarity
      let isDuplicate = false;
      for (const [key, existingWork] of seen.entries()) {
        const similarity = DataCleaner.calculateSimilarity(work.title, existingWork.title);
        if (similarity >= similarityThreshold) {
          // Keep the work with more citations or more complete data
          if (work.citations > existingWork.citations || 
              (work.citations === existingWork.citations && work.abstract && !existingWork.abstract)) {
            seen.set(key, work);
          }
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        // Use title hash as key for works without DOI
        const titleKey = `title_${work.title.toLowerCase().replace(/\s+/g, '_')}`;
        seen.set(titleKey, work);
      }
    }
    
    return Array.from(seen.values());
  }

  
  static deduplicateFunding(funding: Funding[], similarityThreshold: number = 0.85): Funding[] {
    const seen = new Map<string, Funding>();
    
    for (const fund of funding) {
      let isDuplicate = false;
      
      for (const [key, existingFund] of seen.entries()) {
        const similarity = DataCleaner.calculateSimilarity(fund.title, existingFund.title);
        if (similarity >= similarityThreshold) {
          if ((fund.amount && !existingFund.amount) || 
              (fund.deadline && !existingFund.deadline) ||
              (fund.abstractOrDesc && !existingFund.abstractOrDesc)) {
            seen.set(key, fund);
          }
          isDuplicate = true;
          break;
        }
      }
      
      if (!isDuplicate) {
        const titleKey = fund.title.toLowerCase().replace(/\s+/g, '_');
        seen.set(titleKey, fund);
      }
    }
    
    return Array.from(seen.values());
  }
}
