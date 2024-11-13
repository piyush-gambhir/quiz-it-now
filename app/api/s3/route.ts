import { env } from '@/env';
import { S3Client } from '@aws-sdk/client-s3';
import {
  PresignedPost,
  PresignedPostOptions,
  createPresignedPost,
} from '@aws-sdk/s3-presigned-post';

import { NextRequest, NextResponse } from 'next/server';

// Validate environment variables
const { AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, S3_BUCKET_NAME } =
  env;

if (
  !AWS_REGION ||
  !AWS_ACCESS_KEY_ID ||
  !AWS_SECRET_ACCESS_KEY ||
  !S3_BUCKET_NAME
) {
  throw new Error('Missing required AWS environment variables.');
}

// Initialize S3 client
const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

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

    // Optional: Validate the key format to prevent directory traversal
    if (key.includes('..')) {
      return NextResponse.json(
        { error: 'Invalid "key" format.' },
        { status: 400 },
      );
    }

    const params: PresignedPostOptions = {
      Bucket: S3_BUCKET_NAME,
      Key: key,
      Expires: 3600,
      Conditions: [
        ['content-length-range', 0, 1048576],
        { 'Content-Type': contentType },
      ],
      Fields: {
        'Content-Type': contentType,
      },
    };

    console.log('Generating presigned POST with params:', params);

    const presignedPost: PresignedPost = await createPresignedPost(
      s3Client,
      params,
    );

    console.log('Presigned POST generated:', presignedPost);

    return NextResponse.json(presignedPost);
  } catch (error: any) {
    console.error('Error in presigned POST generation:', error);

    return NextResponse.json(
      { error: 'Failed to generate presigned URL.' },
      { status: 500 },
    );
  }
}
