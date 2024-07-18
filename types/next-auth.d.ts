import NextAuth, { DefaultSession, DefaultJWT } from 'next-auth';


// Define the structure of your user object
interface CustomUser extends NextAuthUser {
  discordId?: string;
  customerId?: string;
  waitlisted?: {
    position: number;
    referral_code: string | null;
    referral_count: number;
  };
}

declare module 'next-auth' {
  interface Session extends DefaultSession {
    accessToken?: string;
    user: CustomUser;
  }

  interface JWT extends DefaultJWT {
    accessToken?: string;
  }
}
