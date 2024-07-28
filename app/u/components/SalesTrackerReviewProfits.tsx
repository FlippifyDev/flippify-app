import React, { useState, useEffect } from "react";
import { auth, database, ref, get } from "../../api/auth-firebase/firebaseConfig";
import { ISale, IHistoryGrid } from "./SalesTrackerModels";
import { useAuthState } from "react-firebase-hooks/auth";
import { saveAs } from "file-saver";
import { format } from 'date-fns';
import * as Papa from "papaparse";

interface Filters {
  dateRange: { start: string; end: string };
  itemName: string;
  salePlatform: string;
}

interface SalesTrackerReviewProfitsProps {
  userData: {
    uid: string;
    customerId: string;
  };
}

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, '_');
};

const SalesTrackerReviewProfits: React.FC<SalesTrackerReviewProfitsProps> = ({ userData }) => {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: "", end: formattedToday },
    itemName: "",
    salePlatform: "",
  });

  const [sales, setSales] = useState<IHistoryGrid[]>([]);
  const [filteredSales, setFilteredSales] = useState<IHistoryGrid[]>([]);

  useEffect(() => {
    if (userData) {
      const fetchData = async () => {
        try {
          const sanitizedCustomerId = sanitizePath(userData.customerId);
          const salesRef = ref(database, `sales/${sanitizedCustomerId}`);
          const salesSnapshot = await get(salesRef);
          const salesData = salesSnapshot.val() || {};

          const salesArray: IHistoryGrid[] = [];

          for (const saleKey in salesData) {
            const sale: ISale = salesData[saleKey];

            if (sale.itemName && sale.purchaseDate && sale.saleDate) {
              const salePrice = sale.salePrice || 0;
              const purchasePricePerUnit = sale.purchasePricePerUnit || 0;
              const platformFees = sale.platformFees || 0;
              const shippingCost = sale.shippingCost || 0;

              const totalSaleRevenue = sale.quantitySold * salePrice;
              const totalPurchaseCost =
                sale.quantitySold * purchasePricePerUnit;
              const estimatedProfit =
                totalSaleRevenue -
                totalPurchaseCost -
                totalSaleRevenue * (platformFees / 100) -
                shippingCost;

              salesArray.push({
                ...sale,
                purchaseDate: sale.purchaseDate,
                saleDate: sale.saleDate,
                quantitySold: sale.quantitySold,
                purchasePricePerUnit: purchasePricePerUnit,
                salePrice: salePrice,
                platformFees: platformFees,
                shippingCost: shippingCost,
                estimatedProfit: estimatedProfit,
                salePlatform: sale.salePlatform,
                totalCosts: totalPurchaseCost
              });
            }
          }

          setSales(salesArray);
          setFilteredSales(salesArray);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    }
  }, [userData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name in filters.dateRange) {
      setFilters({
        ...filters,
        dateRange: { ...filters.dateRange, [name]: value },
      });
    } else {
      setFilters({
        ...filters,
        [name]: value,
      });
    }
  };

  const handleSubmit = () => {
    const filtered = sales.filter((sale) => {
      const startDate = filters.dateRange.start
        ? new Date(filters.dateRange.start)
        : null;
      const endDate = filters.dateRange.end
        ? new Date(filters.dateRange.end)
        : null;
      const saleDate = new Date(sale.saleDate);

      return (
        (!startDate || saleDate >= startDate) &&
        (!endDate || saleDate <= endDate) &&
        (filters.itemName === "" ||
          sale.itemName
            .toLowerCase()
            .includes(filters.itemName.toLowerCase())) &&
        (filters.salePlatform === "" ||
          sale.salePlatform
            .toLowerCase()
            .includes(filters.salePlatform.toLowerCase()))
      );
    });
    setFilteredSales(filtered);
  };

  const handleClearFilters = () => {
    setFilters({
      dateRange: { start: "", end: "" },
      itemName: "",
      salePlatform: "",
    });
    setFilteredSales(sales);
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredSales);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales.csv");
  };

  // Calculations
  const totalSaleRevenue = filteredSales.reduce(
    (sum, sale) => sum + sale.salePrice * sale.quantitySold,
    0
  );
  const totalPurchaseCost = filteredSales.reduce(
    (sum, sale) => sum + sale.purchasePricePerUnit * sale.quantitySold,
    0
  );
  const totalShippingCost = filteredSales.reduce(
    (sum, sale) => sum + sale.shippingCost,
    0
  );
  const totalPlatformFees = filteredSales.reduce(
    (sum, sale) => sum + (sale.salePrice * sale.quantitySold * (sale.platformFees / 100)),
    0
  );
  const totalCosts = totalPurchaseCost + totalShippingCost + totalPlatformFees;
  const netProfit = totalSaleRevenue - totalCosts;
  const totalSales = filteredSales.reduce(
    (sum, sale) => sum + sale.quantitySold,
    0
  );

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
                  style={{ colorScheme: "dark" }}
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
                  style={{ colorScheme: "dark" }}
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
                  placeholder="Item Name"
                  value={filters.itemName}
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
                  value={filters.salePlatform}
                  onChange={handleChange}
                  className="input input-bordered w-full bg-white placeholder-lightModeText-light"
                />
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary text-black bg-white border-black hover:bg-textGradStart hover:border-black w-36 sm:w-42 md:w-48 transition duration-200"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-secondary bg-white text-black border-black hover:bg-textGradStart hover:border-black w-36 sm:w-42 md:w-48 transition duration-200"
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
                  <div className="stat-title text-houseBlue">Total Revenue</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    £{totalSaleRevenue.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-houseBlue">Total Costs</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    £{totalCosts.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-houseBlue">Net Profit</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    £{netProfit.toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-houseBlue">No. Sales</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    {totalSales.toFixed(0)}
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
                  <th>Sale Date</th>
                  <th>Purchase Date</th>
                  <th>Item Name</th>
                  <th>Quantity</th>
                  <th>Shipping & Other Fees</th>
                  <th>% Platform Fees</th>
                  <th>Purchase Price</th>
                  <th>Sale Price</th>
                  <th>Costs</th>
                  <th>Profit</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.length > 0 ? (
                  filteredSales.map((sale, index) => {
                    const totalPurchaseCost =
                      sale.purchasePricePerUnit * sale.quantitySold;
                    const totalPlatformFees =
                      sale.salePrice *
                      sale.quantitySold *
                      (sale.platformFees / 100);
                    const totalShippingAndOtherFees = sale.shippingCost;
                    const totalSaleRevenue = sale.salePrice * sale.quantitySold;

                    const totalCosts =
                      totalPurchaseCost +
                      totalShippingAndOtherFees +
                      totalPlatformFees;
                    const profit = totalSaleRevenue - totalCosts;

                    return (
                      <tr key={index}>
                        <td>{sale.saleDate}</td>
                        <td>{sale.purchaseDate}</td>
                        <td>{sale.itemName}</td>
                        <td>{sale.quantitySold}</td>
                        <td>{totalShippingAndOtherFees.toFixed(2)}</td>
                        <td>{sale.platformFees.toFixed(2)}</td>
                        <td>{totalPurchaseCost.toFixed(2)}</td>
                        <td>{totalSaleRevenue.toFixed(2)}</td>
                        <td>{totalCosts.toFixed(2)}</td>
                        <td>{profit.toFixed(2)}</td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center">No sales data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <button
          type="button"
          onClick={handleExport}
          className="btn btn-primary text-black bg-white border-black hover:bg-textGradStart hover:border-black w-full md:w-1/3 mx-auto transition duration-200 flex justify-center"
        >
          Export Data
        </button>
      </section>
    </div>
  );
};

export default SalesTrackerReviewProfits;
