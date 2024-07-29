import React, { useState, useEffect } from 'react';
import { useEstimate } from '../../components/EstimateContext';

interface SalesTrackerTabCalcProfitsProps {
  userData: {
    uid: string;
    customerId: string;
  };
}

const SalesTrackerTabCalcProfits: React.FC<SalesTrackerTabCalcProfitsProps> = ({ userData }) => {
  const { estimate, setEstimate } = useEstimate();
  
  const [listingPrice, setListingPrice] = useState<number | string>(0);
  const [platformFees, setPlatformFees] = useState<number | string>(0);
  const [shippingCost, setShippingCost] = useState<number | string>(0);
  const [estimatedProfit, setEstimatedProfit] = useState(0);

  useEffect(() => {
    const totalPurchaseCost = estimate.purchasedQuantity * estimate.purchasePricePerUnit;
    const totalSaleRevenue = parseFloat(listingPrice as string) * estimate.purchasedQuantity;
    const totalPlatformFees = totalSaleRevenue * (parseFloat(platformFees as string) / 100);
    const totalShippingCost = estimate.purchasedQuantity * parseFloat(shippingCost as string);
    const calculatedProfit = totalSaleRevenue - totalPlatformFees - totalShippingCost - totalPurchaseCost;
    setEstimatedProfit(parseFloat(calculatedProfit.toFixed(2)));
  }, [estimate, listingPrice, platformFees, shippingCost]);

  const handleInputChange = (name: string, value: string) => {
    if (name === 'purchasedQuantity') {
      if (/^\d*$/.test(value)) {
        setEstimate({ ...estimate, purchasedQuantity: value === '' ? 0 : parseInt(value, 10) });
      }
    } else if (name === 'purchasePricePerUnit' || name === 'listingPrice' || name === 'platformFees' || name === 'shippingCost') {
      if (/^\d*\.?\d*$/.test(value)) {
        switch (name) {
          case 'purchasePricePerUnit':
            setEstimate({ ...estimate, purchasePricePerUnit: value === '' ? 0 : parseFloat(value) });
            break;
          case 'listingPrice':
            setListingPrice(value);
            break;
          case 'platformFees':
            setPlatformFees(value);
            break;
          case 'shippingCost':
            setShippingCost(value);
            break;
          default:
            break;
        }
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!parseFloat(e.key) && e.key !== 'Backspace') {
      e.preventDefault();
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
            name="purchasedQuantity"
            value={estimate.purchasedQuantity === 0 ? '' : estimate.purchasedQuantity}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            onKeyDown={handleKeyDown}
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
            name="purchasePricePerUnit"
            value={estimate.purchasePricePerUnit === 0 ? '' : estimate.purchasePricePerUnit}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Enter purchase price"
            step="0.01"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Listing Price (per unit)</span>
          </label>
          <input
            type="text"
            name="listingPrice"
            value={listingPrice === 0 ? '' : listingPrice}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Enter listing price"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Platform Fees (%)</span>
          </label>
          <input
            type="text"
            name="platformFees"
            value={platformFees === 0 ? '' : platformFees}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Enter platform fees"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Shipping Cost (per unit)</span>
          </label>
          <input
            type="text"
            name="shippingCost"
            value={shippingCost === 0 ? '' : shippingCost}
            onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            onKeyDown={handleKeyDown}
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
