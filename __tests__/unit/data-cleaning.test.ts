import { DataCleaner, DataDeduplicator } from '@/lib/utils/data-cleaning';
import { Work, Funding } from '@/lib/types/evaluation';

describe('DataCleaner', () => {
  describe('stripHtml', () => {
    it('should remove HTML tags', () => {
      const input = '<p>This is <strong>bold</strong> text</p>';
      const expected = 'This is bold text';
      expect(DataCleaner.stripHtml(input)).toBe(expected);
    });

    it('should replace HTML entities', () => {
      const input = 'Text with &amp; &lt; &gt; &quot; &#39; entities';
      const expected = 'Text with & < > " \' entities';
      expect(DataCleaner.stripHtml(input)).toBe(expected);
    });

    it('should normalize whitespace', () => {
      const input = '  Multiple   spaces   and\n\nnewlines  ';
      const expected = 'Multiple spaces and newlines';
      expect(DataCleaner.stripHtml(input)).toBe(expected);
    });

    it('should handle empty input', () => {
      expect(DataCleaner.stripHtml('')).toBe('');
      expect(DataCleaner.stripHtml(null as any)).toBe('');
      expect(DataCleaner.stripHtml(undefined as any)).toBe('');
    });
  });

  describe('normalizeYear', () => {
    it('should handle 4-digit years', () => {
      expect(DataCleaner.normalizeYear(2023)).toBe(2023);
      expect(DataCleaner.normalizeYear('2023')).toBe(2023);
    });

    it('should handle 2-digit years', () => {
      expect(DataCleaner.normalizeYear(23)).toBe(2023);
      expect(DataCleaner.normalizeYear(95)).toBe(1995);
    });

    it('should handle invalid years', () => {
      const currentYear = new Date().getFullYear();
      expect(DataCleaner.normalizeYear('invalid')).toBe(currentYear);
      expect(DataCleaner.normalizeYear(1800)).toBe(currentYear);
      expect(DataCleaner.normalizeYear(2050)).toBe(currentYear);
    });

    it('should handle null/undefined', () => {
      const currentYear = new Date().getFullYear();
      expect(DataCleaner.normalizeYear(null)).toBe(currentYear);
      expect(DataCleaner.normalizeYear(undefined)).toBe(currentYear);
    });
  });

  describe('extractKeywords', () => {
    it('should extract keywords and remove stopwords', () => {
      const text = 'Machine learning and artificial intelligence research using neural networks';
      const keywords = DataCleaner.extractKeywords(text);
      
      expect(keywords).toContain('machine');
      expect(keywords).toContain('learning');
      expect(keywords).toContain('artificial');
      expect(keywords).toContain('intelligence');
      expect(keywords).toContain('neural');
      expect(keywords).toContain('networks');
      
      // Should not contain stopwords
      expect(keywords).not.toContain('and');
      expect(keywords).not.toContain('using');
      expect(keywords).not.toContain('research');
    });

    it('should filter by minimum length', () => {
      const text = 'AI ML and machine learning';
      const keywords = DataCleaner.extractKeywords(text, 3);
      
      expect(keywords).toContain('machine');
      expect(keywords).toContain('learning');
      expect(keywords).not.toContain('ai');
      expect(keywords).not.toContain('ml');
    });

    it('should exclude pure numbers', () => {
      const text = 'Study 2023 with 100 participants and 50 controls';
      const keywords = DataCleaner.extractKeywords(text);
      
      expect(keywords).not.toContain('2023');
      expect(keywords).not.toContain('100');
      expect(keywords).not.toContain('50');
    });
  });

  describe('extractMethods', () => {
    it('should extract methods from abstract', () => {
      const abstract = 'We used machine learning and deep learning neural networks for classification';
      const methods = DataCleaner.extractMethods(abstract);
      
      expect(methods).toContain('machine learning');
      expect(methods).toContain('deep learning');
      expect(methods).toContain('classification');
    });

    it('should include explicit methods', () => {
      const abstract = 'Statistical analysis was performed';
      const explicitMethods = ['Random Forest', 'SVM'];
      const methods = DataCleaner.extractMethods(abstract, explicitMethods);
      
      expect(methods).toContain('random forest');
      expect(methods).toContain('svm');
      expect(methods).toContain('statistical analysis');
    });

    it('should handle empty abstract', () => {
      const methods = DataCleaner.extractMethods('');
      expect(methods).toEqual([]);
    });
  });

  describe('calculateSimilarity', () => {
    it('should return 1 for identical strings', () => {
      const str1 = 'Machine learning in agriculture';
      const str2 = 'Machine learning in agriculture';
      expect(DataCleaner.calculateSimilarity(str1, str2)).toBe(1);
    });

    it('should return high similarity for similar strings', () => {
      const str1 = 'Machine learning in agriculture';
      const str2 = 'Machine Learning in Agriculture: A Review';
      const similarity = DataCleaner.calculateSimilarity(str1, str2);
      expect(similarity).toBeGreaterThan(0.5);
    });

    it('should return low similarity for different strings', () => {
      const str1 = 'Machine learning in agriculture';
      const str2 = 'Quantum computing applications';
      const similarity = DataCleaner.calculateSimilarity(str1, str2);
      expect(similarity).toBeLessThan(0.3);
    });

    it('should handle empty strings', () => {
      expect(DataCleaner.calculateSimilarity('', 'test')).toBe(0);
      expect(DataCleaner.calculateSimilarity('test', '')).toBe(0);
      expect(DataCleaner.calculateSimilarity('', '')).toBe(0);
    });
  });

  describe('cleanWork', () => {
    it('should clean and normalize work data', () => {
      const rawWork = {
        title: '<p>Machine Learning <strong>Study</strong></p>',
        abstract: 'This is an abstract with &amp; entities',
        year: '2023',
        doi: '10.1000/TEST',
        concepts: ['AI', 'ML'],
        citations: '50',
      };

      const cleaned = DataCleaner.cleanWork(rawWork);

      expect(cleaned.title).toBe('Machine Learning Study');
      expect(cleaned.abstract).toBe('This is an abstract with & entities');
      expect(cleaned.year).toBe(2023);
      expect(cleaned.doi).toBe('10.1000/test');
      expect(cleaned.citations).toBe(50);
    });

    it('should handle missing fields', () => {
      const rawWork = { title: 'Test Title' };
      const cleaned = DataCleaner.cleanWork(rawWork);

      expect(cleaned.title).toBe('Test Title');
      expect(cleaned.abstract).toBeUndefined();
      expect(cleaned.year).toBe(new Date().getFullYear());
      expect(cleaned.citations).toBe(0);
    });
  });
});

