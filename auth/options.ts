import { SessionStrategy } from "next-auth";
import GithubProvider from "next-auth/providers/github";
export const DEBUG = true;
export const AuthOptions = {
  debug: DEBUG,
  secret: process.env.NEXTAUTH_SECRET as string,
  session: {
    strategy: "jwt" as SessionStrategy
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      authorization: {
        params: {
          scope:
            "read:user user:email admin:org repo admin:repo_hook notifications"
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }: any) {
      if (DEBUG) {
        console.log("signIn", { user, account, profile, email, credentials });
      }
      return true;
    },
    async redirect({ url, baseUrl }: any) {
      if (DEBUG) {
        console.log("redirect", { url, baseUrl });
      }
      return baseUrl;
    },
    async session({ session, token, user }: any) {
      if (DEBUG) {
        console.log("session", { session, token, user });
      }
      session.user.id = token.id;
      session.accessToken = token.accessToken;
      return session;
    },
    async jwt({ token, user, account, profile, isNewUser }: any) {
      if (DEBUG) {
        console.log("jwt", { token, user, account, profile, isNewUser });
      }
      if (user) {
        token.id = user.id;
      }
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    }
  }
};
