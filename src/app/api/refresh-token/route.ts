import { retrieveUIDAdmin } from "@/services/firebase/admin-retrieve";
import { checkAndRefreshTokens } from "@/services/firebase/admin-update";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        }

        const uid = await retrieveUIDAdmin({ idToken });
        const { error } = await checkAndRefreshTokens({ uid });
        if (error) throw error;

        return NextResponse.json({ status: 200 });
    } catch (error: any) {
        console.error('[ADD_LISTING_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}