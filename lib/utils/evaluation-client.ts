/**
 * Evaluation Client Utility
 * 
 * Provides a simple interface to test the comprehensive evaluation function
 * and demonstrates the expected input/output format.
 */

export interface EvaluationRequest {
  research_topic: string;
  additional_keywords?: string[];
}

export interface EvaluationResponse {
  success: boolean;
  requestId: string;
  evaluation: {
    novelty: { score: number; justification: string };
    trends: { score: number; justification: string };
    methodological_complexity: { score: number; justification: string };
    research_gaps: { score: number; justification: string };
    grant_potential: { score: number; justification: string };
    literature_availability: { score: number; justification: string };
    overall_summary: string;
  };
  metadata: {
    topic: string;
    keywords?: string[];
    evaluationTime: number;
    timestamp: string;
  };
}

/**
 * Test the comprehensive evaluation function
 */
export async function testEvaluation(
  request: EvaluationRequest
): Promise<EvaluationResponse> {
  try {
    const response = await fetch('/api/evaluate-research', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Evaluation failed: ${errorData.error} - ${errorData.details}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Evaluation request failed:', error);
    throw error;
  }
}

/**
 * Example evaluation requests for testing
 */
export const exampleRequests: EvaluationRequest[] = [
  {
    research_topic: "Machine learning in agriculture",
    additional_keywords: ["crop yield prediction", "precision farming", "sustainable agriculture"]
  },
  {
    research_topic: "Quantum computing applications in cryptography",
    additional_keywords: ["post-quantum cryptography", "quantum-resistant algorithms"]
  },
  {
    research_topic: "Blockchain technology in supply chain management",
    additional_keywords: ["traceability", "transparency", "smart contracts"]
  },
  {
    research_topic: "Artificial intelligence in healthcare diagnostics",
    additional_keywords: ["medical imaging", "disease detection", "clinical decision support"]
  },
  {
    research_topic: "Renewable energy integration in smart grids",
    additional_keywords: ["energy storage", "grid stability", "demand response"]
  }
];

/**
 * Run a batch of example evaluations
 */
export async function runExampleEvaluations(): Promise<void> {
  console.log('Starting batch evaluation of example research topics...');
  
  for (const request of exampleRequests) {
    try {
      console.log(`\nEvaluating: ${request.research_topic}`);
      const startTime = Date.now();
      
      const result = await testEvaluation(request);
      
      const duration = Date.now() - startTime;
      console.log(`✅ Completed in ${duration}ms`);
      console.log(`Overall Score: ${Math.round(
        (result.evaluation.novelty.score + 
         result.evaluation.trends.score + 
         result.evaluation.methodological_complexity.score + 
         result.evaluation.research_gaps.score + 
         result.evaluation.grant_potential.score + 
         result.evaluation.literature_availability.score) / 6
      )}/10`);
      console.log(`Summary: ${result.evaluation.overall_summary.substring(0, 100)}...`);
      
    } catch (error) {
      console.error(`❌ Failed to evaluate "${request.research_topic}":`, error);
    }
  }
  
  console.log('\nBatch evaluation completed!');
}

/**
 * Validate evaluation response format
 */
export function validateEvaluationResponse(response: any): response is EvaluationResponse {
  if (!response || typeof response !== 'object') return false;
  if (typeof response.success !== 'boolean') return false;
  if (typeof response.requestId !== 'string') return false;
  if (!response.evaluation || typeof response.evaluation !== 'object') return false;
  
  const requiredMetrics = [
    'novelty', 'trends', 'methodological_complexity', 
    'research_gaps', 'grant_potential', 'literature_availability'
  ];
  
  for (const metric of requiredMetrics) {
    if (!response.evaluation[metric]) return false;
    if (typeof response.evaluation[metric].score !== 'number') return false;
    if (typeof response.evaluation[metric].justification !== 'string') return false;
    if (response.evaluation[metric].score < 0 || response.evaluation[metric].score > 10) return false;
  }
  
  if (typeof response.evaluation.overall_summary !== 'string') return false;
  if (!response.metadata || typeof response.metadata !== 'object') return false;
  
  return true;
}
