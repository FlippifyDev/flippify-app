"use server";

// Local Imports
import { FieldValue } from "firebase-admin/firestore";
import { retrieveUIDAdmin } from "./admin-retrieve";
import { IListing, IOrder } from "@/models/store-data";
import { rootColToUserCount, usersCol } from "./constants";
import { ItemType, RootColType } from "./models";
import { IOneTimeExpense, ISubscriptionExpense } from "@/models/expenses";
import { firestoreAdmin } from "@/lib/firebase/config-admin";
import { IUser } from "@/models/user";
import { formatDateToISO } from "@/utils/format-dates";


export async function incrementItemCountFields({ item, rootCol, isNegated, isNewItem, isUpload, amount = 1 }: { item: ItemType, rootCol: RootColType, isNegated?: boolean, isNewItem?: boolean, isUpload?: boolean, amount?: number }) {
    const countType = rootColToUserCount[rootCol];
    const value = isNegated ? FieldValue.increment(-amount) : FieldValue.increment(amount);

    let createdThisMonth = undefined;
    if (item.createdAt) {
        const createdDate = new Date(item.createdAt);
        const now = new Date();

        createdThisMonth = createdDate.getFullYear() === now.getFullYear() && createdDate.getMonth() === now.getMonth();
    }

    const updateFields: Record<string, any> = {};

    switch (countType) {
        case "numExpenses":
            updateFields.numExpenses = {};
            const expense = item as ISubscriptionExpense | IOneTimeExpense;
            if (expense.type === "one-time") {
                if (isNewItem || createdThisMonth) {
                    updateFields.numExpenses.oneTime = value;
                }
                updateFields.numExpenses.totalOneTime = value;
            } else if (expense.type === "subscription") {
                updateFields.numExpenses.subscriptions = value;
            }
            break;
        case "numOrders":
            updateFields.numOrders = {};
            const order = item as IOrder;

            let soldThisMonth = undefined;
            const saleDate = order.sale?.date;

            if (saleDate) {
                const date = new Date(saleDate);
                const now = new Date();

                soldThisMonth = date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
            }

            const isOrderAuto = order.recordType === "automatic";
            const orderCounterField = isOrderAuto ? 'automatic' : 'manual';
            const totalCounterField = isOrderAuto ? 'totalAutomatic' : 'totalManual';
            if (isNewItem || (createdThisMonth && soldThisMonth)) {
                updateFields.numOrders[orderCounterField] = value;
            }
            if (isUpload) {
                updateFields.numOrders["lastUploaded"] = formatDateToISO(new Date());
            }
            updateFields.numOrders[totalCounterField] = value;
            break;
        case "numListings":
            updateFields.numListings = {};
            const listing = item as IListing;
            const isListingAuto = listing.recordType === "automatic";
            const listingCounterField = isListingAuto ? 'automatic' : 'manual';
            if (isUpload) {
                updateFields.numListings["lastUploaded"] = formatDateToISO(new Date());
            }
            updateFields.numListings[listingCounterField] = value;
            break;
    }

    return updateFields;
}


export async function incrementRewardsClaimed({ idToken }: { idToken: string }) {
    try {
        // Step 1: Retrieve UID
        const uid = await retrieveUIDAdmin({ idToken });
        if (!uid) return;

        // Step 2: Retrieve document reference & snapshot
        const docRef = firestoreAdmin.collection(usersCol).doc(uid)
        const snapshot = await docRef.get();

        // Step 3: Check if snapshot exists
        if (snapshot.exists) return;

        // Step 4: Extract data from snapshot
        const data = snapshot.data() as IUser;

        // Step 5: Extract rewards claimed
        const rewardsClaimed = data.referral?.rewardsClaimed ?? 0;

        // Step 5: Increment rewards claimed
        await docRef.set({ rewardsClaimed: rewardsClaimed + 1 }, { merge: true })

    } catch (error) {
        console.error(`Error incrementRewardsClaimed`, error);
        return { error: `${error}` };
    }
}