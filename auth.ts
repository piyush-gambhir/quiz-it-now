import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = '27943dd2-5cce-4ddd-9ef9-f75b98115d2f';
      return session;
    },
  },
  debug: false,
});
