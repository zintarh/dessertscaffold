import OpenAI from "openai";
import {
  EvaluationSchema,
  Evaluation,
  AggregatedData,
} from "../types/evaluation";
import { DataAggregator } from "../utils/aggregation";

export class OpenAIEvaluator {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = "gpt-4o") {
    this.client = new OpenAI({ apiKey });
    this.model = model;
  }

  async evaluateTopic(
    researchTopic: string,
    aggregatedData: AggregatedData,
    maxTokens: number = 8000
  ): Promise<Evaluation> {
    const preparedData = DataAggregator.prepareForLLM(
      aggregatedData,
      maxTokens
    );

    try {
      const evaluation = await this.callOpenAI(researchTopic, preparedData);
      return this.validateAndParseEvaluation(evaluation);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.warn("🔄 Retrying evaluation after validation error...");
        try {
          const evaluation = await this.callOpenAI(
            researchTopic,
            preparedData,
            error.message
          );
          return this.validateAndParseEvaluation(evaluation);
        } catch (secondError) {
          if (secondError instanceof ValidationError) {
            throw new Error(
              `OpenAI evaluation failed validation twice: ${secondError.message}`
            );
          }
          throw secondError;
        }
      }
      throw error;
    }
  }

  private async callOpenAI(
    researchTopic: string,
    aggregatedData: any,
    validationError?: string
  ): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: this.buildSystemMessage() },
        {
          role: "user",
          content: this.buildUserMessage(
            researchTopic,
            aggregatedData,
            validationError
          ),
        },
      ],
      temperature: 0,
      max_tokens: 2000,
      response_format: { type: "json_object" },
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("OpenAI returned empty response");
    }

    return content;
  }

  /**
   * Build system message for 6 metrics evaluation
   */
  private buildSystemMessage(): string {
    return `You are an expert academic evaluator specializing in research methodology and funding analysis. Your task is to evaluate research topics across six key academic metrics and provide a comprehensive, data-driven analysis suitable for dissertation-level research.

CRITICAL REQUIREMENTS:
1. Use specific numbers, statistics, and citations from the provided data
2. Reference specific papers by title and citation count when available
3. Include exact funding amounts and sources
4. Mention specific research methods and their frequency
5. Reference concrete publication trends and years
6. Provide detailed justifications with quantitative evidence
7. Make the analysis suitable for academic reports and grant applications

IMPORTANT: Output ONLY valid JSON matching the exact schema provided. Do not include explanations, markdown, or any text outside the JSON object.`;
  }

  /**
   * Build user message with prompt for 6 academic metrics
   */
  private buildUserMessage(
    researchTopic: string,
    aggregatedData: any,
    validationError?: string
  ): string {
    let message = `Evaluate the research topic "${researchTopic}" for dissertation-level research using the comprehensive data below.

SCORING GUIDELINES (0-10 scale):
- 0-3: Poor/Insufficient evidence
- 4-6: Moderate/Some evidence  
- 7-8: Good/Strong evidence
- 9-10: Excellent/Outstanding evidence

For each metric, provide:
1. A score (0-10)
2. A detailed justification (3-4 sentences) that includes:
   - Specific numbers and statistics from the data
   - References to top-cited papers by title and citation count
   - Exact funding amounts and sources
   - Specific research methods and their frequency
   - Concrete publication trends and years
   - Quantitative evidence supporting your assessment

EVALUATION METRICS:

1. NOVELTY: How innovative and original is this research topic?
   - Consider: citation patterns, recent vs. older papers, emerging concepts
   - Reference: topCitedPapers, recentPapers, conceptTrends data

2. TRENDS: What are the publication and research trends?
   - Consider: publication counts by year, concept trends, method evolution
   - Reference: trends data, conceptTrends, recentPapers

3. METHODOLOGICAL_COMPLEXITY: How sophisticated are the research methods?
   - Consider: method diversity, technical complexity, methodological innovation
   - Reference: methodDistribution, methods data, topCitedPapers

4. RESEARCH_GAPS: What gaps exist in current literature?
   - Consider: understudied areas, missing methods, unexplored connections
   - Reference: conceptTrends, methods data, literature coverage

5. GRANT_POTENTIAL: How likely is this topic to receive funding?
   - Consider: available funding, funding amounts, active calls
   - Reference: topFundingOpportunities, totalFunding, activeCalls

6. LITERATURE_AVAILABILITY: How much relevant literature exists?
   - Consider: total papers, open access ratio, citation patterns
   - Reference: totalWorks, openAccessRatio, avgCitations, topCitedPapers

COMPREHENSIVE DATA:
${JSON.stringify(aggregatedData, null, 2)}

Return ONLY valid JSON in this exact schema (no code fences, no additional text):
{
  "novelty": { "score": 0, "justification": "Detailed justification with specific data points, paper titles, citation counts, and quantitative evidence..." },
  "trends": { "score": 0, "justification": "Detailed justification with specific data points, paper titles, citation counts, and quantitative evidence..." },
  "methodological_complexity": { "score": 0, "justification": "Detailed justification with specific data points, paper titles, citation counts, and quantitative evidence..." },
  "research_gaps": { "score": 0, "justification": "Detailed justification with specific data points, paper titles, citation counts, and quantitative evidence..." },
  "grant_potential": { "score": 0, "justification": "Detailed justification with specific data points, paper titles, citation counts, and quantitative evidence..." },
  "literature_availability": { "score": 0, "justification": "Detailed justification with specific data points, paper titles, citation counts, and quantitative evidence..." },
  "overall_summary": "Comprehensive 4-5 sentence summary synthesizing all findings with specific data points, key papers, funding opportunities, and research recommendations..."
}`;

    if (validationError) {
      message += `\n\nIMPORTANT: Your previous response failed validation with this error: "${validationError}". Please ensure your JSON strictly follows the schema above.`;
    }

    return message;
  }

  /**
   * Validate and parse evaluation response
   */
  private validateAndParseEvaluation(response: string): Evaluation {
    try {
      const cleanedResponse = response
        .replace(/```json\s*/g, "")
        .replace(/```\s*/g, "")
        .trim();

      const parsed = JSON.parse(cleanedResponse);
      return EvaluationSchema.parse(parsed);
    } catch (error: any) {
      if (error instanceof SyntaxError) {
        throw new ValidationError(`Invalid JSON: ${error.message}`);
      }

      if (error.name === "ZodError") {
        const zodError = error as any;
        const errorMessages = zodError.errors
          .map((e: any) => `${e.path.join(".")}: ${e.message}`)
          .join(", ");
        throw new ValidationError(`Schema validation failed: ${errorMessages}`);
      }

      throw new ValidationError(`Evaluation parsing failed: ${error.message}`);
    }
  }

  /**
   * Generate evaluation with empty data for fallback
   */
  async evaluateWithEmptyData(researchTopic: string): Promise<Evaluation> {
    return this.evaluateTopic(researchTopic, {
      works: [],
      funding: [],
      trends: {},
      methods: {},
      openAccessRatio: 0,
      totalWorks: 0,
      totalFunding: 0,
      activeCalls: 0,
      avgCitations: 0,
      topConcepts: [],
    });
  }
}

/**
 * Custom error class for validation failures
 */
class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

/**
 * Factory function to create OpenAI evaluator
 */
export function createOpenAIEvaluator(): OpenAIEvaluator {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4o";
  return new OpenAIEvaluator(apiKey, model);
}
