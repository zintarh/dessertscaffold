import { NextRequest, NextResponse } from 'next/server';
import { EvaluationRequestSchema, ConfigSchema } from '@/lib/types/evaluation';
import { ResearchTopicOrchestrator } from '@/lib/services/orchestrator';
import { createOpenAIEvaluator } from '@/lib/services/openai-evaluator';
import { ReportGenerator } from '@/lib/utils/report-generator';
import { getCacheInstance } from '@/lib/utils/cache';
import path from 'path';

/**
 * POST /api/evaluate-topic
 * 
 * Research topic evaluation API endpoint that accepts a topic and optional keywords,
 * orchestrates parallel API calls, processes data, performs LLM evaluation,
 * and returns structured JSON with HTML/PDF report links.
 */

// Initialize services (singleton pattern for performance)


let orchestrator: ResearchTopicOrchestrator | null = null;

function getOrchestrator(): ResearchTopicOrchestrator {
  if (!orchestrator) {
    // Load configuration from environment
    const config = ConfigSchema.parse({
      timeouts: {
        default: parseInt(process.env.API_TIMEOUT || '8000'),
        openai: parseInt(process.env.OPENAI_TIMEOUT || '30000'),
      },
      retries: {
        maxRetries: parseInt(process.env.MAX_RETRIES || '2'),
        baseDelay: parseInt(process.env.RETRY_BASE_DELAY || '1000'),
      },
      similarity: {
        threshold: parseFloat(process.env.SIMILARITY_THRESHOLD || '0.85'),
      },
      cache: {
        ttl: parseInt(process.env.CACHE_TTL || '21600'),
        maxSize: parseInt(process.env.CACHE_MAX_SIZE || '100'),
      },
      limits: {
        maxWorksPerProvider: parseInt(process.env.MAX_WORKS_PER_PROVIDER || '50'),
        maxTokensForLLM: parseInt(process.env.MAX_TOKENS_FOR_LLM || '8000'),
      },
    });

    const cache = getCacheInstance();
    const reportsDir = path.join(process.cwd(), 'public', 'reports');
    const reportGenerator = new ReportGenerator(reportsDir);
    const openaiEvaluator = createOpenAIEvaluator();

    orchestrator = new ResearchTopicOrchestrator(
      config,
      cache,
      reportGenerator,
      openaiEvaluator
    );
  }

  return orchestrator;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = EvaluationRequestSchema.parse(body);

    // Log request
    console.log('Research evaluation request:', {
      requestId,
      topic: validatedRequest.research_topic,
      keywords: validatedRequest.additional_keywords,
      timestamp: new Date().toISOString(),
    });

    // Validate required environment variables
    const requiredEnvVars = ['OPENAI_API_KEY'];
    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return NextResponse.json(
        { 
          error: 'Server configuration error',
          details: `Missing required environment variables: ${missingVars.join(', ')}`,
          requestId 
        },
        { status: 500 }
      );
    }

    // Execute evaluation
    const orchestrator = getOrchestrator();
    const result = await orchestrator.evaluateTopic(validatedRequest);

    // Log successful response
    const duration = Date.now() - startTime;
    console.log('Research evaluation completed:', {
      requestId,
      duration,
      totalWorks: result.evaluation ? 'success' : 'unknown',
      timestamp: new Date().toISOString(),
    });

    // Return response with caching headers
    const response = NextResponse.json(result);
    
    // Add caching headers for client-side caching
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    response.headers.set('ETag', `"${requestId}"`);
    response.headers.set('X-Request-ID', requestId);
    
    return response;

  } catch (error) {
    const duration = Date.now() - startTime;
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ZodError') {
      const zodError = error as any;
      const errorMessages = zodError.errors.map((e: any) => 
        `${e.path.join('.')}: ${e.message}`
      ).join(', ');
      
      console.warn('Request validation failed:', {
        requestId,
        duration,
        errors: errorMessages,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          error: 'Invalid request format',
          details: errorMessages,
          requestId 
        },
        { status: 400 }
      );
    }

    // Handle specific error types
    if (error instanceof Error && error.message.includes('OpenAI evaluation failed validation twice')) {
      console.error('LLM evaluation failed:', {
        requestId,
        duration,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          error: 'Evaluation processing failed',
          details: 'Unable to generate valid evaluation after multiple attempts',
          requestId 
        },
        { status: 502 }
      );
    }

    // Handle timeout errors
    if (error instanceof Error && error.message.includes('timeout')) {
      console.error('Request timeout:', {
        requestId,
        duration,
        error: error.message,
        timestamp: new Date().toISOString(),
      });

      return NextResponse.json(
        { 
          error: 'Request timeout',
          details: 'The evaluation took too long to complete. Please try again.',
          requestId 
        },
        { status: 504 }
      );
    }

    // Handle general errors
    console.error('Research evaluation error:', {
      requestId,
      duration,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: 'An unexpected error occurred during evaluation',
        requestId 
      },
      { status: 500 }
    );
  }
}

// Handle unsupported methods
export async function GET() {
  return NextResponse.json(
    { 
      error: 'Method not allowed',
      details: 'This endpoint only accepts POST requests',
      usage: {
        method: 'POST',
        endpoint: '/api/evaluate-topic',
        body: {
          research_topic: 'string (3-200 chars)',
          additional_keywords: 'string[] (optional, max 10 items)'
        }
      }
    },
    { status: 405 }
  );
}

export async function PUT() {
  return GET();
}

export async function DELETE() {
  return GET();
}

export async function PATCH() {
  return GET();
}
