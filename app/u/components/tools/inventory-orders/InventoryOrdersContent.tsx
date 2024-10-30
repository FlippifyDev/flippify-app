"use client";

import React, { useEffect, useState } from "react";

const InventoryOrdersContent: React.FC = () => {
  const [inventoryData, setInventoryData] = useState<any[]>([]);
  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInventoryAndOrders = async () => {
      try {
        const [ordersResponse] = await Promise.all([
          //fetch("/api/ebay/inventory"),
          fetch("/api/ebay/orders"),
        ]);

        //if (!inventoryResponse.ok || !ordersResponse.ok) {
        //  throw new Error("Failed to fetch inventory or orders.");
        //}
        if (!ordersResponse.ok) {
          throw new Error("Failed to fetch orders.");
        }

        //const inventory = await inventoryResponse.json();
        const orders = await ordersResponse.json();

        //setInventoryData(inventory.inventoryItems || []);
        setOrderData(orders.orders || []);
      } catch (error: any) {
        console.error("Error fetching inventory or orders:", error);
        setError(error.message || "Failed to load inventory or orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchInventoryAndOrders();
  }, []);

  if (loading) {
    return <div>Loading inventory and orders...</div>;
  }

  return (
    <div className="w-full mb-4">
      <h2 className="text-xl font-bold mb-4">Inventory & Order Management</h2>

      {error ? (
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p>Unable to load inventory or orders. Please try again later.</p>
        </div>
      ) : (
        <>
          <h3 className="text-lg font-semibold">Inventory:</h3>
          {inventoryData.length > 0 ? (
            inventoryData.map((item, index) => (
              <div key={index} className="mb-4">
                <p>Name: {item.name}</p>
                <p>SKU: {item.sku}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {item.price}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No inventory items available.</p>
          )}

          {/*
          <h3 className="text-lg font-semibold mt-4">Orders:</h3>
          {orderData.length > 0 ? (
            orderData.map((order, index) => (
              <div key={index} className="mb-4">
                <p>Order ID: {order.id}</p>
                <p>Item Name: {order.itemName}</p>
                <p>Quantity: {order.quantity}</p>
                <p>Status: {order.status}</p>
                <p>Price: {order.price}</p>
                <hr />
              </div>
            ))
          ) : (
            <p>No orders available.</p>
          )}
          */}
        </>
      )}
    </div>
  );
};

export default InventoryOrdersContent;
