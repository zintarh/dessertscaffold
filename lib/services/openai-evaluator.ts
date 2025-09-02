import OpenAI from "openai";
import {
  EvaluationSchema,
  Evaluation,
  AggregatedData,
} from "../types/evaluation";
import { DataAggregator } from "../utils/aggregation";

/**
 * OpenAI integration for research topic evaluation with strict JSON schema validation
 * Uses GPT-4 with temperature 0 for consistent, structured evaluation outputs
 */

export class OpenAIEvaluator {
  private client: OpenAI;
  private model: string;

  constructor(apiKey: string, model: string = "gpt-4-1106-preview") {
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
      // First attempt
      const evaluation = await this.callOpenAI(researchTopic, preparedData);
      return this.validateAndParseEvaluation(evaluation);
    } catch (error) {
      if (error instanceof ValidationError) {
        console.warn(
          "First evaluation attempt failed validation, retrying...",
          error.message
        );

        // Second attempt with validation error context
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

  /**
   * Call OpenAI API with structured prompt
   */
  private async callOpenAI(
    researchTopic: string,
    aggregatedData: any,
    validationError?: string
  ): Promise<string> {
    const systemMessage = this.buildSystemMessage();
    const userMessage = this.buildUserMessage(
      researchTopic,
      aggregatedData,
      validationError
    );

    const response = await this.client.chat.completions.create({
      model: this.model,
      messages: [
        { role: "system", content: systemMessage },
        { role: "user", content: userMessage },
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
   * Build system message for OpenAI
   */
  private buildSystemMessage(): string {
    return `You are an expert academic evaluator specializing in research methodology and funding analysis. Your task is to evaluate research topics across six key academic metrics and provide a comprehensive analysis suitable for dissertation-level research (2000+ words expected).

IMPORTANT: Output ONLY valid JSON matching the exact schema provided. Do not include explanations, markdown, or any text outside the JSON object.`;
  }

  /**
   * Build user message with exact prompt format for the six academic metrics
   */
  private buildUserMessage(
    researchTopic: string,
    aggregatedData: any,
    validationError?: string
  ): string {
    let message = `Evaluate the research topic "${researchTopic}" for dissertation-level research (2000+ words expected) using the aggregated data below.

Score each of the six academic metrics from 0-10 and provide a detailed justification (2-3 sentences) for each score using specific evidence from the data. Then provide a comprehensive overall_summary that synthesizes the findings.

Aggregated Data:
${JSON.stringify(aggregatedData, null, 2)}

Return ONLY valid JSON in this exact schema (no code fences, no additional text):
{
  "novelty": { "score": 0, "justification": "..." },
  "trends": { "score": 0, "justification": "..." },
  "methodological_complexity": { "score": 0, "justification": "..." },
  "research_gaps": { "score": 0, "justification": "..." },
  "grant_potential": { "score": 0, "justification": "..." },
  "literature_availability": { "score": 0, "justification": "..." },
  "overall_summary": "..."
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
      // Clean response (remove code fences if present)
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
   * Generate evaluation with empty data stub for cases with no results
   */
  async evaluateWithEmptyData(researchTopic: string): Promise<Evaluation> {
    const emptyData = {
      summary: {
        totalWorks: 0,
        totalFunding: 0,
        activeCalls: 0,
        avgCitations: 0,
        openAccessRatio: 0,
        trends: {},
        topMethods: {},
        topConcepts: [],
      },
      sampleWorks: [],
      sampleFunding: [],
      metadata: {
        totalWorksInSample: 0,
        totalFundingInSample: 0,
        estimatedTokens: 100,
      },
    };

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
 * Factory function to create OpenAI evaluator with environment configuration
 */
export function createOpenAIEvaluator(): OpenAIEvaluator {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is required");
  }

  const model = process.env.OPENAI_MODEL || "gpt-4-1106-preview";
  return new OpenAIEvaluator(apiKey, model);
}
