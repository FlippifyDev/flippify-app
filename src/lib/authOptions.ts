// Local Imports
import { auth } from "@/lib/firebase/config";
import { IUser } from "@/models/user";
import { IJwtToken } from "@/models/jwt-token";
import { retrieveUserAdmin } from "@/services/firebase/retrieve-admin";
import { retrieveUserAndCreate } from "@/services/firebase/retrieve";

// External Imports
import { signInWithEmailAndPassword } from "firebase/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid email or password");
        }
        try {
          const userCredential = await signInWithEmailAndPassword(
            auth,
            credentials.email,
            credentials.password
          );
          // Return a minimal user object; full user data is fetched later in callbacks.
          const user = {
            id: userCredential.user.uid,
            email: userCredential.user.email,
          };
          return user;
        } catch (error) {
          throw new Error(`Invalid credentials: ${error}`);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // On initial sign-in, NextAuth provides both `user` and `account`.
      if (user && account) {
        token.id = user.id;
        token.email = user.email;
        try {
          // Retrieve (or create) the Firestore user document.
          // This works for both Google and Credentials logins.
          const userDoc: IUser = (await retrieveUserAndCreate(user.id, user.email)) as IUser;
          token.user = userDoc;
        } catch (error) {
          console.error("Error retrieving user:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Attach the full user profile (retrieved in the jwt callback) to the session.
      const { user } = token as IJwtToken;
      try {
        const userDoc = await retrieveUserAdmin(user.id);
        if (userDoc) {
          session.user = userDoc;
        }
      } catch (error) {
        console.error("Error retrieving user for session:", error);
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
