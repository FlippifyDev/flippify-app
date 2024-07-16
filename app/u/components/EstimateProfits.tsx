// pages/EstimateProfits.tsx
import React, { useState, useEffect } from 'react';
import { useEstimate } from '../../components/EstimateContext';

const EstimateProfits: React.FC = () => {
  const { estimate, setEstimate } = useEstimate();
  const [listingPrice, setListingPrice] = useState(0);
  const [platformFees, setPlatformFees] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [estimatedProfit, setEstimatedProfit] = useState(0);

  useEffect(() => {
    if (estimate.quantity > 0 && estimate.purchasePrice > 0) {
      const totalPurchaseCost = estimate.quantity * estimate.purchasePrice;
      const totalSaleRevenue = listingPrice * estimate.quantity;
      const totalPlatformFees = (totalSaleRevenue * (platformFees / 100));
      const totalShippingCost = estimate.quantity * shippingCost;
      const calculatedProfit = totalSaleRevenue - totalPlatformFees - totalShippingCost - totalPurchaseCost;
      setEstimatedProfit(calculatedProfit);
    }
  }, [estimate, listingPrice, platformFees, shippingCost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (parseFloat(value) < 0) return;

    if (name === 'listingPrice') {
      setListingPrice(parseFloat(value));
    } else if (name === 'platformFees') {
      setPlatformFees(parseFloat(value));
    } else if (name === 'shippingCost') {
      setShippingCost(parseFloat(value));
    } else {
      setEstimate({ ...estimate, [name]: parseFloat(value) });
    }
  };

  const handleSubmit = () => {
    console.log("Estimated Profit:", estimatedProfit);
    alert(`Estimated Profit: ${estimatedProfit}`);
  };

  return (
    <div>
      <form className="form-control">
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Quantity</span>
          </label>
          <input type="number" name="quantity" value={estimate.quantity} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Purchase Price (per unit)</span>
          </label>
          <input type="number" name="purchasePrice" value={estimate.purchasePrice} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Listing Price (per unit)</span>
          </label>
          <input type="number" name="listingPrice" value={listingPrice} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Platform Fees (%)</span>
          </label>
          <input type="number" name="platformFees" value={platformFees} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Shipping Cost (per unit)</span>
          </label>
          <input type="number" name="shippingCost" value={shippingCost} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <button type="button" onClick={handleSubmit} className="btn btn-primary bg-white border-black hover:bg-textGradStart hover:border-black w-full md:w-1/2 transition duration-200 mx-auto">Calculate Estimated Profit</button>
        <div className="mt-4">
          <h2>Estimated Profit: {estimatedProfit}</h2>
        </div>
      </form>
    </div>
  );
};

export default EstimateProfits;
