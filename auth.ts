import NextAuth from 'next-auth';
import Github from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: {
                    prompt: 'consent',
                    access_type: 'offline',
                    response_type: 'code',
                },
            },
        }),
        Github({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
        }),
    ],
    pages: {
        signIn: '/login',
        signOut: '/logout',
        error: '/login',
    },
    secret: process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user, account, trigger }) {
            if (account && user) {
                // Initial sign in - store user info in token
                token.userId = user.id || user.email;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
                token.provider = account.provider;
            }

            // Handle token refresh if needed
            if (trigger === 'update' && user) {
                token.name = user.name;
                token.image = user.image;
            }

            return token;
        },
        async session({ session, token }) {
            if (token.userId) {
                session.user.id = token.userId as string;
            }
            if (token.provider) {
                session.user.provider = token.provider as string;
            }
            return session;
        },
        async signIn({ user }) {
            // Add custom sign-in validation here if needed
            if (!user.email) {
                return false;
            }
            return true;
        },
    },
    debug: process.env.AUTH_DEBUG === 'true',
    trustHost: true,
});
