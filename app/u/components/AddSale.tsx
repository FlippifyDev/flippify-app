import React, { useState } from 'react';

interface Sale {
  itemName: string;
  saleDate: string;
  salePlatform: string;
  listingPrice: number;
  quantitySold: number;
  platformFees: number;
  shippingCost: number;
}

const AddSale: React.FC = () => {
  const [sale, setSale] = useState<Sale>({
    itemName: '',
    saleDate: '',
    salePlatform: '',
    listingPrice: 0,
    quantitySold: 0,
    platformFees: 12.5, // default eBay fee
    shippingCost: 0
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSale({ ...sale, [name]: value });
  };

  const handleSubmit = () => {
    // Logic to handle adding the sale
    console.log(sale);
  };

  const totalSaleRevenue = sale.quantitySold * sale.listingPrice;
  const estimatedProfit = totalSaleRevenue - (totalSaleRevenue * (sale.platformFees / 100)) - sale.shippingCost;

  return (
    <div>
      <form className="form-control">
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Item Name</span>
          </label>
          <input type="text" name="itemName" value={sale.itemName} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Sale Date</span>
          </label>
          <input type="date" name="saleDate" value={sale.saleDate} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Sale Platform</span>
          </label>
          <select name="salePlatform" value={sale.salePlatform} onChange={handleChange} className="select select-bordered w-full">
            <option value="eBay">eBay</option>
            <option value="Amazon">Amazon</option>
            <option value="Custom">Custom</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Listing Price per Unit</span>
          </label>
          <input type="number" name="listingPrice" value={sale.listingPrice} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Quantity Sold</span>
          </label>
          <input type="number" name="quantitySold" value={sale.quantitySold} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Platform Fees (%)</span>
          </label>
          <input type="number" name="platformFees" value={sale.platformFees} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Shipping Cost</span>
          </label>
          <input type="number" name="shippingCost" value={sale.shippingCost} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Total Sale Revenue</span>
          </label>
          <input type="text" value={totalSaleRevenue} readOnly className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Estimated Profit</span>
          </label>
          <input type="text" value={estimatedProfit} readOnly className="input input-bordered w-full" />
        </div>
        <button type="button" onClick={handleSubmit} className="btn btn-primary bg-white border-black hover:bg-textGradStart hover:border-black w-1/2 mx-auto transition duration-200">Add Sale</button>
      </form>
    </div>
  );
};

export default AddSale;
