"use client";

import {
  database,
  ref,
  get,
  child,
  set,
  update,
} from "@/app/api/auth-firebase/firebaseConfig";
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const currencySymbols: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};

const InventoryOrdersContent: React.FC = () => {
  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const customerID = session?.user.customerId;
  const [editableIndex, setEditableIndex] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>('£');


  useEffect(() => {
    const fetchInventoryAndOrders = async () => {
      try {
        setLoading(true);
        // Fetch user's preferred currency from the database
        const userRef = ref(database, `users/${customerID}`);
        const userSnapshot = await get(userRef);
        if (userSnapshot.exists()) {
          const userData = userSnapshot.val();
          setCurrency(userData.currency || '£'); // Set currency from user data
        }

        // Step 1: Fetch orders from eBay
        const ordersResponse = await fetch("/api/ebay/orders");
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch inventory or orders.");
        }
        const orders = await ordersResponse.json();

        // Step 2: Save new orders to Firebase
        const customerSalesRef = ref(database, `sales/${customerID}`);

        await Promise.all(orders.orders.map((order: any) => saveOrderToFirebase(order, customerSalesRef)));

        // Step 3: Retrieve all orders from Firebase
        const snapshot = await get(customerSalesRef);
        const ordersFromFirebase = snapshot.exists() ? snapshot.val() : {};

        // Convert orders to an array format
        const ordersArray = Object.values(ordersFromFirebase);

        // Update the orderData state with Firebase data
        setOrderData(ordersArray);
      } catch (error: any) {
        console.error("Error fetching inventory or orders:", error);
        setError(error.message || "Failed to load inventory or orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryAndOrders();
  }, [customerID]);

  const saveOrderToFirebase = async (order: any, customerSalesRef: any) => {
    try {
      // Check if order with the same ID already exists under the customer
      const existingOrdersSnapshot = await get(customerSalesRef);
      const existingOrders = existingOrdersSnapshot.exists() ? existingOrdersSnapshot.val() : {};

      const orderExists = Object.values(existingOrders).some(
        (existingOrder: any) => existingOrder.orderId === order.orderId
      );

      if (!orderExists) {
        // Extract necessary fields from the order
        const lineItem = order.lineItems[0]; // Assuming one line item per order for simplicity
        const buyerUsername = order.buyer.username;

        const newOrder = {
          orderId: order.orderId,
          itemName: lineItem.title,
          quantitySold: lineItem.quantity,
          saleDate: order.creationDate,
          salePrice: parseFloat(order.pricingSummary.total.value),
          salePlatform: lineItem.listingMarketplaceId,
          shippingFees: parseFloat(order.pricingSummary.deliveryCost.value),
          otherFees: parseFloat(order.totalFeeBasisAmount.value) - parseFloat(order.pricingSummary.total.value),
          expectedPayoutDate: order.paymentSummary.payments[0].paymentHolds[0].expectedReleaseDate,
          
          // Placeholder values for purchase information
          purchasePricePerUnit: null,
          purchaseDate: null,
          purchasePlatform: null,
          
          buyerUsername: buyerUsername
        };

        // Create a unique reference for this order under the customer
        const newOrderRef = child(customerSalesRef, order.orderId); // Use orderId as a unique identifier for the sale
        await set(newOrderRef, newOrder);
      }
    } catch (err) {
      console.error("Error saving order to Firebase:", err);
    }
  };

  const handlePurchaseInfoChange = async (
    orderIndex: number,
    field: string,
    value: string | number
  ) => {
    // Update the local state
    setOrderData((prevData) => {
      const updatedOrders = [...prevData];
      updatedOrders[orderIndex][field] = value;
      return updatedOrders;
    });

    // Save the updated value to Firebase
    const order = orderData[orderIndex];
    const orderRef = ref(database, `sales/${customerID}/${order.orderId}`);

    // Prepare the update object with only the fields to update
    const updateData = {
      [field]: value,
    };

    try {
      // Use the update method to merge changes into the existing data
      await update(orderRef, updateData);
    } catch (err) {
      console.error("Error updating order in Firebase:", err);
    }
  };

  const calculateProfit = (
    salePrice: number,
    quantity: number,
    purchasePricePerUnit: number | null
  ) => {
    if (purchasePricePerUnit == null) return null;
    return salePrice * quantity - purchasePricePerUnit * quantity;
  };

  const calculateROI = (
    profit: number | null,
    purchasePricePerUnit: number | null,
    quantity: number
  ) => {
    if (profit == null || purchasePricePerUnit == null) return null;
    return ((profit / (purchasePricePerUnit * quantity)) * 100);
  };

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
                <th>Item Name</th>
                <th>Cost</th>
                <th>Sold For</th>
                <th>Profit</th>
                <th>ROI (%)</th>
                <th>Purchase Date</th>
                <th>Purchase Platform</th>
              </tr>
            </thead>
            <tbody>
              {orderData.length > 0 ? (
                orderData
                .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
                .map((order, index) => {
                  const salePrice = parseFloat(
                    order.salePrice
                  );
                  const quantity = order.quantitySold;
                  const purchasePricePerUnit = order.purchasePricePerUnit || 0; // Fallback to 0 if undefined
                  const profit = calculateProfit(
                    salePrice,
                    quantity,
                    purchasePricePerUnit
                  );
                  const roi = calculateROI(
                    profit,
                    purchasePricePerUnit,
                    quantity
                  );
                  return (
                    <tr key={index}>
                      <td>{order.itemName}</td>
                      <td className="table-cell w-28 align-middle border-b border-gray-200 p-4 pl-2 font-medium whitespace-nowrap">
                        {editableIndex === index ? (
                          <input
                            id={`input-${index}`}
                            type="text"
                            className="input input-sm border border-gray-200 w-full h-full rounded p-2"
                            defaultValue={purchasePricePerUnit || ""}
                            onChange={(e) =>
                              handlePurchaseInfoChange(
                                index,
                                "purchasePricePerUnit",
                                parseFloat(e.target.value)
                              )
                            }
                            onBlur={() => setEditableIndex(null)} // Hide input on blur
                            autoFocus
                          />
                        ) : (
                          <div
                            className="inline-editable p-2 rounded hover:bg-blue-50 hover:cursor-pointer border border-transparent focus:outline-none focus:ring-0 focus:border-blue-300 focus:rounded"
                            onClick={() => setEditableIndex(index)} // Show input on click
                            tabIndex={0} // Make div focusable
                          >
                            <span className="font-semibold text-red-700">
                              {(purchasePricePerUnit !== null || purchasePricePerUnit !== undefined)
                                ? `${currencySymbols[currency]}${purchasePricePerUnit.toFixed(2)}`
                                : "N/A"}
                            </span>
                          </div>
                        )}
                      </td>
                      <td className={`font-semibold ${salePrice < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {currencySymbols[currency]}{salePrice.toFixed(2)}
                        </td>
                        <td className={`font-semibold ${profit !== null && profit < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {profit !== null ? `${currencySymbols[currency]}${profit.toFixed(2)}` : "N/A"}
                        </td>
                        <td className={`font-semibold ${roi !== null && roi < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {roi !== null ? `${roi.toFixed(2)}%` : "N/A"}
                        </td>
                      <td>
                        <input
                          type="date"
                          className="input input-sm border border-gray-200 h-full"
                          value={order.purchaseDate || ""}
                          onChange={(e) =>
                            handlePurchaseInfoChange(
                              index,
                              "purchaseDate",
                              e.target.value
                            )
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-sm border border-gray-200 h-full"
                          value={order.purchasePlatform || ""}
                          onChange={(e) =>
                            handlePurchaseInfoChange(
                              index,
                              "purchasePlatform",
                              e.target.value
                            )
                          }
                        />
                      </td>

                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="text-center">
                    No orders available.
                  </td>
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
