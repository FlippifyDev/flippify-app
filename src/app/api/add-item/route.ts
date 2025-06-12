import { IListing, IOrder, StoreType } from "@/models/store-data";
import { createItem } from "@/services/firebase/admin-create";
import { inventoryCol, ordersCol } from "@/services/firebase/constants";
import { RootColType } from "@/services/firebase/models";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const idToken = req.headers.get('Authorization')?.split('Bearer ')[1];
        if (!idToken) {
            return NextResponse.json({ error: 'Missing or invalid token' }, { status: 401 });
        }

        const body = await req.json() as IListing | IOrder;

        let rootCol: RootColType = inventoryCol;
        if ("transactionId" in body) rootCol = ordersCol;

        const { error } = await createItem({ idToken, item: body, rootCol, subCol: body.storeType as StoreType })
        if (error) throw error;

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('[ADD_LISTING_ERROR]', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}