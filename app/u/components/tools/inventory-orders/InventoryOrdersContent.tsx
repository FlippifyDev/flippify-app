"use client";

import OrderRow from "./OrderRow";
import { database, ref, get, child, set, update } from "@/app/api/auth-firebase/firebaseConfig";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { format } from "path";

const currencySymbols: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

interface OrderDataSchema {
  orderId: string;
  legacyItemId: string;
  itemName: string;
  quantitySold: number;
  saleDate: string;
  salePrice: number,
  salePlatform: string;
  shippingFees: number;
  otherFees: number;
  expectedPayoutDate: string | null | undefined;
  purchasePrice: null;
  purchaseDate: null;
  purchasePlatform: null;
  buyerUsername: string;
}


interface CombinedOrder {
  itemName: string;
  quantitySold: number;
  totalSalePrice: number;
  totalPurchasePrice: number | null;
  totalShippingFees: number;
  totalOtherFees: number;
  orders: Array<{
    orderId: string;
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
  }>;
}



const InventoryOrdersContent: React.FC = () => {
  const [combinedOrderData, setCombinedOrderData] = useState<{ [key: string]: CombinedOrder }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const customerId = session?.user.customerId;
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("£");

  useEffect(() => {
    const fetchInventoryAndOrders = async () => {
      try {
        // Set the state of the program to loading while the eBay data is being fetch
        setLoading(true);
        
        // Query the users preferred currency from firebase
        const userRef = ref(database, `users/${customerId}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setCurrency(userData.currency || "£");
        }
        
        // Send a request to eBay to fetch the all users orders
        const ordersResponse = await fetch("/api/ebay/orders");
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch inventory or orders.");
        }
        // Convert the ordersResponse to json
        const orders = await ordersResponse.json();
        
        // Query the users sales data from firebase
        const customerSalesRef = ref(database, `sales/${customerId}`);

        // Iterate over all the orders from eBay and save them to the database
        // Note: saveOrderToFirebase will do a check to see if the order is already in the database
        await Promise.all(orders.orders.map((order: any) => saveOrderToFirebase(order, customerSalesRef)));
        
        // Query all the users orders from firebase
        const snapshot = await get(customerSalesRef);
        const ordersFromFirebase = snapshot.exists() ? snapshot.val() : {};
        const firebaseOrders = Object.values(ordersFromFirebase) as OrderDataSchema[];
        
        // Set orderData to 
        formatOrderData(firebaseOrders);

      } catch (error: any) {
        console.error("Error fetching inventory or orders:", error);
        setError(error.message || "Failed to load inventory or orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryAndOrders();
  }, [customerId]);

  const saveOrderToFirebase = async (order: any, customerSalesRef: any) => {
    try {
      const orderId = order.orderId;
      const legacyItemId = order.lineItems[0].legacyItemId;
      const lineItem = order.lineItems[0];
      const buyerUsername = order.buyer.username;
      let expectedPayoutDate = order.paymentSummary.payments[0].paymentHolds[0].expectedReleaseDate;
      if (!expectedPayoutDate) {
        expectedPayoutDate = null;
      }
      
      // Set all the order data for the current order
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
        expectedPayoutDate: expectedPayoutDate,
        purchasePrice: null,
        purchaseDate: null,
        purchasePlatform: null,
        buyerUsername,
      };

      const orderRef = child(customerSalesRef, orderId);
      const existingOrderSnapshot = await get(orderRef);
      
      // No existing order, create a new entry
      if (!existingOrderSnapshot.exists()) {
        await set(orderRef, newOrder); 
      }

    } catch (err) {
      console.error("Error saving order to Firebase:", err);
    }
  };


  const formatOrderData = (unformatedOrderData: OrderDataSchema[]) => {
    const combinedOrders: { [key: string]: CombinedOrder } = {};
  
    unformatedOrderData.forEach(order => {
      const { legacyItemId } = order;
  
      // Check if this legacyItemId already exists in the combinedOrders
      if (!combinedOrders[legacyItemId]) {
        // If it doesn't exist, create a new entry
        combinedOrders[legacyItemId] = {
          itemName: order.itemName,
          quantitySold: order.quantitySold,
          totalSalePrice: order.salePrice,
          totalPurchasePrice: order.purchasePrice,
          totalShippingFees: order.shippingFees,
          totalOtherFees: order.otherFees,
          orders: [{
            orderId: order.orderId,
            quantitySold: order.quantitySold,
            saleDate: order.saleDate,
            salePrice: order.salePrice,
            salePlatform: order.salePlatform,
            shippingFees: order.shippingFees,
            otherFees: order.otherFees,
            expectedPayoutDate: order.expectedPayoutDate,
            purchasePrice: order.purchasePrice,
            purchaseDate: order.purchaseDate,
            purchasePlatform: order.purchasePlatform,
            buyerUsername: order.buyerUsername
          }]
        };
      } else {
        // If it exists, sum up the fields
        combinedOrders[legacyItemId].quantitySold += order.quantitySold;
        combinedOrders[legacyItemId].totalSalePrice += order.salePrice;
        combinedOrders[legacyItemId].totalShippingFees += order.shippingFees;
        combinedOrders[legacyItemId].totalOtherFees += order.otherFees;
        // Optionally handle the purchase price, assuming it remains the same for all orders
        if (order.purchasePrice !== null) {
          combinedOrders[legacyItemId].totalPurchasePrice = 
            (combinedOrders[legacyItemId].totalPurchasePrice || 0) + (order.purchasePrice || 0);
        }
  
        // Add the current order to the orders array
        combinedOrders[legacyItemId].orders.push({
          orderId: order.orderId,
          quantitySold: order.quantitySold,
          saleDate: order.saleDate,
          salePrice: order.salePrice,
          salePlatform: order.salePlatform,
          shippingFees: order.shippingFees,
          otherFees: order.otherFees,
          expectedPayoutDate: order.expectedPayoutDate,
          purchasePrice: order.purchasePrice,
          purchaseDate: order.purchaseDate,
          purchasePlatform: order.purchasePlatform,
          buyerUsername: order.buyerUsername
        });
      }
    });
    
    setCombinedOrderData(combinedOrders);
  };

  const orderDataArray = Object.entries(combinedOrderData).map(([itemId, order]) => ({
    itemId,
    ...order
  }));

  return (
    <div className="w-full mb-4 mt-4">
      <h2 className="text-xl font-bold mb-4">Inventory & Order Management</h2>
  
      {error ? (
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p>Unable to load inventory or orders. Please try again later.</p>
        </div>
      ) : (
        <div className="mx-10 overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Product</th>
                <th>Quantity</th>
                <th>Cost</th>
                <th>Sold For</th>
                <th>Profit</th>
                <th>ROI (%)</th>
              </tr>
            </thead>
            <tbody>
              {orderDataArray.length > 0 ? (
                orderDataArray.map((order, index) => {
                  // Calculate necessary values for display
                  const salePrice = order.totalSalePrice;
                  const quantity = order.quantitySold;
                  const totalPurchasePrice = order.totalPurchasePrice || null;
  
                  return (
                    <OrderRow
                      key={index}
                      itemId={order.itemId}
                      itemName={order.itemName}
                      quantitySold={quantity}
                      totalSalePrice={salePrice}
                      totalPurchasePrice={totalPurchasePrice}
                      totalShippingFees={order.totalShippingFees}
                      totalOtherFees={order.totalOtherFees}
                      orders={order.orders}
                      currency={currency}
                      currencySymbols={currencySymbols}
                      customerId={customerId}
                    />
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center">No orders available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
  
};

export default InventoryOrdersContent;
