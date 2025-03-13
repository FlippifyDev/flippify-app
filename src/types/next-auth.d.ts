import { IUser } from '@/models/user';
import { DefaultSession, DefaultJWT } from 'next-auth';
import { User as NextAuthUser } from 'next-auth';

interface UserSession extends NextAuthUser {
    id: string;
    email: string;
}

declare module "next-auth" {
    interface Session extends DefaultSession {
        id: string;
        email: string;
        user: IUser;
    }

    interface JWT extends DefaultJWT {
        id: string;
        email: string;
        user: IUser;
    }
}