import React, { useEffect, useState } from "react";

// Define types for Inventory and Orders
interface InventoryItem {
  name: string;
  sku: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  itemName: string;
  quantity: number;
  status: string;
  price: number;
}

const InventoryOrdersContent = () => {
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [ordersData, setOrdersData] = useState<Order[]>([]);

  useEffect(() => {
    // Fetch inventory data
    const fetchInventoryData = async () => {
      try {
        const response = await fetch("/api/ebay/inventory");
        const data: InventoryItem[] = await response.json();
        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching inventory:", error);
      }
    };

    // Fetch orders data
    const fetchOrdersData = async () => {
      try {
        const response = await fetch("/api/ebay/orders");
        const data: Order[] = await response.json();
        setOrdersData(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchInventoryData();
    fetchOrdersData();
  }, []);

  return (
    <div className="w-full mb-4">
      <h2 className="text-xl font-bold mb-4">Inventory & Order Management</h2>

      {/* Inventory Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Inventory</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Item Name</th>
              <th className="py-2 px-4 border-b">SKU</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Price</th>
            </tr>
          </thead>
          <tbody>
            {inventoryData.length > 0 ? (
              inventoryData.map((item, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{item.name}</td>
                  <td className="py-2 px-4 border-b">{item.sku}</td>
                  <td className="py-2 px-4 border-b">{item.quantity}</td>
                  <td className="py-2 px-4 border-b">{item.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b text-center" colSpan={4}>
                  No inventory data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Orders Section */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Orders</h3>
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Order ID</th>
              <th className="py-2 px-4 border-b">Item Name</th>
              <th className="py-2 px-4 border-b">Quantity</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Price</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.length > 0 ? (
              ordersData.map((order, index) => (
                <tr key={index}>
                  <td className="py-2 px-4 border-b">{order.id}</td>
                  <td className="py-2 px-4 border-b">{order.itemName}</td>
                  <td className="py-2 px-4 border-b">{order.quantity}</td>
                  <td className="py-2 px-4 border-b">{order.status}</td>
                  <td className="py-2 px-4 border-b">{order.price}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-2 px-4 border-b text-center" colSpan={5}>
                  No orders data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryOrdersContent;
