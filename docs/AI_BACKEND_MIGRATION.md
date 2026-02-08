# AI Backend Migration to Next.js TypeScript

This document describes the migration of the AI backend from Python (FastAPI) to TypeScript in Next.js API routes.

## Migration Overview

All AI backend functionality has been migrated from `quizitnow-ai-backend` (Python) to `quizitnow-web` (TypeScript/Next.js).

### Migrated Components

#### 1. **Quiz Generation API**

- **Python**: `app/routers/generate_quiz.py`
- **TypeScript**: `app/api/quiz/generate/route.ts`
- **Features**:
    - Ollama LLM integration with LangChain
    - Multiple question types (MCQ, True/False, Fill-in-the-blank)
    - Configurable difficulty levels (Easy, Medium, Hard, God Mode)
    - Automatic retry logic (3 attempts)
    - JSON response parsing and validation
    - Quiz storage in MongoDB

#### 2. **Models API**

- **Python**: `app/routers/get_available_models.py`
- **TypeScript**: `app/api/models/route.ts`
- **Features**:
    - List all available Ollama models
    - Direct integration with Ollama

#### 3. **Audio Transcription API**

- **Python**: `app/routers/transcribe_audio.py`
- **TypeScript**: `app/api/audio/transcribe/route.ts`
- **Features**:
    - Audio-to-text transcription
    - OpenAI Whisper API integration
    - File upload support

## New Files Created

### Type Definitions

- `lib/types/quiz.ts` - Quiz-related TypeScript interfaces

### API Utilities

- `lib/utils/api-response.ts` - Standardized API response formatting
- `lib/ai/ollama.ts` - Ollama LLM initialization and prompt templates
- `lib/ai/ollama-models.ts` - Ollama model management functions
- `lib/ai/quiz-generator.ts` - Quiz generation logic and JSON parsing
- `lib/ai/audio-transcription.ts` - Audio transcription utilities

### API Routes

- `app/api/quiz/generate/route.ts` - Quiz generation endpoint (updated)
- `app/api/models/route.ts` - Models listing endpoint (updated)
- `app/api/audio/transcribe/route.ts` - Audio transcription endpoint (new)

## Dependencies Added

```bash
pnpm add ollama langchain @langchain/community @langchain/ollama whisper-node
```

### Key Dependencies:

- **ollama** (v0.6.3) - Ollama client for TypeScript
- **langchain** (v1.2.18) - LangChain framework
- **@langchain/community** (v1.1.12) - LangChain community integrations
- **@langchain/ollama** (v1.2.2) - LangChain Ollama integration
- **whisper-node** (v1.1.1) - Whisper integration (optional)

## Environment Variables

Add the following to your `.env.local` file:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434

# OpenAI API (for audio transcription)
OPENAI_API_KEY=your_openai_api_key_here
```

## Configuration Files Updated

- `env.ts` - Added `OLLAMA_BASE_URL` and `OPENAI_API_KEY` environment variables

## Setup Instructions

### 1. Install Ollama

If you haven't already, install Ollama on your system:

```bash
# macOS
brew install ollama

# Linux
curl -fsSL https://ollama.com/install.sh | sh

# Windows
# Download from https://ollama.com
```

### 2. Start Ollama Service

```bash
ollama serve
```

### 3. Pull Required Models

```bash
# Pull llama3.2 (default model)
ollama pull llama3.2

# Or pull other models as needed
ollama pull llama2
ollama pull mistral
```

### 4. Install Dependencies

```bash
cd quizitnow-web
pnpm install
```

### 5. Configure Environment Variables

Create or update `.env.local`:

```env
OLLAMA_BASE_URL=http://localhost:11434
OPENAI_API_KEY=your_api_key_here  # Optional: for audio transcription
```

### 6. Start Development Server

```bash
pnpm dev
```

## API Endpoints

### Quiz Generation

```http
POST /api/quiz/generate
Content-Type: application/json

{
  "userId": "user_id",
  "input": "Your text content here...",
  "inputType": "text",
  "numberOfQuestions": 5,
  "model": "llama3.2",
  "difficulty": "Medium"
}
```

### List Models

```http
GET /api/models
```

### Transcribe Audio

```http
POST /api/audio/transcribe
Content-Type: multipart/form-data

file: <audio_file>
```

## Migration Benefits

1. **Simplified Architecture**: Single codebase in TypeScript
2. **Type Safety**: Full TypeScript support with proper type definitions
3. **Better Integration**: Direct integration with Next.js ecosystem
4. **Improved Performance**: No need for external HTTP calls between services
5. **Easier Deployment**: Single deployment instead of multiple services
6. **Maintainability**: Unified codebase is easier to maintain

## Breaking Changes

### API Response Format

The API response format remains consistent with the previous version:

```typescript
{
    success: boolean;
    statusCode: number;
    message: string;
    data: any | null;
    error: {
        code: number | null;
        message: string | null;
    }
    timestamp: string;
}
```

### Audio Transcription

- Now uses OpenAI Whisper API instead of local Whisper
- Requires `OPENAI_API_KEY` environment variable

## Troubleshooting

### Ollama Connection Issues

- Ensure Ollama service is running: `ollama serve`
- Check Ollama is accessible: `curl http://localhost:11434`
- Verify `OLLAMA_BASE_URL` is correctly set

### Model Not Found

- Pull the required model: `ollama pull llama3.2`
- List available models: `ollama list`

### Audio Transcription Errors

- Ensure `OPENAI_API_KEY` is set
- Check OpenAI API quota and permissions

## Testing

Test the endpoints using the following:

```bash
# Test models endpoint
curl http://localhost:3000/api/models

# Test quiz generation
curl -X POST http://localhost:3000/api/quiz/generate \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test_user",
    "input": "Your long text content here...",
    "inputType": "text",
    "numberOfQuestions": 5,
    "model": "llama3.2",
    "difficulty": "Medium"
  }'
```

## Future Improvements

1. **Local Whisper Integration**: Implement local Whisper for audio transcription
2. **Model Caching**: Cache frequently used models
3. **Streaming Responses**: Implement streaming for real-time quiz generation
4. **Advanced Prompt Engineering**: Fine-tune prompts for better quiz quality
5. **Model Fine-tuning**: Custom fine-tuned models for specific quiz types

## Decommissioning Python Backend

Once you've verified everything works correctly, you can:

1. Archive the `quizitnow-ai-backend` directory
2. Stop the Python backend service
3. Remove Python backend from Docker Compose if applicable
4. Update any CI/CD pipelines to remove Python backend deployment

## Support

If you encounter any issues during or after the migration:

1. Check the logs: Winston logger outputs in `quizitnow-web/logs/`
2. Verify environment variables are correctly set
3. Ensure Ollama service is running and models are available
4. Check the console for detailed error messages
