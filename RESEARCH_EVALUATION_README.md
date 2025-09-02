# Research Topic Evaluation Orchestrator

A comprehensive Next.js application that evaluates research topics by querying multiple academic databases, analyzing data, and generating AI-powered assessments with detailed reports.

## Features

- **Multi-API Orchestration**: Parallel queries to 7+ academic and funding databases
- **AI-Powered Evaluation**: OpenAI GPT-4 analysis with strict JSON schema validation
- **Data Processing**: Cleaning, deduplication, and aggregation of research data
- **Report Generation**: HTML and PDF reports with charts and recommendations
- **Performance Optimized**: Caching, retry logic, and concurrent processing
- **Type-Safe**: Full TypeScript implementation with Zod validation
- **Modern UI**: React components with Jotai state management

## Architecture

### Data Sources
- **OpenAlex**: Global scholarly index for publication trends and citations
- **Semantic Scholar**: AI-powered research graph for methodology insights
- **CORE**: Open-access research aggregator
- **Crossref**: DOI registry for deduplication and metadata
- **NIH RePORTER**: US health research funding database
- **CORDIS**: EU Horizon funding programs
- **Grants.gov**: US government funding opportunities

### Core Components
- **API Orchestrator**: Manages parallel API calls with retry logic
- **Data Processor**: Cleans, deduplicates, and aggregates results
- **LLM Evaluator**: Generates structured assessments using OpenAI
- **Report Generator**: Creates HTML/PDF reports with visualizations
- **Cache Layer**: LRU cache with TTL for performance optimization

## Installation

1. **Clone and install dependencies**:
```bash
git clone <repository>
cd dissert-scaffold
npm install
```

2. **Set up environment variables**:
```bash
cp env.example .env.local
```

3. **Configure required API keys**:
```env
# Required
OPENAI_API_KEY=sk-your-openai-api-key-here

# Optional (for enhanced data)
CORE_API_KEY=your-core-api-key-here
```

4. **Create reports directory**:
```bash
mkdir -p public/reports
```

## Environment Variables

### Required
- `OPENAI_API_KEY`: OpenAI API key for evaluation generation

### Optional API Keys
- `CORE_API_KEY`: CORE API key for open-access research data

### Configuration (with defaults)
```env
# API Timeouts (milliseconds)
API_TIMEOUT=8000
OPENAI_TIMEOUT=30000

# Retry Configuration
MAX_RETRIES=2
RETRY_BASE_DELAY=1000

# Data Processing
SIMILARITY_THRESHOLD=0.85
MAX_WORKS_PER_PROVIDER=50
MAX_TOKENS_FOR_LLM=8000

# Caching
CACHE_TTL=21600  # 6 hours
CACHE_MAX_SIZE=100
```

## Usage

### Development
```bash
npm run dev
```

### Production
```bash
npm run build
npm start
```

### Testing
```bash
# Unit tests
npm test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e
```

## API Reference

### POST /api/evaluate-topic

Evaluates a research topic and returns comprehensive analysis.

**Request Body:**
```json
{
  "research_topic": "Machine learning in agriculture",
  "additional_keywords": ["crop yield prediction", "precision farming"]
}
```

**Response:**
```json
{
  "topic": "Machine learning in agriculture",
  "raw_data": {
    "openAlex": {...},
    "semanticScholar": {...},
    "core": {...},
    "crossref": {...},
    "nih": {...},
    "cordis": {...},
    "grants": {...}
  },
  "evaluation": {
    "novelty": { "score": 8, "justification": "..." },
    "trends": { "score": 7, "justification": "..." },
    "methodological_complexity": { "score": 6, "justification": "..." },
    "research_gaps": { "score": 5, "justification": "..." },
    "grant_potential": { "score": 8, "justification": "..." },
    "literature_availability": { "score": 7, "justification": "..." },
    "overall_summary": "..."
  },
  "report": {
    "htmlUrl": "/reports/eval_123.html",
    "pdfUrl": "/reports/eval_123.pdf"
  }
}
```

**Validation Rules:**
- `research_topic`: 3-200 characters, required
- `additional_keywords`: Array of 2-50 character strings, max 10 items, optional

## Frontend Usage

### Basic Implementation
```tsx
import { EvaluationForm } from '@/app/components/EvaluationForm';
import { EvaluationResults } from '@/app/components/EvaluationResults';

export default function Page() {
  return (
    <Provider>
      <EvaluationForm />
      <EvaluationResults />
    </Provider>
  );
}
```

### State Management
The system uses Jotai atoms for state management:

