// pages/AddSale.tsx
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
  soldQuantity?: number;
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
  const [selectedPurchaseData, setSelectedPurchaseData] = useState<Purchase | null>(null);
  const [user] = useAuthState(auth);

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

    setSale({ ...sale, [name]: value });
  };

  const handlePurchaseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const purchaseId = e.target.value;
    setSelectedPurchase(purchaseId);

    const selectedData = purchases.find(purchase => purchase.id === purchaseId);
    setSelectedPurchaseData(selectedData || null);
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

    if (!selectedPurchaseData) {
      console.error("Selected purchase data not found");
      return;
    }

    const userSalesRef = ref(database, `sales/${user.uid}`);
    const newSaleRef = push(userSalesRef);

    await set(newSaleRef, { ...sale, itemName: selectedPurchaseData.itemName });

    // Update the remaining quantity in the selected purchase
    const updatedQuantity = selectedPurchaseData.quantity - sale.quantitySold;
    const updatedSoldQuantity = (selectedPurchaseData.soldQuantity || 0) + sale.quantitySold;
    const selectedPurchaseRef = ref(database, `purchases/${user.uid}/${selectedPurchaseData.id}`);
    await set(selectedPurchaseRef, { ...selectedPurchaseData, quantity: updatedQuantity, soldQuantity: updatedSoldQuantity });

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
    setSelectedPurchaseData(null);
  };

  const totalSaleRevenue = sale.quantitySold * parseFloat(sale.listingPrice.toString());
  const totalPurchaseCost = sale.quantitySold * (selectedPurchaseData?.purchasePrice || 0);
  const estimatedProfit = totalSaleRevenue - totalPurchaseCost - (totalSaleRevenue * (parseFloat(sale.platformFees.toString()) / 100)) - parseFloat(sale.shippingCost.toString());

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
          <input type="text" name="salePlatform" value={sale.salePlatform} onChange={handleChange} className="input input-bordered w-full" />
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
          <input type="number" name="quantitySold" value={sale.quantitySold} onChange={handleChange} className="input input-bordered w-full" max={selectedPurchaseData ? selectedPurchaseData.quantity : 0} />
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
        <button type="button" onClick={handleSubmit} disabled={!selectedPurchase} className={`btn ${!selectedPurchase ? 'btn-disabled' : 'btn-primary'} bg-white border-black hover:bg-textGradStart hover:border-black w-1/2 mx-auto transition duration-200`}>Add Sale</button>
        <div className="mt-4">
          <h2>Total Sale Revenue: {isNaN(totalSaleRevenue) ? '0.00' : totalSaleRevenue.toFixed(2)}</h2>
          <h2>Estimated Profit: {isNaN(estimatedProfit) ? '0.00' : estimatedProfit.toFixed(2)}</h2>
        </div>
      </form>
    </div>
  );
};

export default AddSale;
