import '@/env-config';
import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

export const env = createEnv({
    server: {
        ENVIRONMENT: z
            .enum(['development', 'staging', 'production'])
            .optional(),
        MONGODB_URI: z.string().optional(),
        MONGODB_DB: z.string().optional(),
        AUTH_SECRET: z.string().optional(),
        AUTH_DEBUG: z.enum(['true', 'false']).optional(),
        GITHUB_CLIENT_ID: z.string().optional(),
        GITHUB_CLIENT_SECRET: z.string().optional(),
        GOOGLE_CLIENT_ID: z.string().optional(),
        GOOGLE_CLIENT_SECRET: z.string().optional(),
        HUGGINGFACE_API_KEY: z.string().optional(),
        AWS_REGION: z.string().optional(),
        AWS_ACCESS_KEY_ID: z.string().optional(),
        AWS_SECRET_ACCESS_KEY: z.string().optional(),
        S3_BUCKET_NAME: z.string().optional(),
        S3_PUBLIC_BASE_URL: z.string().url().optional(),
        NVIDIA_API_KEY: z.string().optional(),
        NVIDIA_BASE_URL: z.string().url().optional(),
        NVIDIA_MODEL: z.string().optional(),
        NVIDIA_MODELS: z.string().optional(),
        OLLAMA_BASE_URL: z
            .string()
            .optional()
            .default('http://localhost:11434'),
        OPENAI_API_KEY: z.string().optional(),
    },

    client: {
        NEXT_PUBLIC_APP_URL: z.string().url(),
    },

    runtimeEnv: {
        ENVIRONMENT: process.env.ENVIRONMENT,
        MONGODB_URI: process.env.MONGODB_URI,
        MONGODB_DB: process.env.MONGODB_DB,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
        AUTH_DEBUG: process.env.AUTH_DEBUG,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
        HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
        NVIDIA_API_KEY: process.env.NVIDIA_API_KEY,
        AWS_REGION: process.env.AWS_REGION,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
        S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
        S3_PUBLIC_BASE_URL: process.env.S3_PUBLIC_BASE_URL,
        OLLAMA_BASE_URL: process.env.OLLAMA_BASE_URL,
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        NVIDIA_BASE_URL: process.env.NVIDIA_BASE_URL,
        NVIDIA_MODEL: process.env.NVIDIA_MODEL,
        NVIDIA_MODELS: process.env.NVIDIA_MODELS,
    },
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
