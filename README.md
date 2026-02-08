# QuizItNow - Instant Quiz Generation from Any Content Source

**Tagline:** _Transform any content into engaging quizzes instantly with AI._

[![Next.js](https://img.shields.io/badge/Next.js-16.1.6-000000?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2.4-61DAFB?style=flat&logo=react)](https://reactjs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.1.0-47A248?style=flat&logo=mongodb)](https://www.mongodb.com/)

## Overview

**QuizItNow** is a production-ready, AI-powered platform that automatically generates high-quality educational quizzes from various content sources. Built with Next.js 16, TypeScript, and modern AI technologies, it provides a seamless experience for educators, content creators, and learners to create engaging assessments in seconds.

## 🎯 Key Features

- **Multiple Input Types**: Text, URLs (articles, YouTube videos), and PDF documents
- **Intelligent AI Processing**: Powered by NVIDIA AI and OpenAI models with automatic content extraction
- **Customizable Generation**: 3-25 questions with four difficulty levels (Easy, Medium, Hard, God Mode)
- **Smart Content Extraction**: Automatic text extraction from PDFs, YouTube transcripts, and web pages
- **Question Variety**: Multiple-choice, true/false, and fill-in-the-blank questions
- **User Authentication**: Secure OAuth integration with Google and GitHub
- **Quiz Management**: Save, view, and manage generated quizzes with MongoDB
- **Modern UI**: Beautiful, responsive interface built with Radix UI and Tailwind CSS
- **File Upload**: Direct file upload with AWS S3 integration
- **Real-time Generation**: Stream-based AI generation with loading states

## 📋 Table of Contents

- [Architecture](#architecture)
- [Supported Input Types](#supported-input-types)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Development](#development)
- [License](#license)

## 🏗️ Architecture

QuizItNow is built as a modern full-stack application with the following architecture:

```
┌─────────────────────────────────────────┐
│         Next.js 16 Application          │
│  (React 19 + TypeScript + Turbopack)   │
└─────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
┌───────▼────────┐    ┌────────▼────────┐
│   Frontend     │    │   API Routes    │
│  Components    │    │   (Node.js)     │
│  (React/TSX)   │    │                 │
└────────────────┘    └────────┬────────┘
                               │
                    ┌──────────┼──────────┐
                    │          │          │
           ┌────────▼───┐ ┌───▼────┐ ┌──▼──────┐
           │ NVIDIA AI  │ │MongoDB │ │AWS S3   │
           │ (Quiz Gen) │ │(Data)  │ │(Files)  │
           └────────────┘ └────────┘ └─────────┘
```

## 📝 Supported Input Types

### 1. **Text Input**

- Direct text paste (minimum 250 words)
- Processes plain text for quiz generation

### 2. **URL Input**

- **YouTube Videos**: Automatically extracts transcripts
- **Web Articles**: Scrapes and extracts main content using Cheerio
- **PDF Links**: Downloads and extracts text from PDF URLs

### 3. **File Upload**

- **PDF Files**: Uploads to S3 and extracts text content
- **Text Files**: Direct text extraction
- Secure file handling with presigned URLs

### Quiz Generation Capabilities

- **Question Count**: 3 to 25 questions (configurable)
- **Minimum Content**: 250 words required
- **Difficulty Levels**:
    - **Easy**: Basic comprehension and recall questions
    - **Medium**: Application and analysis questions
    - **Hard**: Critical thinking and synthesis questions
    - **God Mode**: Expert-level with maximum complexity
- **Question Types**:
    - Multiple-choice (4 options)
    - True/False
    - Fill-in-the-blank

## 🛠️ Technologies Used

### Frontend Stack

- **Next.js 16.1.6**: React framework with App Router and Server Components
- **React 19.2.4**: Latest React with modern features
- **TypeScript 5.9.3**: Type-safe development
- **Tailwind CSS 4.1.18**: Modern utility-first CSS
- **Radix UI**: Accessible component primitives
- **Framer Motion 12**: Smooth animations and transitions
- **React Hook Form + Zod**: Form validation and management
- **Next Themes**: Dark/light mode support
- **Lucide React**: Modern icon library

### Backend & AI

- **Next.js API Routes**: Serverless backend with Node.js runtime
- **NVIDIA NIM AI**: Primary LLM for quiz generation (via Vercel AI SDK)
- **OpenAI API**: Alternative AI provider support
- **Vercel AI SDK**: Structured output generation with type safety
- **YouTube Transcript API**: Video transcript extraction
- **Cheerio 1.0**: HTML parsing and web scraping
- **pdf-parse**: PDF text extraction

### Database & Storage

- **MongoDB 7.1.0**: NoSQL database for quiz and user data
- **Mongoose 9.1.6**: ODM for MongoDB with TypeScript support
- **AWS S3**: Secure file storage with presigned URLs
- **AWS SDK v3**: Modern AWS service integration

### Authentication & Security

- **NextAuth.js v5 (Beta 30)**: Complete OAuth authentication system
- **Google OAuth**: Sign in with Google
- **GitHub OAuth**: Sign in with GitHub
- **JWT Sessions**: Secure, stateless session management
- **Zod 4.3.6**: Runtime type validation

### Development Tools

- **pnpm**: Fast, efficient package manager with workspace support
- **Turbopack**: Next-generation bundler (faster than Webpack)
- **ESLint 9**: Code linting with Next.js config
- **Prettier 3.8**: Code formatting with plugins
- **TypeScript 5.9**: Static type checking
- **Husky 9**: Git hooks for code quality
- **Winston 3**: Structured logging

### Build & Deployment

- **Docker**: Containerization with multi-stage builds
- **Docker Compose**: Local development orchestration
- **Vercel**: Optimized deployment platform
- **Node.js 20-alpine**: Production runtime

## 📁 Project Structure

```
quiz-it-now/
├── app/                          # Next.js App Router
│   ├── (app)/                   # Main application routes
│   │   ├── (user)/              # User-specific routes
│   │   │   └── quiz/            # Quiz management pages
│   │   └── page.tsx             # Landing page
│   ├── (auth)/                  # Authentication routes
│   │   ├── login/               # Login page
│   │   ├── logout/              # Logout page
│   │   └── register/            # Registration page
│   ├── (company)/               # Company pages
│   │   ├── about/               # About page
│   │   └── contact-us/          # Contact page
│   ├── (legal)/                 # Legal pages
│   │   ├── cookie-policy/
│   │   ├── privacy-policy/
│   │   └── terms-of-service/
│   ├── api/                     # API Routes
│   │   ├── audio/               # Audio transcription
│   │   │   └── transcribe/      # POST: Transcribe audio files
│   │   ├── auth/                # NextAuth authentication
│   │   │   └── [...nextauth]/   # OAuth handlers
│   │   ├── models/              # AI model management
│   │   │   └── route.ts         # GET: List available models
│   │   ├── quiz/                # Quiz operations
│   │   │   ├── route.ts         # GET: List user quizzes
│   │   │   ├── [quizId]/        # GET: Get specific quiz
│   │   │   └── generate/        # POST: Generate new quiz
│   │   │       └── ai/          # AI quiz generation logic
│   │   ├── s3/                  # File upload handling
│   │   │   └── route.ts         # POST: Get presigned upload URL
│   │   └── users/               # User management
│   │       └── route.ts         # GET/POST: User CRUD
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   ├── error.tsx                # Error boundary
│   └── not-found.tsx            # 404 page
│
├── components/                   # React components
│   ├── auth/                    # Authentication components
│   │   ├── sign-in-form.tsx    # Email/password login
│   │   ├── sign-up-form.tsx    # Registration form
│   │   ├── sign-in-with-google.tsx
│   │   └── sign-in-with-github.tsx
│   ├── common/                  # Reusable components
│   │   ├── cover.tsx           # Page cover component
│   │   ├── file-input-field.tsx
│   │   ├── loading-modal.tsx
│   │   ├── sparkles.tsx        # Animated effects
│   │   └── text-input-field.tsx
│   ├── landing-page/            # Landing page sections
│   │   ├── hero-section.tsx
│   │   ├── feature-section.tsx
│   │   ├── how-it-works-section.tsx
│   │   └── pricing-section.tsx
│   ├── quiz/                    # Quiz-related components
│   │   └── generator/          # Quiz generation UI
│   ├── svg/                     # SVG components
│   │   └── error.tsx
│   └── ui/                      # UI primitives (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── form.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── toast.tsx
│       └── ... (40+ components)
│
├── lib/                         # Core libraries
│   ├── ai/                      # AI integration
│   │   ├── nvidia.ts           # NVIDIA AI client setup
│   │   ├── nvidia-models.ts    # Model configuration
│   │   ├── audio-transcription.ts # Audio processing
│   │   └── quiz-object-schema.ts # Quiz validation schemas
│   ├── auth/                    # Auth utilities
│   │   └── session.ts          # Session helpers
│   ├── aws/                     # AWS integrations
│   │   ├── s3.ts              # S3 client and upload
│   │   └── lambda.ts          # Lambda invocation
│   ├── logger/                  # Logging utilities
│   │   └── winston.ts          # Winston configuration
│   ├── models/                  # Database models (Mongoose)
│   │   ├── quiz.ts             # Quiz schema and model
│   │   ├── user.ts             # User schema and model
│   │   ├── account.ts          # OAuth account model
│   │   ├── session.ts          # Session model
│   │   └── index.ts            # Model exports
│   ├── mongo/                   # MongoDB connection
│   │   └── client.ts           # Database connection logic
│   ├── types/                   # TypeScript types
│   │   └── quiz.ts             # Quiz type definitions
│   └── utils/                   # Helper utilities
│       ├── api-response.ts     # API response formatting
│       └── validators.ts       # Validation helpers
│
├── helpers/                     # Helper functions
│   └── prompts/                # AI prompt templates
│       ├── generate-quiz-prompts.ts # Quiz generation prompts
│       └── utils.ts            # Prompt utilities
│
├── hooks/                       # React custom hooks
│   ├── use-click-outside.ts
│   ├── use-copy-to-clipboard.ts
│   ├── use-debounce.ts
│   ├── use-query-params.ts
│   └── use-toast.ts
│
├── providers/                   # React context providers
│   ├── providers.tsx           # Root provider wrapper
│   ├── next-auth-session-provider.tsx
│   └── theme-provider.tsx      # Theme management
│
├── fonts/                       # Font files and configuration
│   ├── fonts.ts
│   ├── google-fonts.ts
│   ├── local-fonts.ts
│   ├── Geist/                  # Geist font family
│   └── PPNeueMontreal/         # PP Neue Montreal
│
├── public/                      # Static assets
│   ├── images/
│   └── icons/
│
├── docs/                        # Documentation
│   ├── ai-backend-migration.md # Migration guide
│   └── migration-summary.md    # Summary of changes
│
├── utils/                       # Utility functions
│   ├── cn.ts                   # Class name utilities
│   ├── date-time.ts            # Date formatting
│   ├── generate-uuid.ts        # UUID generation
│   ├── local-storage.ts        # LocalStorage helpers
│   └── session-storage.ts      # SessionStorage helpers
│
├── auth.ts                      # NextAuth configuration
├── env.ts                       # Environment validation (T3 Env)
├── env-config.ts               # Environment loading
├── routes.ts                    # Route definitions and access
├── middleware.ts               # Next.js middleware (auth)
├── proxy.ts                     # API proxy configuration
│
├── Dockerfile                   # Production Docker build
├── docker-compose.yml           # Local development setup
├── start-production.sh          # Production startup script
│
├── package.json                 # Dependencies and scripts
├── pnpm-lock.yaml              # Lockfile
├── pnpm-workspace.yaml         # Workspace configuration
├── tsconfig.json               # TypeScript configuration
├── next.config.mjs             # Next.js configuration
├── eslint.config.mjs           # ESLint configuration
├── postcss.config.mjs          # PostCSS configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── components.json             # shadcn/ui configuration
└── README.md                   # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js 20.x** or higher
- **pnpm 9.x** (recommended) or npm
- **MongoDB** (local or Atlas cluster)
- **NVIDIA API Key** (primary) or **OpenAI API Key** (fallback)
- **AWS Account** (for S3 file uploads - optional but recommended)
- **Google OAuth App** (for Google sign-in)
- **GitHub OAuth App** (for GitHub sign-in)

### Installation

1. **Clone the repository:**

```bash
git clone https://github.com/piyush-gambhir/quiz-it-now.git
cd quiz-it-now
```

2. **Install dependencies:**

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install
```

3. **Set up environment variables:**

Create a `.env.local` file in the root directory:

```env
# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
ENVIRONMENT=development

# Database
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=quizitnow

# Authentication
AUTH_SECRET=your-auth-secret-here
AUTH_DEBUG=false

# OAuth Providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret

# AI Models
NVIDIA_API_KEY=your-nvidia-api-key
NVIDIA_BASE_URL=https://integrate.api.nvidia.com/v1
NVIDIA_MODEL=meta/llama-3.1-405b-instruct
OPENAI_API_KEY=your-openai-api-key

# AWS S3 (Optional - for file uploads)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=your-bucket-name
S3_PUBLIC_BASE_URL=https://your-bucket.s3.amazonaws.com
```

4. **Start MongoDB:**

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use MongoDB Atlas (cloud)
```

5. **Run the development server:**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔐 Environment Variables

### Required Variables

| Variable              | Description               | Example                                 |
| --------------------- | ------------------------- | --------------------------------------- |
| `NEXT_PUBLIC_APP_URL` | Public application URL    | `http://localhost:3000`                 |
| `MONGODB_URI`         | MongoDB connection string | `mongodb://localhost:27017`             |
| `MONGODB_DB`          | Database name             | `quizitnow`                             |
| `AUTH_SECRET`         | NextAuth secret key       | Generate with `openssl rand -base64 32` |
| `NVIDIA_API_KEY`      | NVIDIA AI API key         | From NVIDIA NGC                         |

### OAuth Variables (at least one required)

| Variable               | Description                |
| ---------------------- | -------------------------- |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID     |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID`     | GitHub OAuth app ID        |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret    |

### Optional Variables

| Variable                | Description               | Default     |
| ----------------------- | ------------------------- | ----------- |
| `OPENAI_API_KEY`        | OpenAI API key (fallback) | -           |
| `AWS_REGION`            | AWS region for S3         | `us-east-1` |
| `AWS_ACCESS_KEY_ID`     | AWS access key            | -           |
| `AWS_SECRET_ACCESS_KEY` | AWS secret key            | -           |
| `S3_BUCKET_NAME`        | S3 bucket name            | -           |
| `S3_PUBLIC_BASE_URL`    | Public S3 URL             | -           |

## 🌐 API Endpoints

### Quiz Generation

**POST** `/api/quiz/generate/ai`

Generate a quiz from various input types.

**Request Body:**

```json
{
    "userId": "string (optional)",
    "input": "string | { name, type, url }",
    "inputType": "text | link | file",
    "numberOfQuestions": 5,
    "difficulty": "Easy | Medium | Hard | God Mode",
    "model": "string (optional)"
}
```

**Response:**

```json
{
  "success": true,
  "data": {
    "quizId": "uuid",
    "quiz": {
      "title": "Quiz Title",
      "description": "Description",
      "difficulty": "Medium",
      "topic": "Main Topic",
      "tags": ["tag1", "tag2"],
      "numberOfQuestions": 5,
      "questions": [...]
    },
    "createdAt": "ISO date"
  }
}
```

### Quiz Management

**GET** `/api/quiz` - List all quizzes for authenticated user
**GET** `/api/quiz/[quizId]` - Get specific quiz by ID

### File Upload

**POST** `/api/s3`

Get presigned URL for file upload.

**Request Body:**

```json
{
    "fileName": "document.pdf",
    "fileType": "application/pdf"
}
```

### Audio Transcription

**POST** `/api/audio/transcribe`

Transcribe audio file to text (currently placeholder).

### AI Models

**GET** `/api/models`

List available AI models.

### User Management

**GET** `/api/users` - Get user profile
**POST** `/api/users` - Create/update user

## 🐳 Deployment

### Docker Deployment

1. **Build the Docker image:**

```bash
docker build -t quizitnow:latest -f Dockerfile .
```

2. **Run with Docker Compose:**

```bash
docker-compose up -d
```

This will start the application on port 3000.

### Vercel Deployment

1. **Install Vercel CLI:**

```bash
npm i -g vercel
```

2. **Deploy:**

```bash
vercel --prod
```

3. **Configure environment variables** in Vercel dashboard

### Production Checklist

- [ ] Set `ENVIRONMENT=production`
- [ ] Generate secure `AUTH_SECRET`
- [ ] Configure production MongoDB (Atlas recommended)
- [ ] Set up OAuth apps with production URLs
- [ ] Configure AWS S3 for file uploads
- [ ] Add NVIDIA API key
- [ ] Enable error tracking (optional: Sentry)
- [ ] Set up monitoring and logging
- [ ] Configure CDN for static assets
- [ ] Enable rate limiting on API routes

## 💻 Development

### Available Scripts

```bash
# Development
pnpm dev          # Start dev server with Turbopack
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint
pnpm lint:fix     # Fix ESLint issues
pnpm typecheck    # Run TypeScript checks
pnpm clean        # Clean build artifacts
```

### Code Style

- **TypeScript**: Strict mode enabled
- **Formatting**: Prettier with sort imports plugin
- **Linting**: ESLint with Next.js config
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for utilities

### Git Hooks

Pre-commit hooks with Husky:

- Prettier formatting
- ESLint validation
- TypeScript checking

### Testing Strategy

While not currently implemented, recommended testing approach:

1. **Unit Tests**: Jest + React Testing Library
2. **Integration Tests**: Playwright or Cypress
3. **API Tests**: Supertest or Vitest
4. **E2E Tests**: Playwright

## 🎨 UI Components

Built with **shadcn/ui** - a collection of reusable components built with Radix UI and Tailwind CSS:

- Accessible by default (ARIA compliant)
- Fully customizable with Tailwind
- Dark mode support
- TypeScript types included

Major components:

- Forms with validation
- Dialogs and modals
- Dropdowns and selects
- Toasts and alerts
- Data tables
- Navigation menus

## 🔧 Troubleshooting

### Common Issues

**1. MongoDB Connection Error**

```bash
Error: connect ECONNREFUSED 127.0.0.1:27017
```

Solution: Ensure MongoDB is running or check connection string.

**2. Build Errors with Turbopack**

```bash
Error: Module not found
```

Solution: Clear `.next` folder and reinstall dependencies:

```bash
pnpm clean && pnpm install
```

**3. Authentication Not Working**

- Verify `AUTH_SECRET` is set
- Check OAuth app URLs match `NEXT_PUBLIC_APP_URL`
- Ensure callback URLs are registered in OAuth apps

**4. AI Generation Fails**

- Verify NVIDIA API key is valid
- Check model name in environment variables
- Ensure input meets minimum word count (250 words)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style
- Add tests for new features
- Update documentation
- Ensure all tests pass
- Keep commits atomic and well-described

## 🙏 Acknowledgments

- **Vercel** for the AI SDK and Next.js framework
- **NVIDIA** for NIM AI platform
- **shadcn** for the UI component library
- **Radix UI** for accessible primitives
- **MongoDB** for the database solution

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/piyush-gambhir/quiz-it-now/issues)
- **Discussions**: [GitHub Discussions](https://github.com/piyush-gambhir/quiz-it-now/discussions)
- **Email**: support@quizitnow.com (if applicable)

## 🗺️ Roadmap

### Planned Features

- [ ] Multi-language support (i18n)
- [ ] Quiz analytics and insights
- [ ] Collaborative quiz editing
- [ ] Quiz sharing and embedding
- [ ] Image extraction from PDFs
- [ ] Audio transcription with OpenAI Whisper
- [ ] Custom branding and themes
- [ ] Export to PDF/DOCX
- [ ] Quiz templates library
- [ ] Mobile app (React Native)
- [ ] API rate limiting
- [ ] Performance monitoring
- [ ] A/B testing framework

### Recent Updates

- ✅ Migrated from FastAPI/Python to Next.js/TypeScript
- ✅ NVIDIA AI integration for quiz generation
- ✅ AWS S3 file upload support
- ✅ NextAuth.js v5 authentication
- ✅ MongoDB with Mongoose ODM
- ✅ Modern UI with Radix components
- ✅ Docker containerization

---

Built with ❤️ by the QuizItNow team

**Happy Quiz Building! 🎉**
