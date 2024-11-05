// hooks/useSalesData.ts
import { useEffect, useState } from "react";
import { database, ref, get, set, child, remove } from "@/app/api/auth-firebase/firebaseConfig";

export interface IOrder {
  orderId: string;
  legacyItemId: string;
  itemName: string;
  quantitySold: number;
  saleDate: string;
  salePrice: number;
  salePlatform: string;
  shippingFees: number;
  otherFees: number;
  expectedPayoutDate: string | null | undefined;
  purchasePrice: number | null;
  purchaseDate: string | null;
  purchasePlatform: string | null;
  buyerUsername: string;
  customTag: string;
}

export const useSalesData = (customerId?: string) => {
  const [salesData, setSalesData] = useState<IOrder[]>([]);
  const [currency, setCurrency] = useState<string>("£");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        if (!customerId) {
          return;
        }
        setLoading(true);
        
        // Fetch eBay orders
        const ordersResponse = await fetch("/api/ebay/orders");
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch eBay orders.");
        }
        const orders = await ordersResponse.json();

        // Reference to Firebase for user sales
        const customerSalesRef = ref(database, `sales/${customerId}`);
        
        // Fetch user currency
        const userRef = ref(database, `users/${customerId}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setCurrency(userData.currency || "GBP");
        }

        // Process and save eBay orders to Firebase
        await Promise.all(orders.orders.map((order: any) => saveOrderToFirebase(order, customerSalesRef)));

        // Retrieve updated sales data from Firebase
        const snapshot = await get(customerSalesRef);
        const ordersFromFirebase = snapshot.exists() ? snapshot.val() : {};
        const firebaseOrders = Object.values(ordersFromFirebase) as IOrder[];

        setSalesData(firebaseOrders);
      } catch (error: any) {
        setError(error.message || "Failed to load sales data.");
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchSalesData();
    }
  }, [customerId]);

  const saveOrderToFirebase = async (order: any, customerSalesRef: any) => {
    try {
      const orderId = order.orderId;
      const legacyItemId = order.lineItems[0].legacyItemId;
      const lineItem = order.lineItems[0];
      const buyerUsername = order.buyer.username;
      let expectedPayoutDate = order.paymentSummary.payments[0].paymentHolds[0]?.expectedReleaseDate || null;

      const cancelState = order.cancelStatus.cancelState
      
      const newOrder = {
        orderId,
        legacyItemId,
        itemName: lineItem.title,
        quantitySold: lineItem.quantity,
        saleDate: order.creationDate,
        salePrice: parseFloat(order.pricingSummary.total.value),
        salePlatform: lineItem.listingMarketplaceId,
        shippingFees: parseFloat(order.pricingSummary.deliveryCost.value),
        otherFees: parseFloat(order.totalFeeBasisAmount.value) - parseFloat(order.pricingSummary.total.value),
        expectedPayoutDate,
        purchasePrice: null,
        purchaseDate: null,
        purchasePlatform: null,
        buyerUsername,
      };

      const orderRef = child(customerSalesRef, orderId);
      const existingOrderSnapshot = await get(orderRef);

      if (!existingOrderSnapshot.exists() && cancelState !== "CANCELED") {
        // If the order doesn't exist in the database and it has not been cancelled then add the order
        await set(orderRef, newOrder);

      } else if (existingOrderSnapshot.exists() && cancelState === "CANCELED") {
        // If the order does exist in the database and it has been cancelled then remove the order
        await remove(orderRef);
      }
      // Finally if the order exists and has not been cancelled then do nothing 
      

    } catch (err) {
      console.error("Error saving order to Firebase:", err);
    }
  };

  return { salesData, loading, error, currency };
};
