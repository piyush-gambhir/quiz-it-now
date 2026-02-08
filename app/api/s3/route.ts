import { env } from '@/env';
import { S3Client } from '@aws-sdk/client-s3';
import {
    PresignedPost,
    PresignedPostOptions,
    createPresignedPost,
} from '@aws-sdk/s3-presigned-post';

import { NextRequest, NextResponse } from 'next/server';

// Lazy initialization of S3 client
let s3Client: S3Client | null = null;

function getS3Client(): S3Client {
    if (!s3Client) {
        // Validate environment variables
        const {
            AWS_REGION,
            AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY,
            S3_BUCKET_NAME,
        } = env;

        if (
            !AWS_REGION ||
            !AWS_ACCESS_KEY_ID ||
            !AWS_SECRET_ACCESS_KEY ||
            !S3_BUCKET_NAME
        ) {
            throw new Error('Missing required AWS environment variables.');
        }

        // Initialize S3 client
        s3Client = new S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
        });
    }
    return s3Client;
}

function getPublicFileUrl(key: string) {
    const customBaseUrl = env.S3_PUBLIC_BASE_URL;
    if (customBaseUrl) {
        return `${customBaseUrl.replace(/\/$/, '')}/${key}`;
    }

    if (!env.S3_BUCKET_NAME || !env.AWS_REGION) {
        throw new Error(
            'S3_BUCKET_NAME and AWS_REGION are required to build file URL.',
        );
    }

    return `https://${env.S3_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;
}

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const { key, contentType } = await req.json();

        if (!key || typeof key !== 'string') {
            return NextResponse.json(
                { error: 'A valid "key" is required.' },
                { status: 400 },
            );
        }

        if (!contentType || typeof contentType !== 'string') {
            return NextResponse.json(
                { error: 'A valid "contentType" is required.' },
                { status: 400 },
            );
        }

        if (key.includes('..')) {
            return NextResponse.json(
                { error: 'Invalid "key" format.' },
                { status: 400 },
            );
        }

        const { S3_BUCKET_NAME } = env;
        if (!S3_BUCKET_NAME) {
            throw new Error('S3_BUCKET_NAME environment variable is required');
        }

        const params: PresignedPostOptions = {
            Bucket: S3_BUCKET_NAME,
            Key: key,
            Expires: 3600,
            Conditions: [
                ['content-length-range', 0, 25 * 1024 * 1024],
                { 'Content-Type': contentType },
            ],
            Fields: {
                'Content-Type': contentType,
            },
        };

        const presignedPost: PresignedPost = await createPresignedPost(
            getS3Client(),
            params,
        );

        return NextResponse.json({
            ...presignedPost,
            key,
            fileUrl: getPublicFileUrl(key),
        });
    } catch (error: unknown) {
        return NextResponse.json(
            {
                error:
                    error instanceof Error
                        ? error.message
                        : 'Failed to generate presigned URL.',
            },
            { status: 500 },
        );
    }
}
