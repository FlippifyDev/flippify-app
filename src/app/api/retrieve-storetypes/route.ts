import { retrieveSubCols } from "@/services/bridges/retrieve";
import { retrieveUIDAdmin } from "@/services/firebase/admin-retrieve";
import { SubColFilter } from "@/services/firebase/models";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const subColFilter = searchParams.get("subColFilter");
        const subCol = searchParams.get("subCol");
        if (!subColFilter) {
            throw Error("No sub col filter provided");
        }

        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        }

        const uid = await retrieveUIDAdmin({ idToken });

        const { cols, error } = await retrieveSubCols({ uid, subColFilter: subColFilter as SubColFilter, subCol: subCol ?? undefined })
        if (error) throw error;

        return NextResponse.json({ success: true, cols });
    } catch (error: any) {
        console.error('[RETRIEVE STORE TYPE(s) ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}