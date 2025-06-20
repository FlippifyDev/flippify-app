import { retrieveUserStoreTypes } from "@/services/firebase/admin-retrieve";
import { RootColType} from "@/services/firebase/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const subColFilter = searchParams.get("subColFilter");
        if (!subColFilter) {
            throw Error("No sub col filter provided");
        }

        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        }
        const storeTypes = await retrieveUserStoreTypes({ idToken, rootCol: subColFilter as RootColType })

        return NextResponse.json({ success: true, storeTypes });
    } catch (error: any) {
        console.error('[RETRIEVE STORE TYPE(s) ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}