import { NextRequest, NextResponse } from 'next/server';
import { EvaluationRequestSchema } from '@/lib/types/evaluation';
import { ComprehensiveEvaluator } from '@/lib/services/comprehensive-evaluator';


export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    // Parse and validate request body
    const body = await request.json();
    const validatedRequest = EvaluationRequestSchema.parse(body);

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

    const evaluator = new ComprehensiveEvaluator(process.env.OPENAI_API_KEY!);

    console.log('evaluator request:', evaluator);

    const evaluation = await evaluator.evaluateResearchTopic(validatedRequest);

    // Log successful response
    const duration = Date.now() - startTime;
 

    // Return the evaluation in the exact format specified
    const response = NextResponse.json({
      success: true,
      requestId,
      evaluation,
      metadata: {
        topic: validatedRequest.research_topic,
        keywords: validatedRequest.additional_keywords,
        evaluationTime: duration,
        timestamp: new Date().toISOString(),
      }
    });
    
    // Add caching headers
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
    response.headers.set('ETag', `"${requestId}"`);
    response.headers.set('X-Request-ID', requestId);
    
    return response;

  } catch (error: any) {
    const duration = Date.now() - startTime;
    
    // Handle validation errors
    if (error.name === 'ZodError') {
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
    if (error.message.includes('OpenAI evaluation failed validation twice')) {
     

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
    if (error.message.includes('timeout')) {
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
      error: error.message,
      stack: error.stack,
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
        endpoint: '/api/evaluate-research',
        body: {
          research_topic: 'string (3-200 chars) - e.g., "Machine learning in agriculture"',
          additional_keywords: 'string[] (optional, max 10 items) - e.g., ["crop yield prediction", "precision farming"]'
        },
        response: {
          success: 'boolean',
          requestId: 'string',
          evaluation: {
            novelty: { score: 'number (0-10)', justification: 'string' },
            trends: { score: 'number (0-10)', justification: 'string' },
            methodological_complexity: { score: 'number (0-10)', justification: 'string' },
            research_gaps: { score: 'number (0-10)', justification: 'string' },
            grant_potential: { score: 'number (0-10)', justification: 'string' },
            literature_availability: { score: 'number (0-10)', justification: 'string' },
            overall_summary: 'string'
          },
          metadata: {
            topic: 'string',
            keywords: 'string[]',
            evaluationTime: 'number (ms)',
            timestamp: 'string'
          }
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
