import React, { useState } from 'react';

interface Estimate {
  quantity: number;
  purchasePrice: number;
  websiteName?: string;
}

const EstimateProfits: React.FC = () => {
  const [estimate, setEstimate] = useState<Estimate>({
    quantity: 0,
    purchasePrice: 0,
    websiteName: ''
  });

  const [listingPrice, setListingPrice] = useState(0);
  const [quantitySold, setQuantitySold] = useState(0);
  const [platformFees, setPlatformFees] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstimate({ ...estimate, [name]: parseFloat(value) }); // Ensure numeric values are parsed correctly
  };

  const handleSubmit = () => {
    // Calculate profit
    const totalPurchaseCost = estimate.quantity * estimate.purchasePrice;
    const totalSaleRevenue = listingPrice * estimate.quantity; // Assuming quantity sold matches estimated purchase quantity
    const totalPlatformFees = (totalSaleRevenue * (platformFees / 100));
    const totalShippingCost = estimate.quantity * shippingCost;
    const estimatedProfit = totalSaleRevenue - totalPlatformFees - totalShippingCost - totalPurchaseCost;

    console.log("Estimated Profit:", estimatedProfit);
    // You can display or use the calculated profit as needed
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
          <input type="number" value={listingPrice} onChange={(e) => setListingPrice(parseFloat(e.target.value))} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Platform Fees (%)</span>
          </label>
          <input type="number" value={platformFees} onChange={(e) => setPlatformFees(parseFloat(e.target.value))} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Shipping Cost (per unit)</span>
          </label>
          <input type="number" value={shippingCost} onChange={(e) => setShippingCost(parseFloat(e.target.value))} className="input input-bordered w-full" />
        </div>

        <button type="button" onClick={handleSubmit} className="btn btn-primary bg-white border-black hover:bg-textGradStart hover:border-black w-full md:w-1/2 transition duration-200 mx-auto">Calculate Estimated Profit</button>
      </form>
    </div>
  );
};

export default EstimateProfits;
