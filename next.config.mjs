/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
        NEXT_PUBLIC_APP_URL:
            process.env.NEXT_PUBLIC_APP_URL ||
            (process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : undefined),
    },
    poweredByHeader: false,
    reactStrictMode: true,
    // pdf-parse bundles pdfjs-dist and a native canvas; keep it out of the bundle.
    serverExternalPackages: ['pdf-parse'],
    // pdfjs loads canvas through createRequire, which static tracing misses.
    outputFileTracingIncludes: {
        '/api/quiz/generate{,/**}': [
            './node_modules/.pnpm/@napi-rs+canvas*/node_modules/@napi-rs/**/*',
            './node_modules/.pnpm/pdfjs-dist@*/node_modules/pdfjs-dist/legacy/build/pdf.worker.mjs',
        ],
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'lh3.googleusercontent.com',
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
            },
            {
                protocol: 'https',
                hostname: '*.amazonaws.com',
            },
        ],
    },
    // Package import optimizations for better performance
    experimental: {
        agentUpgrade: 'security',
        optimizePackageImports: [
            'lucide-react',
            '@radix-ui/react-icons',
            'react-icons',
        ],
    },
};

export default nextConfig;
