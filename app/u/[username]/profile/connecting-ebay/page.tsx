"use client";

// External Imports
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

// Local Imports
import StoreInformation from "@/app/u/components/home/profile/ebay/StoreInformation";
import { createWarehouse } from "@/app/api/ebay/ebay-connection";

const ConnectingEbayPage = () => {
  const { data: session } = useSession();
  const [warehouseCreated, setWarehouseCreated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  // Get eBay access token from session
  const ebayAccessToken = session?.user?.ebay?.ebayAccessToken;

  // Redirect to login or show a message if there's no session or eBay token
  if (!session || !ebayAccessToken) {
    return (
      <p className="mt-4 text-red-500">
        You must be logged in with eBay to create a warehouse.
      </p>
    );
  }

  const handleSubmitWarehouseData = async (data: any) => {
    setIsLoading(true);
    setStatusMessage("Creating warehouse...");

    try {
      // Call createWarehouse API with necessary params
      const result = await createWarehouse(
        session.user.customerId,
        ebayAccessToken,
        data
      );

      if (result) {
        setWarehouseCreated(true);
        setStatusMessage("Warehouse created successfully!");
      } else {
        setStatusMessage("Failed to create warehouse.");
      }
    } catch (error) {
      console.error("Error creating warehouse:", error);
      setStatusMessage("Error occurred while creating warehouse.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Display StoreInformation form only if the warehouse hasn't been created yet */}
      {!warehouseCreated ? (
        <StoreInformation
          onSubmit={handleSubmitWarehouseData}
          customerId={session.user.customerId}
        />
      ) : (
        <p className="mt-4 text-green-500">Warehouse created successfully!</p>
      )}

      {isLoading && (
        <div className="mt-4 text-blue-500">
          <p>Creating warehouse...</p>
        </div>
      )}

      {statusMessage && (
        <div className="mt-4 text-lg text-gray-700">
          <p>{statusMessage}</p>
        </div>
      )}
    </div>
  );
};

export default ConnectingEbayPage;
