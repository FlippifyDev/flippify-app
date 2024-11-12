import { ISubscription } from "./mongodb/users";
import { IReferral } from "./mongodb/users";
import { JWT } from "next-auth/jwt";

interface IJwtToken extends JWT {
	id: string;
	name: string;
	email: string;
	subscriptions?: ISubscription[];
	username?: string;
	referral?: IReferral;
	ebayAccessToken?: string;
	ebayTokenExpiry?: number;
	ebayRefreshToken?: string;
}


export type { IJwtToken }