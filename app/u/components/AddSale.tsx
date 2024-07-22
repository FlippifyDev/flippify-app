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
  availability: number;
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
        })).filter(purchase => purchase.availability > 0);
        setPurchases(purchasesList);
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (['listingPrice', 'quantitySold', 'platformFees', 'shippingCost'].includes(name) && parseFloat(value) < 0) {
      return;
    }

    setSale({ ...sale, [name]: name === 'quantitySold' ? Math.min(parseFloat(value), selectedPurchaseData?.availability ?? 0) : value });
  };

  const handlePurchaseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const purchaseId = e.target.value;
    setSelectedPurchase(purchaseId);

    const selectedData = purchases.find(purchase => purchase.id === purchaseId) || null;
    setSelectedPurchaseData(selectedData);
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

    if (sale.quantitySold > (selectedPurchaseData.availability ?? 0)) {
      console.error("Quantity sold exceeds available stock");
      return;
    }

    const userSalesRef = ref(database, `sales/${user.uid}`);
    const newSaleRef = push(userSalesRef);

    await set(newSaleRef, { ...sale, itemName: selectedPurchaseData.itemName });

    // Update the remaining availability in the selected purchase
    const updatedAvailability = (selectedPurchaseData.availability ?? 0) - sale.quantitySold;
    const updatedSoldQuantity = (selectedPurchaseData.soldQuantity ?? 0) + sale.quantitySold;
    const selectedPurchaseRef = ref(database, `purchases/${user.uid}/${selectedPurchaseData.id}`);
    await set(selectedPurchaseRef, { ...selectedPurchaseData, soldQuantity: updatedSoldQuantity, availability: updatedAvailability });

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
  const totalPurchaseCost = sale.quantitySold * ((selectedPurchaseData?.purchasePrice ?? 0) / (selectedPurchaseData?.quantity ?? 1));
  const estimatedProfit = totalSaleRevenue - totalPurchaseCost - (totalSaleRevenue * ((parseFloat(sale.platformFees.toString()) / 100))) - parseFloat(sale.shippingCost.toString());

  return (
    <div>
      <form className="form-control grid grid-rows-2 gap-4 px-4 font-semibold sm:grid-rows-none sm:grid-cols-2">
        <section className='col-span-1 row-span-1'>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Select Purchase <span className="text-red-500">*</span></span>
            </label>
            <select name="selectedPurchase" value={selectedPurchase} onChange={handlePurchaseSelect} className="select select-bordered w-full bg-white">
              <option value="">Select a purchase</option>
              {purchases.map((purchase) => (
                <option key={purchase.id} value={purchase.id}>{purchase.itemName}</option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Sale Date</span>
            </label>
            <input type="date" name="saleDate" value={sale.saleDate} onChange={handleChange} className="input input-bordered w-full bg-white text-gray-700 dark:text-gray-300" style={{ colorScheme: 'dark' }} />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Sale Platform</span>
            </label>
            <input type="text" name="salePlatform" value={sale.salePlatform} onChange={handleChange} className="input input-bordered w-full bg-white text-gray-700 dark:text-gray-300" style={{ colorScheme: 'dark' }} />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Listing Price per Unit</span>
            </label>
            <input type="number" name="listingPrice" value={sale.listingPrice} onChange={handleChange} className="input input-bordered w-full bg-white" />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Quantity Sold</span>
            </label>
            <input type="number" name="quantitySold" value={sale.quantitySold} onChange={handleChange} className="input input-bordered w-full bg-white" min={1} max={selectedPurchaseData?.availability ?? 0} />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Platform Fees (%)</span>
            </label>
            <input type="number" name="platformFees" value={sale.platformFees} onChange={handleChange} className="input input-bordered w-full bg-white" />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Shipping Cost</span>
            </label>
            <input type="number" name="shippingCost" value={sale.shippingCost} onChange={handleChange} className="input input-bordered w-full bg-white" />
          </div>
          <div className='flex justify-center'>
            <button type="button" onClick={handleSubmit} disabled={!selectedPurchase} className={`btn ${!selectedPurchase ? 'btn-disabled' : 'btn-primary'} bg-white border-black hover:bg-green-300 hover:border-black w-36 sm:w-42 md:w-48 mx-auto transition duration-200`}>Add Sale</button>
          </div>
        </section>
        <section className='col-span-1 row-span-1'>
          <div className="mt-4">
            <h2 className="divider font-bold text-lightModeText text-lg">Profit Made</h2>
            <h2 className="flex justify-center text-lg font-bold">{isNaN(estimatedProfit) ? '0.00' : estimatedProfit.toFixed(2)}</h2>
          </div>
        </section>
      </form>
    </div>
  );
};

export default AddSale;
