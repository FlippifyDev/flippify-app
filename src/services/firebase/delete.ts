// Local Imports
import { firestore } from "@/lib/firebase/config";

// External Imports
import { doc, deleteDoc } from 'firebase/firestore';
import { updateUserListingsCountAdmin, updateUserOrdersCountAdmin } from "./update-admin";
import { ItemType, StoreType } from "@/models/store-data";


interface IDeleteItemProps {
    uid: string;
    itemType: ItemType,
    storeType: StoreType,
    docId: string;
    isAuto: boolean;
}

async function deleteItem({ uid, itemType, storeType, docId, isAuto = false }: IDeleteItemProps): Promise<void> {
    try {
        // Reference to the specific item document
        const docRef = doc(firestore, itemType, uid, storeType, docId);

        // Delete the document
        await deleteDoc(docRef);

        // Decrement the item count
        if (itemType === "orders") {
            await updateUserOrdersCountAdmin(uid, storeType, -1, isAuto);
        } else if (itemType === "inventory") {
            await updateUserListingsCountAdmin(uid, storeType, -1, isAuto);
        }
        console.log(`Item, with docId ${docId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting item from Firestore:', error);
    }
}



export { deleteItem }