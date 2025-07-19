import '@/envConfig.ts';
import { createEnv } from '@t3-oss/env-nextjs';

import { z } from 'zod';

export const env = createEnv({
    /**
   Specify your server-side environment variables schema here. This way you can ensure the app isn't built with invalid env vars.
   */
    server: {
        ENVIRONMENT: z.enum(['development', 'staging', 'production']),
        MONGODB_URI: z.string(),
        MONGODB_DB: z.string(),
        AUTH_SECRET: z.string(),
        GITHUB_CLIENT_ID: z.string(),
        GITHUB_CLIENT_SECRET: z.string(),
        GOOGLE_CLIENT_ID: z.string(),
        GOOGLE_CLIENT_SECRET: z.string(),
        HUGGINGFACE_API_KEY: z.string(),
        AWS_REGION: z.string(),
        AWS_ACCESS_KEY_ID: z.string(),
        AWS_SECRET_ACCESS_KEY: z.string(),
        S3_BUCKET_NAME: z.string(),
        DATA_SCRAPING_BACKEND_URL: z.string(),
        NVIDIA_API_KEY: z.string(),
    },

    /**
   Specify your client-side environment variables schema here. This way you can ensure the app isn't built with invalid env vars. 
   To expose them to the client, prefix them with `NEXT_PUBLIC_`.
   */
    client: {
        NEXT_PUBLIC_APP_URL: z.string().url(),
    },

    /**
     * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
     * middlewares) or client-side so we need to destruct manually.
     */
    runtimeEnv: {
        ENVIRONMENT: process.env.ENVIRONMENT,
        MONGODB_URI: process.env.MONGODB_URI,
        MONGODB_DB: process.env.MONGODB_DB,
        NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
        AUTH_SECRET: process.env.AUTH_SECRET,
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
        DATA_SCRAPING_BACKEND_URL: process.env.DATA_SCRAPING_BACKEND_URL,
    },
    /**
   Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   This is especially useful for Docker builds.
   */
    skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
