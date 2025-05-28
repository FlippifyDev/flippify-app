// Local Imports
import { firestore } from "@/lib/firebase/config";
import { extractItemId } from "./extract";
import { updateItemCount } from "./admin-update";
import { ItemType, RootColType, SubColType } from "./models";

// External Imports
import { deleteDoc, deleteField, doc, setDoc } from "firebase/firestore";
import { usersCol } from "./constants";
import { retrieveUIDAdmin } from "./admin-retrieve";


interface DeleteItemProps {
    idToken: string;
    rootCol: RootColType;
    subCol: SubColType;
    item: ItemType;
}
export async function deleteItem({ idToken, rootCol, subCol, item }: DeleteItemProps) {
    try {
        // Step 1: Extract Item ID
        const id = extractItemId({ item });
        if (!id) throw Error(`Item does not contain an ID`);

        // Step 2: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken })

        // Step 3: Get the related document reference
        const docRef = doc(firestore, rootCol, uid, subCol, id);

        // Step 4: Delete the document
        await deleteDoc(docRef);

        // Step 5: Decrement the item count
        await updateItemCount({ idToken, item, rootCol, isNegated: true })

    } catch (error) {
        console.error(`Error in deleteItem: ${error}`);
        return { error: `${error}` };
    }
}


export async function deleteUserOnboarding({ uid }: { uid: string }) {
    try {
        // Step 1: Retrieve document reference
        const docRef = doc(firestore, usersCol, uid);
        if (!docRef) return;

        await setDoc(
            docRef,
            {
                authentication: { onboarding: deleteField() }
            },
            { merge: true }
        );

    } catch (error) {
        console.error(`Error in deleteUserOnboarding: ${error}`);
        return { error: `${error}` };
    }
}