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
      setEstimatedProfit(parseFloat(calculatedProfit.toFixed(2)));
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

  return (
    <div>
      <form className="form-control h-full">
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Quantity</span>
          </label>
          <input type="number" name="quantity" value={estimate.quantity} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Purchase Price (per unit)</span>
          </label>
          <input type="number" name="purchasePrice" value={estimate.purchasePrice} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Listing Price (per unit)</span>
          </label>
          <input type="number" name="listingPrice" value={listingPrice} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Platform Fees (%)</span>
          </label>
          <input type="number" name="platformFees" value={platformFees} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Shipping Cost (per unit)</span>
          </label>
          <input type="number" name="shippingCost" value={shippingCost} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div>
          <h2 className="divider font-bold text-lightModeText text-lg">Estimated Profit: {estimatedProfit.toFixed(2)}</h2>
        </div>
      </form>
    </div>
  );
};

export default EstimateProfits;
