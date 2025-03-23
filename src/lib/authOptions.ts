import { admin } from "@/lib/firebase/config-admin";
import { auth } from "@/lib/firebase/config";
import { signInWithEmailAndPassword } from "firebase/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { retrieveUserAndCreate } from "@/services/firebase/retrieve";
import { retrieveUserAdmin } from "@/services/firebase/retrieve-admin";
import { IUser } from "@/models/user";
import { IJwtToken } from "@/models/jwt-token";

type CustomCredentials = Record<"email" | "password", string> & { idToken?: string };

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(
        credentials: Record<"email" | "password", string> | undefined,
        req: any // Using `any` for simplicity; can be refined to `Pick<RequestInternal, ...>` if needed
      ) {
        // If no credentials are provided, throw an error
        if (!credentials) {
          throw new Error("No credentials provided");
        }

        // Extend credentials with optional idToken using type assertion
        const extendedCredentials = credentials as CustomCredentials;

        if (extendedCredentials.idToken) {
          // Handle Firebase ID token (from Google sign-in)
          try {
            const decodedToken = await admin.auth().verifyIdToken(extendedCredentials.idToken);
            return { id: decodedToken.uid, email: decodedToken.email || null };
          } catch (error) {
            throw new Error("Invalid ID token");
          }
        } else if (extendedCredentials.email && extendedCredentials.password) {
          // Handle email/password login
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              extendedCredentials.email,
              extendedCredentials.password
            );
            return { id: userCredential.user.uid, email: userCredential.user.email };
          } catch (error) {
            throw new Error(`Invalid credentials: ${error}`);
          }
        } else {
          throw new Error("Invalid credentials");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        try {
          const userDoc: IUser = (await retrieveUserAndCreate(user.id, user.email)) as IUser;
          token.user = userDoc;
        } catch (error) {
          console.error("Error retrieving user:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        const { user } = token as IJwtToken;
        try {
          const userDoc = await retrieveUserAdmin(user.id);
          if (userDoc) {
            session.user = userDoc;
          }
        } catch (error) {
          console.error("Error retrieving user for session:", error);
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;