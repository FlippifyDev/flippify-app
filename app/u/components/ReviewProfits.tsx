import React, { useState, useEffect } from "react";
import { database, ref, get } from "../../api/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../../api/firebaseConfig";
import { saveAs } from "file-saver";
import * as Papa from "papaparse";

interface Filters {
  dateRange: { start: string; end: string };
  itemName: string;
  salePlatform: string;
}

interface Profit {
  itemName: string;
  purchaseDate: string;
  saleDate: string;
  quantity: number;
  purchasePricePerUnit: number;
  salePrice: number;
  platformFees: number;
  shippingCost: number;
  estimatedProfit: number;
  salePlatform: string;
}

const ReviewProfits: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: "", end: "" },
    itemName: "",
    salePlatform: "",
  });

  const [user] = useAuthState(auth);
  const [profits, setProfits] = useState<Profit[]>([]);
  const [filteredProfits, setFilteredProfits] = useState<Profit[]>([]);

  useEffect(() => {
    if (user) {
      const userPurchasesRef = ref(database, `purchases/${user.uid}`);
      const userSalesRef = ref(database, `sales/${user.uid}`);

      get(userPurchasesRef).then((snapshot) => {
        const purchases = snapshot.val() || {};
        get(userSalesRef).then((snapshot) => {
          const sales = snapshot.val() || {};
          const profitsData: Profit[] = [];
          for (const purchaseKey in purchases) {
            const purchase = purchases[purchaseKey];
            for (const saleKey in sales) {
              const sale = sales[saleKey];
              if (sale.itemName === purchase.itemName) {
                const totalSaleRevenue = sale.quantitySold * sale.listingPrice;
                const totalPurchaseCost =
                  sale.quantitySold *
                  (purchase.purchasePrice / purchase.quantity);
                const estimatedProfit =
                  totalSaleRevenue -
                  totalPurchaseCost -
                  totalSaleRevenue * (sale.platformFees / 100) -
                  sale.shippingCost;
                profitsData.push({
                  itemName: sale.itemName,
                  purchaseDate: purchase.purchaseDate,
                  saleDate: sale.saleDate,
                  quantity: sale.quantitySold,
                  purchasePricePerUnit:
                    purchase.purchasePrice / purchase.quantity,
                  salePrice: sale.listingPrice,
                  platformFees: sale.platformFees,
                  shippingCost: sale.shippingCost,
                  estimatedProfit: estimatedProfit,
                  salePlatform: sale.salePlatform,
                });
              }
            }
          }
          setProfits(profitsData);
          setFilteredProfits(profitsData);
        });
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      dateRange: { ...filters.dateRange, [name]: value },
      [name]: value,
    });
  };

  const handleSubmit = () => {
    const filtered = profits.filter((profit) => {
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start)
        : null;
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end)
        : null;
      const profitSaleDate = new Date(profit.saleDate);

      return (
        (!startDate || profitSaleDate >= startDate) &&
        (!endDate || profitSaleDate <= endDate) &&
        (filters.itemName === "" ||
          profit.itemName
            .toLowerCase()
            .includes(filters.itemName.toLowerCase())) &&
        (filters.salePlatform === "" ||
          profit.salePlatform
            .toLowerCase()
            .includes(filters.salePlatform.toLowerCase()))
      );
    });
    setFilteredProfits(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      itemName: "",
      salePlatform: "",
    });
    setFilteredProfits(profits);
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredProfits);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "profits.csv");
  };

  const totalRevenue = filteredProfits.reduce(
    (sum, profit) => sum + profit.salePrice * profit.quantity,
    0
  );
  const totalPurchaseCost = filteredProfits.reduce(
    (sum, profit) => sum + profit.purchasePricePerUnit * profit.quantity,
    0
  );
  const totalFees = filteredProfits.reduce(
    (sum, profit) =>
      sum +
      (profit.salePrice * profit.quantity * (profit.platformFees / 100) +
        profit.shippingCost),
    0
  );
  const totalCosts = totalPurchaseCost + totalFees;
  const netProfit = totalRevenue - totalCosts;
  const totalSales = filteredProfits.reduce(
    (sum, profit) => sum + profit.quantity,
    0
  );

  const totalRevenueNumber = Number(totalRevenue) || 0;
  const totalCostsNumber = Number(totalCosts) || 0;
  const netProfitNumber = Number(netProfit) || 0;
  const totalSalesNumber = Number(totalSales) || 0;

  return (
    <div className="flex flex-col gap-4 font-semibold">
      {/* First Row: Summary and History Search Filter */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* History Search Filter */}
        <section className="flex-1 order-2 sm:order-1">
          <div className="flex flex-col h-full">
            <h2 className="divider font-bold text-lightModeText text-xl pt-8">
              History Lookup
            </h2>
            <form className="form-control flex-1">
              <div className="mb-4">
                <label className="label">
                  <span className="label-text text-lightModeText">
                    Start Date
                  </span>
                </label>
                <input
                  type="date"
                  name="start"
                  value={filters.dateRange.start}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="label">
                  <span className="label-text text-lightModeText">
                    End Date
                  </span>
                </label>
                <input
                  type="date"
                  name="end"
                  value={filters.dateRange.end}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                />
              </div>
              <div className="mb-4">
                <label className="label">
                  <span className="label-text text-lightModeText">
                    Item Name
                  </span>
                </label>
                <input
                  type="text"
                  name="itemName"
                  value={filters.itemName}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
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
                  value={filters.salePlatform}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary bg-white border-black hover:bg-textGradStart hover:border-black w-36 sm:w-42 md:w-48 transition duration-200"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-secondary bg-white border-black hover:bg-textGradStart hover:border-black w-36 sm:w-42 md:w-48 transition duration-200"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Overview */}
        <section className="flex-1 order-1 sm:order-2">
          <div className="flex flex-col h-full">
            <h2 className="divider font-bold text-lightModeText text-xl pt-8">
              Overview
            </h2>
            <div className="flex flex-wrap justify-center mt-8 gap-4 sm:px-2 md:gap-8 text-xs sm:text-sm text-lightModeText font-semibold">
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-gray-500">Total Revenue</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    £{totalRevenue.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-gray-500">Total Costs</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    £{totalCostsNumber.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-gray-500">Net Profit</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    £{netProfitNumber.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-gray-500">No. Sales</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    {totalSalesNumber.toFixed(0)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Second Row: History Table */}
      <section>
        <h2 className="divider pt-8 pb-2 font-bold text-lightModeText text-lg">
          History
        </h2>
        <div className="pb-4">
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="text-lightModeText">
                  <th>Item Name</th>
                  <th>Purchase Date</th>
                  <th>Sale Date</th>
                  <th>Quantity</th>
                  <th>Purchase Price</th>
                  <th>Sale Price</th>
                  <th>Platform Fees</th>
                  <th>Shipping & Other Fees</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfits.length > 0 ? (
                  filteredProfits.map((profit, index) => {
                    const purchasePriceNumber =
                      Number(profit.purchasePricePerUnit) || 0;
                    const salePriceNumber = Number(profit.salePrice) || 0;
                    const platformFeesNumber = Number(profit.platformFees) || 0;
                    const shippingCostNumber = Number(profit.shippingCost) || 0;
                    const estimatedProfitNumber =
                      Number(profit.estimatedProfit) || 0;

                    return (
                      <tr key={index}>
                        <td>{profit.itemName}</td>
                        <td>{profit.purchaseDate}</td>
                        <td>{profit.saleDate}</td>
                        <td>{profit.quantity}</td>
                        <td>{purchasePriceNumber.toFixed(2)}</td>
                        <td>{salePriceNumber.toFixed(2)}</td>
                        <td>{platformFeesNumber.toFixed(2)}</td>
                        <td>{shippingCostNumber.toFixed(2)}</td>
                        <td>{estimatedProfitNumber.toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={9} className="text-center">
                      You have not logged anything yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="btn btn-primary bg-white border-black hover:bg-textGradStart hover:border-black w-full md:w-1/3 mx-auto transition duration-200 flex justify-center"
        >
          Export Data
        </button>
      </section>
    </div>
  );
};

export default ReviewProfits;
