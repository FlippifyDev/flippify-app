import React, { useState, useEffect } from "react";
import { database, ref, get } from "../../../api/auth-firebase/firebaseConfig";
import { IHistoryGrid, ISale } from "./SalesTrackerModels";
import { format, subMonths, parse } from 'date-fns';
import * as Papa from "papaparse";
import { useSession } from 'next-auth/react';
import { saveAs } from 'file-saver';

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, '_');
};

const currencySymbols: Record<'GBP' | 'USD' | 'EUR', string> = {
  GBP: '£',
  USD: '$',
  EUR: '€',
};

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

const SalesTrackerReviewProfits: React.FC<SalesTrackerReviewProfitsProps> = ({ userData }) => {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');
  const formattedOneMonthAgo = format(subMonths(today, 1), 'yyyy-MM-dd');

  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: formattedOneMonthAgo, end: formattedToday },
    itemName: "",
    salePlatform: "",
  });

  const [sales, setSales] = useState<IHistoryGrid[]>([]);
  const [filteredSales, setFilteredSales] = useState<IHistoryGrid[]>([]);
  const { data: session } = useSession();
  const [currency, setCurrency] = useState<'GBP' | 'USD' | 'EUR'>('GBP');

  useEffect(() => {
    const loadUserCurrency = async () => {
      if (session && session.user) {
        const customerId = session.user.customerId as string;
        const userRef = ref(database, `users/${customerId}`);

        try {
          const snapshot = await get(userRef);
          const userData = snapshot.val();
          const userCurrency = userData?.currency || 'GBP';
          setCurrency(userCurrency as 'GBP' | 'USD' | 'EUR');
        } catch (error) {
          console.error("Error loading user currency:", error);
        }
      }
    };

    loadUserCurrency();
  }, [session]);

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
              const totalPurchaseCost = sale.purchasePricePerUnit * sale.quantitySold;
              const totalPlatformFees = sale.salePrice * sale.quantitySold * (sale.platformFees / 100);
              const totalShippingAndOtherFees = sale.shippingCost;
              const totalCosts = totalPurchaseCost + totalShippingAndOtherFees + totalPlatformFees;
              const totalSaleRevenue = sale.salePrice * sale.quantitySold;
              const profit = totalSaleRevenue - totalCosts;

              salesArray.push({
                ...sale,
                purchaseDate: sale.purchaseDate,
                saleDate: sale.saleDate,
                quantitySold: sale.quantitySold,
                purchasePricePerUnit: sale.purchasePricePerUnit || 0,
                salePrice: sale.salePrice || 0,
                platformFees: sale.platformFees || 0,
                shippingCost: sale.shippingCost || 0,
                estimatedProfit: profit,
                salePlatform: sale.salePlatform,
                totalCosts: totalCosts,
              });
            }
          }

          setSales(salesArray);
          setFilteredSales(salesArray);
        } catch (error) {
          console.error("Error fetching sales data:", error);
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
      dateRange: { start: formattedOneMonthAgo, end: formattedToday },
      itemName: "",
      salePlatform: "",
    });
    setFilteredSales(sales);
  };

  const handleExport = () => {
    const formattedSales = filteredSales.map(sale => {
      // Correctly parsing the dates
      const parsedSaleDate = parse(sale.saleDate, 'dd/MM/yyyy', new Date());
      const parsedPurchaseDate = parse(sale.purchaseDate, 'dd/MM/yyyy', new Date());
  
      return {
        ...sale,
        // Format the parsed date
        saleDate: isNaN(parsedSaleDate.getTime()) ? sale.saleDate : format(parsedSaleDate, 'yyyy-MM-dd'),
        purchaseDate: isNaN(parsedPurchaseDate.getTime()) ? sale.purchaseDate : format(parsedPurchaseDate, 'yyyy-MM-dd'),
      };
    });
  
    const csv = Papa.unparse(formattedSales);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "sales.csv");
  };
  

  const currencySymbol = currencySymbols[currency]; // Just update symbol

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
                  className="input input-bordered w-full bg-white placeholder-lightModeText-light"
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
                  className="input input-bordered w-full bg-white placeholder-lightModeText-light"
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
                  className="btn btn-primary text-white bg-houseBlue border-black hover:bg-houseHoverBlue hover:border-black w-36 sm:w-42 md:w-48 transition duration-200"
                >
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="btn btn-secondary bg-white text-black border-black hover:bg-gray-100 hover:border-black w-36 sm:w-42 md:w-48 transition duration-200"
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
                    {currencySymbol}{sales.reduce((sum, sale) => sum + sale.salePrice * sale.quantitySold, 0).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-houseBlue">Total Costs</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    {currencySymbol}{sales.reduce((sum, sale) => sum + sale.purchasePricePerUnit * sale.quantitySold + sale.shippingCost + (sale.salePrice * sale.quantitySold * (sale.platformFees / 100)), 0).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-houseBlue">Net Profit</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    {currencySymbol}{sales.reduce((sum, sale) => sum + (sale.salePrice * sale.quantitySold) - (sale.purchasePricePerUnit * sale.quantitySold + sale.shippingCost + (sale.salePrice * sale.quantitySold * (sale.platformFees / 100))), 0).toFixed(2)}
                  </div>
                </div>
              </div>
              <div className="stats shadow-md bg-white w-56 flex-shrink-0 overflow-x-auto p-4 hover:shadow-lg">
                <div className="stat">
                  <div className="stat-title text-houseBlue">No. Sales</div>
                  <div className="stat-value text-2xl lg:text-3xl text-black">
                    {sales.reduce((sum, sale) => sum + sale.quantitySold, 0)}
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
                        <td>{currencySymbol}{totalShippingAndOtherFees.toFixed(2)}</td>
                        <td>{sale.platformFees.toFixed(2)}</td>
                        <td>{currencySymbol}{totalPurchaseCost.toFixed(2)}</td>
                        <td>{currencySymbol}{totalSaleRevenue.toFixed(2)}</td>
                        <td>{currencySymbol}{totalCosts.toFixed(2)}</td>
                        <td>{currencySymbol}{profit.toFixed(2)}</td>
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
          className="btn text-white bg-houseBlue hover:bg-houseHoverBlue w-full md:w-1/3 mx-auto transition duration-200 flex justify-center"
        >
          Export Data
        </button>
      </section>
    </div>
  );
};

export default SalesTrackerReviewProfits;
