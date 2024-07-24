import { database, ref, get, set, push } from '../../api/firebaseConfig';
import { auth } from '../../api/firebaseConfig';
import { ISale, IPurchase } from './SalesTrackerModels';
import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

const SalesTrackerTabAddSale: React.FC = () => {
  const [sale, setSale] = useState<ISale>({
    itemName: '',
    saleDate: '',
    purchaseDate: '',
    salePlatform: '',
    salePrice: 0,
    quantitySold: 0,
    platformFees: 12.5,
    shippingCost: 0,
    purchasePricePerUnit: 0,
  });

  const [purchases, setPurchases] = useState<IPurchase[]>([]);
  const [selectedPurchase, setSelectedPurchase] = useState<string>('');
  const [selectedPurchaseData, setSelectedPurchaseData] = useState<IPurchase | null>(null);
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
  
    // Parse the value based on the input name
    const parsedValue = (name === 'salePrice' || name === 'quantitySold' || name === 'platformFees' || name === 'shippingCost')
      ? parseFloat(value)
      : value;
  
    // Ensure parsedValue is a number and not a string before comparing
    if (['salePrice', 'quantitySold', 'platformFees', 'shippingCost'].includes(name) && typeof parsedValue === 'number' && parsedValue < 0) {
      return; // Prevent setting negative values
    }
  
    // Update state with validated values
    setSale(prevSale => {
      // Handle quantitySold separately for validation
      if (name === 'quantitySold') {
        // Ensure parsedValue is a number
        const quantity = typeof parsedValue === 'number' ? parsedValue : 0;
        // Ensure the quantity does not exceed availability
        return {
          ...prevSale,
          [name]: Math.min(Math.max(quantity, 0), selectedPurchaseData?.availability ?? 0)
        };
      }
  
      // For other fields, simply update the state
      return {
        ...prevSale,
        [name]: parsedValue
      };
    });
  };

  const handlePurchaseSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const purchaseId = e.target.value;
    setSelectedPurchase(purchaseId);

    const selectedData = purchases.find(purchase => purchase.id === purchaseId) || null;
    setSelectedPurchaseData(selectedData);

    if (selectedData) {
      setSale(prevSale => ({
        ...prevSale,
        purchaseDate: selectedData.purchaseDate,
        purchasePricePerUnit: selectedData.purchasePricePerUnit
      }));
    }
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

    try {
      // Add the sale entry with proper numeric types
      await set(newSaleRef, {
        ...sale,
        salePrice: parseFloat(sale.salePrice.toString()),
        quantitySold: parseFloat(sale.quantitySold.toString()),
        platformFees: parseFloat(sale.platformFees.toString()),
        shippingCost: parseFloat(sale.shippingCost.toString()),
        itemName: selectedPurchaseData.itemName
      });
      console.log("Sale added successfully");

      // Update the remaining availability and sold quantity in the selected purchase
      const updatedAvailability = (selectedPurchaseData.availability ?? 0) - sale.quantitySold;
      const updatedSoldQuantity = (selectedPurchaseData.soldQuantity ?? 0) + sale.quantitySold;
      const selectedPurchaseRef = ref(database, `purchases/${user.uid}/${selectedPurchaseData.id}`);

      if (updatedAvailability > 0) {
        // Update the purchase if there's still availability left
        await set(selectedPurchaseRef, {
          ...selectedPurchaseData,
          soldQuantity: updatedSoldQuantity,
          availability: updatedAvailability
        });
      } else {
        // Remove the purchase if the availability is zero or less
        await set(selectedPurchaseRef, null);
      }

      // Reset form fields
      setSale({
        itemName: '',
        saleDate: '',
        purchaseDate: '',
        salePlatform: '',
        salePrice: 0,
        quantitySold: 0,
        platformFees: 12.5,
        shippingCost: 0,
        purchasePricePerUnit: 0
      });
      setSelectedPurchase('');
      setSelectedPurchaseData(null);
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  const totalSaleRevenue = sale.quantitySold * sale.salePrice;
  const totalPurchaseCost = sale.quantitySold * sale.purchasePricePerUnit;
  const estimatedProfit = totalSaleRevenue - totalPurchaseCost - (totalSaleRevenue * (sale.platformFees / 100)) - sale.shippingCost;

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
            <input type="date" name="saleDate" value={sale.saleDate} onChange={handleChange} className="input input-bordered w-full bg-white  placeholder-lightModeText-light" style={{ colorScheme: 'dark' }} />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Sale Platform</span>
            </label>
            <input type="text" name="salePlatform" placeholder="John Lewis, Amazon etc" value={sale.salePlatform} onChange={handleChange} className="input input-bordered w-full bg-white placeholder-lightModeText-light" style={{ colorScheme: 'dark' }} />
          </div>
          <div className="mb-4">
            <label className="label">
              <span className="label-text text-lightModeText">Listing Price per Unit</span>
            </label>
            <input type="number" name="salePrice" value={sale.salePrice} onChange={handleChange} className="input input-bordered w-full bg-white" />
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

export default SalesTrackerTabAddSale;
