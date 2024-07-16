import React, { useState, useEffect } from 'react';
import { database, ref, get, set, push } from '../../api/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../api/firebaseConfig';

interface Purchase {
  id?: string;
  itemName: string;
  purchaseDate: string;
  quantity: number;
  purchasePrice: number;
  websiteName?: string;
}

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
    platformFees: 12.5,
    shippingCost: 0
  });

  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<string>('');
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      const userPurchasesRef = ref(database, `purchases/${user.uid}`);
      get(userPurchasesRef).then((snapshot) => {
        const purchasesData = snapshot.val() || {};
        const purchasesList = Object.keys(purchasesData).map((key) => ({
          ...purchasesData[key],
          id: key
        }));
        setPurchases(purchasesList);
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (['listingPrice', 'quantitySold', 'platformFees', 'shippingCost'].includes(name) && parseFloat(value) < 0) {
      return;
    }
  
    setSale({ ...sale, [name]: parseFloat(value) });
  };

  const handlePurchaseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const purchaseId = e.target.value;
    setSelectedPurchase(purchaseId);
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    if (!selectedPurchase) {
      console.error("No purchase selected");
      return;
    }

    const selectedPurchaseData = purchases.find(purchase => purchase.id === selectedPurchase);
    if (!selectedPurchaseData) {
      console.error("Selected purchase not found");
      return;
    }

    const userSalesRef = ref(database, `sales/${user.uid}`);
    const newSaleRef = push(userSalesRef);

    await set(newSaleRef, { ...sale, itemName: selectedPurchaseData.itemName });

    // Update the remaining quantity in the selected purchase
    const updatedQuantity = selectedPurchaseData.quantity - sale.quantitySold;
    const selectedPurchaseRef = ref(database, `purchases/${user.uid}/${selectedPurchaseData.id}`);
    await set(selectedPurchaseRef, { ...selectedPurchaseData, quantity: updatedQuantity });

    setSale({
      itemName: '',
      saleDate: '',
      salePlatform: '',
      listingPrice: 0,
      quantitySold: 0,
      platformFees: 12.5,
      shippingCost: 0
    });
    setSelectedPurchase('');
  };

  const totalSaleRevenue = sale.quantitySold * sale.listingPrice;
  const estimatedProfit = totalSaleRevenue - (totalSaleRevenue * (sale.platformFees / 100)) - sale.shippingCost;

  return (
    <div>
      <form className="form-control">
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Select Purchase <span className="text-red-500">*</span></span>
          </label>
          <select name="selectedPurchase" value={selectedPurchase} onChange={handlePurchaseSelect} className="select select-bordered w-full">
            <option value="">Select a purchase</option>
            {purchases.map((purchase) => (
              <option key={purchase.id} value={purchase.id}>{purchase.itemName}</option>
            ))}
          </select>
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
        <button type="button" onClick={handleSubmit} disabled={!selectedPurchase} className={`btn ${!selectedPurchase ? 'btn-disabled' : 'btn-primary'} bg-white border-black hover:bg-textGradStart hover:border-black w-1/2 mx-auto transition duration-200`}>Add Sale</button>
      </form>
    </div>
  );
};

export default AddSale;
