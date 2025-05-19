// Local Imports
import { firestore } from "@/lib/firebase/config";
import { ItemType, StoreType } from "@/models/store-data";
import { updateUserItemCountAdmin } from "./update-admin";

// External Imports
import { doc, deleteDoc } from 'firebase/firestore';


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

        // For now don't update the count, until a valid solution is found
        //await updateUserItemCountAdmin({ uid, itemType, amount: -1, isAuto })
        console.log(`Item, with docId ${docId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting item from Firestore:', error);
    }
}



export { deleteItem }