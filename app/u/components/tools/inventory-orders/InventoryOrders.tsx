"use client";

import React, { useState, useEffect } from "react";

const InventoryOrders = () => {
  const [ordersData, setOrdersData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrdersData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/ebay/orders");
      if (!response.ok) {
        throw new Error(`Error fetching orders: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setOrdersData(data);
    } catch (error) {
      console.error("Error fetching orders data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersData();
  }, []);

  if (loading) {
    return <div>Loading Orders...</div>;
  }

  return (
    <div>
      <h2>Inventory & Orders</h2>
      {ordersData && ordersData.orders.map((order: any) => (
        <div key={order.orderId}>
          <p><strong>Order ID:</strong> {order.orderId}</p>
          <p><strong>Item:</strong> {order.lineItems[0]?.title}</p>
          <p><strong>Total Price:</strong> {order.pricingSummary.total.value} {order.pricingSummary.total.currency}</p>
          <p><strong>Status:</strong> {order.orderFulfillmentStatus}</p>
        </div>
      ))}
    </div>
  );
};

export default InventoryOrders;
