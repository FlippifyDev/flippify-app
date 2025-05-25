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
    createdAt?: string | null;
    isAuto?: boolean;
}

async function deleteItem({ uid, itemType, storeType, docId, createdAt, isAuto = false }: IDeleteItemProps): Promise<void> {
    try {
        // Reference to the specific item document
        const docRef = doc(firestore, itemType, uid, storeType, docId);

        // Delete the document
        await deleteDoc(docRef);

        let createdThisMonth = undefined;
        if (createdAt) {
            const createdDate = new Date(createdAt);
            const now = new Date();

            createdThisMonth =
                createdDate.getFullYear() === now.getFullYear() &&
                createdDate.getMonth() === now.getMonth();
        }

        await updateUserItemCountAdmin({ uid, itemType, amount: -1, isAuto, createdThisMonth })
        console.log(`Item, with docId ${docId} deleted successfully.`);
    } catch (error) {
        console.error('Error deleting item from Firestore:', error);
    }
}

export { deleteItem }