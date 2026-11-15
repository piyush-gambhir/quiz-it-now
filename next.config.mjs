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
    serverExternalPackages: ['pdf-parse'],
    outputFileTracingIncludes: {
        '/api/quiz/generate{,/**}': [
            './node_modules/.pnpm/@napi-rs+canvas*/node_modules/@napi-rs/**/*',
            './node_modules/.pnpm/pdfjs-dist@*/node_modules/@napi-rs/canvas',
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
