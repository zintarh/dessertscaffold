import { NextRequest } from 'next/server';
import { POST } from '@/app/api/evaluate-topic/route';

// Mock the dependencies
jest.mock('@/lib/services/orchestrator');
jest.mock('@/lib/services/openai-evaluator');
jest.mock('@/lib/utils/cache');

describe('/api/evaluate-topic', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.OPENAI_API_KEY = 'test-key';
    process.env.API_TIMEOUT = '8000';
    process.env.MAX_RETRIES = '2';
  });

  describe('POST', () => {
    it('should validate request body', async () => {
      const request = new NextRequest('http://localhost:3000/api/evaluate-topic', {
        method: 'POST',
        body: JSON.stringify({
          research_topic: 'ML', // Too short
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(400);
      
      const data = await response.json();
      expect(data.error).toBe('Invalid request format');
    });

    it('should accept valid request', async () => {
      const mockResult = {
        topic: 'Machine learning in agriculture',
        raw_data: {},
        evaluation: {
          novelty: { score: 8, justification: 'High novelty' },
          trends: { score: 7, justification: 'Growing trend' },
          methodological_complexity: { score: 6, justification: 'Moderate complexity' },
          research_gaps: { score: 5, justification: 'Some gaps' },
          grant_potential: { score: 8, justification: 'Good funding' },
          literature_availability: { score: 7, justification: 'Available literature' },
          overall_summary: 'Promising research area',
        },
        report: {
          htmlUrl: '/reports/test.html',
          pdfUrl: '/reports/test.pdf',
        },
      };

      // Mock orchestrator
      const { ResearchTopicOrchestrator } = require('@/lib/services/orchestrator');
      ResearchTopicOrchestrator.prototype.evaluateTopic = jest.fn().mockResolvedValue(mockResult);

      const request = new NextRequest('http://localhost:3000/api/evaluate-topic', {
        method: 'POST',
        body: JSON.stringify({
          research_topic: 'Machine learning in agriculture',
          additional_keywords: ['crop yield', 'precision farming'],
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(200);
      
      const data = await response.json();
      expect(data.topic).toBe('Machine learning in agriculture');
      expect(data.evaluation.novelty.score).toBe(8);
    });

    it('should handle missing environment variables', async () => {
      delete process.env.OPENAI_API_KEY;

      const request = new NextRequest('http://localhost:3000/api/evaluate-topic', {
        method: 'POST',
        body: JSON.stringify({
          research_topic: 'Machine learning in agriculture',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.error).toBe('Server configuration error');
    });

    it('should handle orchestrator errors', async () => {
      const { ResearchTopicOrchestrator } = require('@/lib/services/orchestrator');
      ResearchTopicOrchestrator.prototype.evaluateTopic = jest.fn().mockRejectedValue(
        new Error('API timeout')
      );

      const request = new NextRequest('http://localhost:3000/api/evaluate-topic', {
        method: 'POST',
        body: JSON.stringify({
          research_topic: 'Machine learning in agriculture',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.error).toBe('Internal server error');
    });

    it('should handle LLM validation errors', async () => {
      const { ResearchTopicOrchestrator } = require('@/lib/services/orchestrator');
      ResearchTopicOrchestrator.prototype.evaluateTopic = jest.fn().mockRejectedValue(
        new Error('OpenAI evaluation failed validation twice')
      );

      const request = new NextRequest('http://localhost:3000/api/evaluate-topic', {
        method: 'POST',
        body: JSON.stringify({
          research_topic: 'Machine learning in agriculture',
        }),
      });

      const response = await POST(request);
      expect(response.status).toBe(502);
      
      const data = await response.json();
      expect(data.error).toBe('Evaluation processing failed');
    });

    it('should set proper response headers', async () => {
      const mockResult = {
        topic: 'Machine learning in agriculture',
        raw_data: {},
        evaluation: {
          novelty: { score: 8, justification: 'High novelty' },
          trends: { score: 7, justification: 'Growing trend' },
          methodological_complexity: { score: 6, justification: 'Moderate complexity' },
          research_gaps: { score: 5, justification: 'Some gaps' },
          grant_potential: { score: 8, justification: 'Good funding' },
          literature_availability: { score: 7, justification: 'Available literature' },
          overall_summary: 'Promising research area',
        },
        report: {
          htmlUrl: '/reports/test.html',
          pdfUrl: '/reports/test.pdf',
        },
      };

      const { ResearchTopicOrchestrator } = require('@/lib/services/orchestrator');
      ResearchTopicOrchestrator.prototype.evaluateTopic = jest.fn().mockResolvedValue(mockResult);

      const request = new NextRequest('http://localhost:3000/api/evaluate-topic', {
        method: 'POST',
        body: JSON.stringify({
          research_topic: 'Machine learning in agriculture',
        }),
      });

      const response = await POST(request);
      
      expect(response.headers.get('Cache-Control')).toContain('public');
      expect(response.headers.get('X-Request-ID')).toBeTruthy();
    });
  });

  describe('Unsupported methods', () => {
    it('should return 405 for GET requests', async () => {
      const { GET } = require('@/app/api/evaluate-topic/route');
      const response = await GET();
      
      expect(response.status).toBe(405);
      const data = await response.json();
      expect(data.error).toBe('Method not allowed');
    });
  });
});
