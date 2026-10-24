/** @type {import('next').NextConfig} */
const nextConfig = {
    poweredByHeader: false,
    reactStrictMode: true,
    // pdf-parse bundles pdfjs-dist and a native canvas; keep it out of the bundle.
    serverExternalPackages: ['pdf-parse'],
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
