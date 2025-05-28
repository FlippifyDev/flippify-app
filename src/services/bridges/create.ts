// Local Imports
import { ordersCol } from "../firebase/constants";
import { createItem } from "../firebase/admin-create";
import { updateListing } from "../firebase/admin-update";
import { IOrder, StoreType } from "@/models/store-data";


export async function createNewOrder({ idToken, item }: { idToken: string, item: IOrder }): Promise<{ success?: boolean; error?: any }> {
    try {
        const { success, error } = await createItem({ idToken, item, rootCol: ordersCol, subCol: item.storeType as StoreType })
        if (!success) throw error;

        if (item.sale?.quantity) {
            await updateListing({ idToken, item, storeType: item.storeType as StoreType, amount: item.sale.quantity })
        }

        return { success: true }
    } catch (error) {
        console.error(`Error in createNewOrder: ${error}`);
        return { error: `${error}` };
    }
} 