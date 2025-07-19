import { PutObjectCommand } from '@aws-sdk/client-s3';

import { s3Client } from '@/lib/aws/s3/client';

export async function putToS3(
    bucket: string,
    key: string,
    body: Buffer | string,
): Promise<void> {
    try {
        const command = new PutObjectCommand({
            Bucket: bucket,
            Key: key,
            Body: body,
        });

        await s3Client!.send(command);
    } catch (error) {
        console.error('Error putting object to S3:', error);
        throw new Error('Failed to upload object to S3');
    }
}
