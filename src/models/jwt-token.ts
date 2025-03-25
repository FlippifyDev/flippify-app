import { IUser } from "./user";
import { JWT } from "next-auth/jwt";

interface IJwtToken extends JWT {
    id: string;
    email: string;
    user: IUser;
}


export type { IJwtToken }