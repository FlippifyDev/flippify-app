import React, { useState, useEffect } from "react";
import {
  database,
  ref,
  get,
  set,
  push,
} from "../../api/auth-firebase/firebaseConfig";
import { ISale, IPurchase } from "./SalesTrackerModels";
import { format } from "date-fns";

interface SalesTrackerTabAddSaleProps {
  userData: {
    uid: string;
    customerId: string;
  };
}

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, "_");
};

const SalesTrackerTabAddSale: React.FC<SalesTrackerTabAddSaleProps> = ({
  userData,
}) => {
  const today = new Date();
  const formattedToday = format(today, "yyyy-MM-dd");

  const [sale, setSale] = useState<ISale>({
    itemName: "",
    saleDate: formattedToday,
    purchaseDate: "",
    salePlatform: "",
    purchasePlatform: "",
    salePrice: 0,
    quantitySold: 0,
    platformFees: 12.5,
    shippingCost: 0,
    purchasePricePerUnit: 0,
  });

  const [purchases, setPurchases] = useState<IPurchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<string>("");
  const [selectedPurchaseData, setSelectedPurchaseData] =
    useState<IPurchase | null>(null);

  useEffect(() => {
    if (userData) {
      const sanitizedCustomerId = sanitizePath(userData.customerId);
      const userPurchasesRef = ref(
        database,
        `purchases/${sanitizedCustomerId}`
      );
      get(userPurchasesRef).then((snapshot) => {
        const purchasesData = snapshot.val() || {};
        const purchasesList = Object.keys(purchasesData)
          .map((key) => ({
            ...purchasesData[key],
            id: key,
          }))
          .filter((purchase) => purchase.availability > 0);
        setPurchases(purchasesList);
      });
    }
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const parsedValue =
      name === "salePrice" ||
      name === "quantitySold" ||
      name === "platformFees" ||
      name === "shippingCost"
        ? parseFloat(value)
        : value;

    if (
      ["salePrice", "quantitySold", "platformFees", "shippingCost"].includes(
        name
      ) &&
      typeof parsedValue === "number" &&
      parsedValue < 0
    ) {
      return;
    }

    setSale((prevSale) => {
      if (name === "quantitySold") {
        const quantity = typeof parsedValue === "number" ? parsedValue : 0;
        return {
          ...prevSale,
          [name]: Math.min(
            Math.max(quantity, 0),
            selectedPurchaseData?.availability ?? 0
          ),
        };
      }

      return {
        ...prevSale,
        [name]: parsedValue,
      };
    });
  };

  const handlePurchaseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const purchaseId = e.target.value;
    setSelectedPurchase(purchaseId);

    const selectedData =
      purchases.find((purchase) => purchase.id === purchaseId) || null;
    setSelectedPurchaseData(selectedData);

    if (selectedData) {
      setSale((prevSale) => ({
        ...prevSale,
        purchaseDate: selectedData.purchaseDate,
        purchasePricePerUnit: selectedData.purchasePricePerUnit,
        purchasePlatform: selectedData.websiteName,
      }));
    }
  };

  const handleSubmit = async () => {
    if (!userData) {
      console.error("User data is not available");
      return;
    }

    if (!selectedPurchase) {
      console.error("No purchase selected");
      return;
    }

    if (!selectedPurchaseData) {
      console.error("Selected purchase data not found");
      return;
    }

    if (sale.quantitySold > (selectedPurchaseData.availability ?? 0)) {
      console.error("Quantity sold exceeds available stock");
      return;
    }

    const sanitizedCustomerId = sanitizePath(userData.customerId);
    const userSalesRef = ref(database, `sales/${sanitizedCustomerId}`);
    const newSaleRef = push(userSalesRef);

    try {
      await set(newSaleRef, {
        ...sale,
        salePrice: parseFloat(sale.salePrice.toString()),
        saleDate: format(sale.saleDate, "dd/MM/yyyy"),
        quantitySold: parseFloat(sale.quantitySold.toString()),
        platformFees: parseFloat(sale.platformFees.toString()),
        shippingCost: parseFloat(sale.shippingCost.toString()),
        itemName: selectedPurchaseData.itemName,
        purchasePlatform: selectedPurchaseData.websiteName,
      });

      const updatedAvailability =
        (selectedPurchaseData.availability ?? 0) - sale.quantitySold;
      const updatedSoldQuantity =
        (selectedPurchaseData.soldQuantity ?? 0) + sale.quantitySold;
      const selectedPurchaseRef = ref(
        database,
        `purchases/${sanitizedCustomerId}/${selectedPurchaseData.id}`
      );

      if (updatedAvailability > 0) {
        await set(selectedPurchaseRef, {
          ...selectedPurchaseData,
          soldQuantity: updatedSoldQuantity,
          availability: updatedAvailability,
        });
      } else {
        await set(selectedPurchaseRef, null);
      }

      setSale({
        itemName: "",
        saleDate: formattedToday,
        purchaseDate: "",
        salePlatform: "",
        purchasePlatform: "",
        salePrice: 0,
        quantitySold: 0,
        platformFees: 12.5,
        shippingCost: 0,
        purchasePricePerUnit: 0,
      });
      setSelectedPurchase("");
      setSelectedPurchaseData(null);
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  const totalSaleRevenue = sale.quantitySold * sale.salePrice;
  const totalPurchaseCost = sale.quantitySold * sale.purchasePricePerUnit;
  const estimatedProfit =
    totalSaleRevenue -
    totalPurchaseCost -
    totalSaleRevenue * (sale.platformFees / 100) -
    sale.shippingCost;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!parseFloat(e.key) && e.key !== "Backspace" && e.key !== '.') {
      e.preventDefault();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <form className="form-control grid grid-rows-2 gap-4 px-4 font-semibold sm:grid-rows-none sm:grid-cols-2">
        <section className="col-span-1 row-span-1">
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">
                Select Purchase <span className="text-red-500">*</span>
              </span>
            </label>
            <select
              name="selectedPurchase"
              value={selectedPurchase}
              onChange={handlePurchaseSelect}
              className="select select-bordered w-full bg-white"
            >
              <option value="">Select a purchase</option>
              {purchases.map((purchase) => (
                <option key={purchase.id} value={purchase.id}>
                  {purchase.itemName}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Sale Date</span>
            </label>
            <input
              type="date"
              name="saleDate"
              value={sale.saleDate}
              onChange={handleChange}
              className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">
                Sale Platform
              </span>
            </label>
            <input
              type="text"
              name="salePlatform"
              placeholder="John Lewis, Amazon etc"
              value={sale.salePlatform}
              onChange={handleChange}
              className="input input-bordered w-full bg-white placeholder-lightModeText-light"
              style={{ colorScheme: "dark" }}
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">
                Listing Price per Unit
              </span>
            </label>
            <input
              type="number"
              name="salePrice"
              value={sale.salePrice}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="input input-bordered w-full bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">
                Quantity Sold
              </span>
            </label>
            <input
              type="number"
              name="quantitySold"
              value={sale.quantitySold}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="input input-bordered w-full bg-white"
              min={1}
              max={selectedPurchaseData?.availability ?? 0}
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">
                Platform Fees (%)
              </span>
            </label>
            <input
              type="number"
              name="platformFees"
              value={sale.platformFees}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="input input-bordered w-full bg-white"
            />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">
                Shipping Cost
              </span>
            </label>
            <input
              type="number"
              name="shippingCost"
              value={sale.shippingCost}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              className="input input-bordered w-full bg-white"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedPurchase}
              className={`btn ${
                !selectedPurchase ? "btn-disabled" : "btn-primary"
              } bg-white text-black border-black hover:bg-green-300 hover:border-black w-36 sm:w-42 md:w-48 mx-auto transition duration-200`}
            >
              Add Sale
            </button>
          </div>
        </section>
        <section className="col-span-1 row-span-1">
          <div className="mt-4">
            <h2 className="divider font-bold text-lightModeText text-lg">
              Profit Made
            </h2>
            <h2 className="flex justify-center text-lg font-bold">
              {isNaN(estimatedProfit) ? "0.00" : estimatedProfit.toFixed(2)}
            </h2>
          </div>
        </section>
      </form>
    </div>
  );
};

export default SalesTrackerTabAddSale;
