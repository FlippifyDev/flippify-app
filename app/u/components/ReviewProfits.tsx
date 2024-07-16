import React, { useState, useEffect } from "react";
import { database, ref, get } from '../../api/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../api/firebaseConfig';

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
  purchasePrice: number;
  salePrice: number;
  platformFees: number;
  shippingCost: number;
  estimatedProfit: number;
  actualProfit: number;
}

const ReviewProfits: React.FC = () => {
  const [filters, setFilters] = useState<Filters>({
    dateRange: { start: "", end: "" },
    itemName: "",
    salePlatform: "",
  });

  const [user] = useAuthState(auth);
  const [profits, setProfits] = useState<Profit[]>([]);

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
                const totalPurchaseCost = sale.quantitySold * purchase.purchasePrice;
                const estimatedProfit = totalSaleRevenue - totalPurchaseCost - (totalSaleRevenue * (sale.platformFees / 100)) - sale.shippingCost;
                const actualProfit = estimatedProfit; 
                profitsData.push({
                  itemName: sale.itemName,
                  purchaseDate: purchase.purchaseDate,
                  saleDate: sale.saleDate,
                  quantity: sale.quantitySold,
                  purchasePrice: purchase.purchasePrice,
                  salePrice: sale.listingPrice,
                  platformFees: sale.platformFees,
                  shippingCost: sale.shippingCost,
                  estimatedProfit: estimatedProfit,
                  actualProfit: actualProfit
                });
              }
            }
          }
          setProfits(profitsData);
        });
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters({ ...filters, dateRange: { ...filters.dateRange, [name]: value }, [name]: value });
  };

  const handleSubmit = () => {
    console.log(filters);
  };

  return (
    <div>
      <h2>Review Profits</h2>
      <form className="form-control">
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Start Date</span>
          </label>
          <input
            type="date"
            name="start"
            value={filters.dateRange.start}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">End Date</span>
          </label>
          <input
            type="date"
            name="end"
            value={filters.dateRange.end}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Item Name</span>
          </label>
          <input
            type="text"
            name="itemName"
            value={filters.itemName}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Sale Platform</span>
          </label>
          <input
            type="text"
            name="salePlatform"
            value={filters.salePlatform}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <button
          type="button"
          onClick={handleSubmit}
          className="btn btn-primary bg-white border-black hover:bg-textGradStart hover:border-black w-1/2 mx-auto transition duration-200"
        >
          Apply Filters
        </button>
      </form>
      <div>
        <h3>Profit Summary</h3>
        <div>Total Revenue: {/* Calculate and display total revenue */}</div>
        <div>Total Costs: {/* Calculate and display total costs */}</div>
        <div>Net Profit: {/* Calculate and display net profit */}</div>
        <div>
          Top Selling Items: {/* List top-selling items with percentages */}
        </div>
      </div>
      <div>
        <h3>Detailed Table</h3>
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Purchase Date</th>
                <th>Sale Date</th>
                <th>Quantity</th>
                <th>Purchase Price</th>
                <th>Sale Price</th>
                <th>Platform Fees</th>
                <th>Shipping Cost</th>
                <th>Estimated Profit</th>
                <th>Actual Profit</th>
              </tr>
            </thead>
            <tbody>
              {profits.map((profit, index) => (
                <tr key={index}>
                  <td>{profit.itemName}</td>
                  <td>{profit.purchaseDate}</td>
                  <td>{profit.saleDate}</td>
                  <td>{profit.quantity}</td>
                  <td>{profit.purchasePrice}</td>
                  <td>{profit.salePrice}</td>
                  <td>{profit.platformFees}</td>
                  <td>{profit.shippingCost}</td>
                  <td>{profit.estimatedProfit.toFixed(2)}</td>
                  <td>{profit.actualProfit.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <button
        type="button"
        style={{ display: "block", margin: "0 auto" }}
        className="btn btn-primary bg-white border-black hover:bg-textGradStart hover:border-black w-1/2 mx-auto transition duration-200"
      >
        Export Data
      </button>
    </div>
  );
};

export default ReviewProfits;
