import { z } from 'zod';

// Request schemas
export const EvaluationRequestSchema = z.object({
  research_topic: z.string().min(3).max(200).trim(),
  additional_keywords: z.array(z.string().min(2).max(50)).max(10).optional(),
});

export type EvaluationRequest = z.infer<typeof EvaluationRequestSchema>;



// Core data types
export const WorkSchema = z.object({
  title: z.string(),
  abstract: z.string().optional(),
  year: z.number().int().min(1900).max(2030),
  doi: z.string().optional(),
  concepts: z.array(z.string()).default([]),
  citations: z.number().int().min(0).default(0),
  methods: z.array(z.string()).optional(),
  fullTextUrl: z.string().url().optional(),
});

export const FundingSchema = z.object({
  source: z.string(),
  title: z.string(),
  abstractOrDesc: z.string().optional(),
  amount: z.number().optional(),
  fiscalYear: z.number().int().optional(),
  deadline: z.string().optional(),
});

export type Work = z.infer<typeof WorkSchema>;
export type Funding = z.infer<typeof FundingSchema>;

// Provider response schemas
export const OpenAlexResponseSchema = z.object({
  results: z.array(z.object({
    title: z.string(),
    abstract: z.string().optional(),
    publication_year: z.number().optional(),
    cited_by_count: z.number().default(0),
    concepts: z.array(z.object({
      display_name: z.string(),
    })).default([]),
    ids: z.object({
      doi: z.string().optional(),
    }).optional(),
  })),
  meta: z.object({
    count: z.number(),
  }),
});

export const SemanticScholarResponseSchema = z.object({
  data: z.array(z.object({
    title: z.string(),
    abstract: z.string().optional(),
    year: z.number().optional(),
    citationCount: z.number().default(0),
    fieldsOfStudy: z.array(z.string()).optional(),
    externalIds: z.object({
      DOI: z.string().optional(),
    }).optional(),
  })),
  total: z.number(),
});

export const CoreResponseSchema = z.object({
  data: z.array(z.object({
    title: z.string(),
    abstract: z.string().optional(),
    yearPublished: z.number().optional(),
    downloadUrl: z.string().optional(),
    doi: z.string().optional(),
  })),
  totalHits: z.number(),
});

export const CrossrefResponseSchema = z.object({
  message: z.object({
    items: z.array(z.object({
      title: z.array(z.string()),
      abstract: z.string().optional(),
      published: z.object({
        'date-parts': z.array(z.array(z.number())),
      }).optional(),
      DOI: z.string().optional(),
      subject: z.array(z.string()).optional(),
    })),
    'total-results': z.number(),
  }),
});

export const NIHResponseSchema = z.object({
  results: z.array(z.object({
    project_title: z.string(),
    abstract_text: z.string().optional(),
    award_amount: z.number().optional(),
    fiscal_year: z.number().optional(),
  })),
  meta: z.object({
    total: z.number(),
  }),
});

export const CordisResponseSchema = z.object({
  results: z.array(z.object({
    title: z.string(),
    objective: z.string().optional(),
    call: z.object({
      deadline: z.string().optional(),
    }).optional(),
  })),
  total: z.number(),
});

export const GrantsGovResponseSchema = z.object({
  opportunitySynopsisDetail_1_0: z.array(z.object({
    opportunityTitle: z.string(),
    opportunityNumber: z.string(),
    closeDate: z.string().optional(),
    description: z.string().optional(),
  })),
});

// Aggregated data schema
export const AggregatedDataSchema = z.object({
  works: z.array(WorkSchema),
  funding: z.array(FundingSchema),
  trends: z.record(z.string(), z.number()), // year -> count
  methods: z.record(z.string(), z.number()), // method -> count
  openAccessRatio: z.number().min(0).max(1),
  totalWorks: z.number().int().min(0),
  totalFunding: z.number().min(0),
  activeCalls: z.number().int().min(0),
  avgCitations: z.number().min(0),
  topConcepts: z.array(z.object({
    name: z.string(),
    count: z.number(),
  })),
});

export type AggregatedData = z.infer<typeof AggregatedDataSchema>;

// LLM evaluation schema (strict contract) - matches the exact specification
export const EvaluationMetricSchema = z.object({
  score: z.number().int().min(0).max(10),
  justification: z.string().min(50).max(300),
});

export const EvaluationSchema = z.object({
  novelty: EvaluationMetricSchema,
  trends: EvaluationMetricSchema,
  methodological_complexity: EvaluationMetricSchema,
  research_gaps: EvaluationMetricSchema,
  grant_potential: EvaluationMetricSchema,
  literature_availability: EvaluationMetricSchema,
  overall_summary: z.string().min(200).max(1000),
});

export type Evaluation = z.infer<typeof EvaluationSchema>;

// Final API response schema
export const EvaluationResponseSchema = z.object({
  topic: z.string(),
  raw_data: z.object({
    openAlex: z.unknown(),
    semanticScholar: z.unknown(),
    core: z.unknown(),
    crossref: z.unknown(),
    nih: z.unknown(),
    cordis: z.unknown(),
    grants: z.unknown(),
  }),
  evaluation: EvaluationSchema,
  report: z.object({
    htmlUrl: z.string(),
    pdfUrl: z.string(),
  }),
});

export type EvaluationResponse = z.infer<typeof EvaluationResponseSchema>;

// Configuration schema
export const ConfigSchema = z.object({
  timeouts: z.object({
    default: z.number().default(8000),
    openai: z.number().default(30000),
  }),
  retries: z.object({
    maxRetries: z.number().default(2),
    baseDelay: z.number().default(1000),
  }),
  similarity: z.object({
    threshold: z.number().min(0).max(1).default(0.85),
  }),
  cache: z.object({
    ttl: z.number().default(21600), // 6 hours
    maxSize: z.number().default(100),
  }),
  limits: z.object({
    maxWorksPerProvider: z.number().default(50),
    maxTokensForLLM: z.number().default(8000),
  }),
});

export type Config = z.infer<typeof ConfigSchema>;
