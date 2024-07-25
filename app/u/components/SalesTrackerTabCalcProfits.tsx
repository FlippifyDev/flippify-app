import React, { useState, useEffect } from 'react';
import { useEstimate } from '../../components/EstimateContext';

const SalesTrackerTabCalcProfits: React.FC = () => {
  const { estimate, setEstimate } = useEstimate();
  const [listingPrice, setListingPrice] = useState<number | ''>(0);
  const [platformFees, setPlatformFees] = useState<number | ''>(0);
  const [shippingCost, setShippingCost] = useState<number | ''>(0);
  const [estimatedProfit, setEstimatedProfit] = useState(0);

  useEffect(() => {
    if (estimate.purchasedQuantity > 0 && estimate.purchasePricePerUnit > 0) {
      const totalPurchaseCost = estimate.purchasedQuantity * estimate.purchasePricePerUnit;
      const totalSaleRevenue = (typeof listingPrice === 'number' ? listingPrice : 0) * estimate.purchasedQuantity;
      const totalPlatformFees = (totalSaleRevenue * ((typeof platformFees === 'number' ? platformFees : 0) / 100));
      const totalShippingCost = estimate.purchasedQuantity * (typeof shippingCost === 'number' ? shippingCost : 0);
      const calculatedProfit = totalSaleRevenue - totalPlatformFees - totalShippingCost - totalPurchaseCost;
      setEstimatedProfit(parseFloat(calculatedProfit.toFixed(2)));
    }
  }, [estimate, listingPrice, platformFees, shippingCost]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = parseFloat(value);

    if (parsedValue < 0) return;

    if (name === 'listingPrice') {
      setListingPrice(value === '' ? '' : parsedValue);
    } else if (name === 'platformFees') {
      setPlatformFees(value === '' ? '' : parsedValue);
    } else if (name === 'shippingCost') {
      setShippingCost(value === '' ? '' : parsedValue);
    } else {
      setEstimate({
        ...estimate,
        [name]: value === '' ? 0 : parsedValue,
      });
    }
  };

  return (
    <div className="container">
      <form className="form-control mx-auto font-semibold">
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Quantity</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={estimate.purchasedQuantity === 0 ? '' : estimate.purchasedQuantity}
            onChange={handleChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Enter quantity"
            min="1"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Purchase Price (per unit)</span>
          </label>
          <input
            type="number"
            name="purchasePrice"
            value={estimate.purchasePricePerUnit === 0 ? '' : estimate.purchasePricePerUnit}
            onChange={handleChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Enter purchase price"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Listing Price (per unit)</span>
          </label>
          <input
            type="number"
            name="listingPrice"
            value={listingPrice === 0 ? '' : listingPrice}
            onChange={handleChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Enter listing price"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Platform Fees (%)</span>
          </label>
          <input
            type="number"
            name="platformFees"
            value={platformFees === 0 ? '' : platformFees}
            onChange={handleChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Enter platform fees"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Shipping Cost (per unit)</span>
          </label>
          <input
            type="number"
            name="shippingCost"
            value={shippingCost === 0 ? '' : shippingCost}
            onChange={handleChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Enter shipping cost"
          />
        </div>
        <div>
          <h2 className="divider font-bold text-lightModeText text-lg">Estimated Profit: {estimatedProfit.toFixed(2)}</h2>
        </div>
      </form>
    </div>
  );
};

export default SalesTrackerTabCalcProfits;
