// Local Imports
import { auth } from "@/lib/firebase/config";
import { IUser } from "@/models/user";
import { IJwtToken } from "@/models/jwt-token";
import { retrieveUserAdmin } from "@/services/firebase/retrieve-admin";
import { retrieveUserAndCreate } from "@/services/firebase/retrieve";

// External Imports
import { signInWithEmailAndPassword } from "firebase/auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";


export const authOptions: NextAuthOptions = {
    providers: [
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
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                try {
                    const userDoc: IUser = (await retrieveUserAndCreate(user.id, user.email) ?? {}) as IUser;
                    token.user = userDoc;
                } catch (error) {
                    console.error('Error retrieving user:', error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            const { user } = token as IJwtToken;
            try {
                const userDoc = await retrieveUserAdmin(user.id);
                if (userDoc) {
                    session.user = userDoc;
                }
            } catch (error) {
                console.error('Error retrieving user:', error);
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET
};