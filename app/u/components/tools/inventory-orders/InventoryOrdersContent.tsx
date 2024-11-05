"use client";

import OrderRow from "./OrderRow";
import { useSalesData, IOrder } from '@/hooks/useSalesData'; 
import LayoutSubscriptionWrapper from "../../layout/LayoutSubscriptionWrapper";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const currencySymbols: Record<string, string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
};


interface CombinedOrder {
  itemName: string;
  quantitySold: number;
  totalSalePrice: number;
  totalPurchasePrice: number | null;
  totalShippingFees: number;
  totalOtherFees: number;
  orders: Array<IOrder>;
}

const InventoryOrdersContent: React.FC = () => {
  const [combinedOrderData, setCombinedOrderData] = useState<{ [key: string]: CombinedOrder }>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const customerId = session?.user.customerId;

  // Use the custom hook to get sales data
  const { salesData, currency } = useSalesData(customerId);


  useEffect(() => {
    if (salesData) {
      formatOrderData(salesData);
    }
  }, [salesData]);

  const formatOrderData = (unformattedOrderData: IOrder[]) => {
    const combinedOrders: { [key: string]: CombinedOrder } = {};

    unformattedOrderData.forEach(order => {
      const { legacyItemId } = order;

      if (!combinedOrders[legacyItemId]) {
        combinedOrders[legacyItemId] = {
          itemName: order.itemName,
          quantitySold: order.quantitySold,
          totalSalePrice: order.salePrice,
          totalPurchasePrice: order.purchasePrice,
          totalShippingFees: order.shippingFees,
          totalOtherFees: order.otherFees,
          orders: [order],
        };
      } else {
        combinedOrders[legacyItemId].quantitySold += order.quantitySold;
        combinedOrders[legacyItemId].totalSalePrice += order.salePrice;
        combinedOrders[legacyItemId].totalShippingFees += order.shippingFees;
        combinedOrders[legacyItemId].totalOtherFees += order.otherFees;

        if (order.purchasePrice !== null) {
          combinedOrders[legacyItemId].totalPurchasePrice = 
            (combinedOrders[legacyItemId].totalPurchasePrice || 0) + (order.purchasePrice || 0);
        }

        combinedOrders[legacyItemId].orders.push(order);
      }
    });

    setCombinedOrderData(combinedOrders);
    setLoading(false);
  };

  const orderDataArray = Object.entries(combinedOrderData).map(([itemId, order]) => ({
    itemId,
    ...order
  }));

  return (
    <LayoutSubscriptionWrapper requiredSubscriptions={["admin"]}>
      <div className="w-full mb-4 border bg-white rounded-md py-4 shadow-sm h-[875px]">
        <h2 className="text-xl font-bold mb-4 mx-6">Inventory & Order Management</h2>

        {error ? (
          <div className="text-red-500">
            <p>Error: {error}</p>
            <p>Unable to load inventory or orders. Please try again later.</p>
          </div>
        ) : (
          <div className="mx-6 overflow-x-auto">
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
                    <td colSpan={6} className="text-center">No orders available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </LayoutSubscriptionWrapper>
  );
};

export default InventoryOrdersContent;