```tsx
import { useAtom } from 'jotai';
import { topicAtom, evaluateTopicAtom, resultAtom } from '@/lib/stores/evaluationStore';

function MyComponent() {
  const [topic, setTopic] = useAtom(topicAtom);
  const [, evaluate] = useAtom(evaluateTopicAtom);
  const [result] = useAtom(resultAtom);
  
  return (
    <div>
      <input value={topic} onChange={(e) => setTopic(e.target.value)} />
      <button onClick={evaluate}>Evaluate</button>
      {result && <div>Score: {result.evaluation.novelty.score}</div>}
    </div>
  );
}
```

## Performance Considerations

### Caching Strategy
- **In-Memory LRU Cache**: 6-hour TTL, 100 item limit
- **Client-Side Caching**: ETag and Cache-Control headers
- **Easy Redis Migration**: Swap cache adapter for production scaling

### Rate Limiting
- **Per-Provider Limits**: Configurable requests per second
- **Exponential Backoff**: Jittered retry delays
- **Circuit Breaker**: Graceful degradation on provider failures

### Optimization Features
- **Parallel API Calls**: All providers queried simultaneously
- **Data Truncation**: LLM input optimized for token limits
- **Deduplication**: DOI-based and similarity-based duplicate removal
- **Streaming**: Large responses handled efficiently

## Security

### API Key Management
- Environment variables only, never logged
- Separate keys per provider
- Optional key validation on startup

### Input Sanitization
- Zod schema validation
- HTML stripping from user content
- Query parameter sanitization
- Rate limiting per client

### Output Safety
- Structured JSON responses only
- No PII in logs or reports
- Safe URL generation for reports
- CORS configuration for production

## Error Handling

### Graceful Degradation
- **Provider Failures**: Continue with available data
- **Partial Results**: Generate evaluation with warnings
- **LLM Failures**: Automatic retry with error context
- **Timeout Handling**: Configurable timeouts per service

### Error Types
- **400**: Invalid request format or parameters
- **500**: Internal server error with request ID
- **502**: LLM evaluation failed after retries
- **504**: Request timeout

## Monitoring & Observability

### Structured Logging
```json
{
  "requestId": "req_123",
  "duration": 15420,
  "cacheHit": false,
  "totalWorks": 45,
  "providerTimings": {
    "openAlex": 2340,
    "semanticScholar": 3120,
    "openai": 8900
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Metrics Tracked
- Request duration and success rate
- Provider response times and failures
- Cache hit rates and performance
- LLM token usage and costs
- Data quality metrics

## Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Setup
- Set all required environment variables
- Ensure `/public/reports` directory exists
- Configure CORS for production domains
- Set up monitoring and alerting

## Development

### Project Structure
```
lib/
├── providers/          # API client implementations
├── services/           # Business logic orchestration
├── utils/              # Data processing utilities
├── stores/             # Frontend state management
└── types/              # TypeScript definitions

app/
├── api/evaluate-topic/ # Next.js API route
├── components/         # React UI components
└── research-evaluation/ # Main evaluation page

__tests__/
├── unit/               # Unit tests
├── integration/        # API integration tests
└── e2e/                # End-to-end tests
```

### Adding New Providers
1. Create client in `lib/providers/`
2. Add response schema to `lib/types/evaluation.ts`
3. Update orchestrator in `lib/services/orchestrator.ts`
4. Add processing logic for new data format
5. Update tests and documentation

### Customizing Evaluation Criteria
1. Modify `EvaluationSchema` in `lib/types/evaluation.ts`
2. Update LLM prompt in `lib/services/openai-evaluator.ts`
3. Adjust UI components in `app/components/`
4. Update report templates

## Troubleshooting

### Common Issues

**"OpenAI API key not found"**
- Ensure `OPENAI_API_KEY` is set in environment variables
- Check `.env.local` file exists and is properly formatted

**"Request timeout"**
- Increase `API_TIMEOUT` for slower networks
- Check provider API status pages
- Verify network connectivity

**"Evaluation failed validation"**
- Check OpenAI API quota and limits
- Verify model availability (`gpt-4-1106-preview`)
- Review LLM prompt for schema compliance

**"No results from providers"**
- Verify API keys for optional providers
- Check rate limiting and quotas
- Test individual provider endpoints

### Debug Mode
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-provider`
3. Add tests for new functionality
4. Ensure all tests pass: `npm test`
5. Submit pull request with detailed description

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
- Check troubleshooting section above
- Review test files for usage examples
- Open GitHub issue with reproduction steps
- Include relevant logs and configuration
