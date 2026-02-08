import mongoose from 'mongoose';
import { DefaultSession } from 'next-auth';

interface MongooseCache {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
}

declare global {
    var mongoose: MongooseCache;
}

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            provider?: string;
        } & DefaultSession['user'];
    }

    interface User {
        id: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        userId?: string;
        provider?: string;
    }
}

export {};