describe('DataDeduplicator', () => {
  describe('deduplicateWorks', () => {
    it('should deduplicate by DOI', () => {
      const works: Work[] = [
        {
          title: 'Paper 1',
          year: 2023,
          doi: '10.1000/test1',
          concepts: [],
          citations: 10,
        },
        {
          title: 'Paper 1 (Different Title)',
          year: 2023,
          doi: '10.1000/test1',
          concepts: [],
          citations: 15,
        },
      ];

      const deduplicated = DataDeduplicator.deduplicateWorks(works);
      expect(deduplicated).toHaveLength(1);
      expect(deduplicated[0].doi).toBe('10.1000/test1');
    });

    it('should deduplicate by title similarity', () => {
      const works: Work[] = [
        {
          title: 'Machine Learning in Agriculture',
          year: 2023,
          concepts: [],
          citations: 10,
        },
        {
          title: 'Machine Learning in Agriculture: A Review',
          year: 2023,
          concepts: [],
          citations: 5,
        },
      ];

      const deduplicated = DataDeduplicator.deduplicateWorks(works, 0.7);
      expect(deduplicated).toHaveLength(1);
      expect(deduplicated[0].citations).toBe(10); // Should keep higher citation count
    });

    it('should keep works below similarity threshold', () => {
      const works: Work[] = [
        {
          title: 'Machine Learning in Agriculture',
          year: 2023,
          concepts: [],
          citations: 10,
        },
        {
          title: 'Quantum Computing Applications',
          year: 2023,
          concepts: [],
          citations: 5,
        },
      ];

      const deduplicated = DataDeduplicator.deduplicateWorks(works, 0.85);
      expect(deduplicated).toHaveLength(2);
    });
  });

  describe('deduplicateFunding', () => {
    it('should deduplicate funding by title similarity', () => {
      const funding: Funding[] = [
        {
          source: 'NIH',
          title: 'AI Research Grant',
          amount: 100000,
        },
        {
          source: 'NSF',
          title: 'AI Research Grant Program',
          amount: 150000,
        },
      ];

      const deduplicated = DataDeduplicator.deduplicateFunding(funding, 0.7);
      expect(deduplicated).toHaveLength(1);
      expect(deduplicated[0].amount).toBe(150000); // Should keep more complete info
    });

    it('should keep different funding opportunities', () => {
      const funding: Funding[] = [
        {
          source: 'NIH',
          title: 'AI Research Grant',
          amount: 100000,
        },
        {
          source: 'NSF',
          title: 'Quantum Computing Grant',
          amount: 150000,
        },
      ];

      const deduplicated = DataDeduplicator.deduplicateFunding(funding, 0.85);
      expect(deduplicated).toHaveLength(2);
    });
  });
});
