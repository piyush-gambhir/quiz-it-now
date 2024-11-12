import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Github from 'next-auth/providers/github';

import { createUser, getUser } from '@/actions/user';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Github({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/logout',
  },
  secret: process.env.AUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      let user = await getUser(token.email!);
      if (!user) {
        user = await createUser(
          token.email!,
          session.user?.name!,
          session.user?.image,
        );
      }
      session.user.id = user.userId;

      return session;
    },
  },
  debug: false,
});
