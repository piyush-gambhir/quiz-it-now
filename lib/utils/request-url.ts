import { headers } from 'next/headers';

export async function getRequestBaseUrl() {
    const incomingHeaders = await headers();
    const protocol = incomingHeaders.get('x-forwarded-proto') || 'http';
    const host =
        incomingHeaders.get('x-forwarded-host') || incomingHeaders.get('host');

    if (host) {
        return `${protocol}://${host}`;
    }

    return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
}
