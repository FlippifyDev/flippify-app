// pages/AddPurchase.tsx
import React, { useState } from 'react';
import { database, ref, get, set, push } from '../../api/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../api/firebaseConfig';
import { useEstimate } from '../../components/EstimateContext';

interface Purchase {
  itemName: string;
  purchaseDate: string;
  quantity: number;
  purchasePrice: number;
  websiteName?: string;
}

const AddPurchase: React.FC = () => {
  const [purchase, setPurchase] = useState<Purchase>({
    itemName: '',
    purchaseDate: '',
    quantity: 1,
    purchasePrice: 0,
    websiteName: ''
  });

  const { setEstimate } = useEstimate();
  const [user, loading, error] = useAuthState(auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if ((name === 'quantity' || name === 'purchasePrice') && parseFloat(value) < 0) {
      return;
    }

    const updatedPurchase = { ...purchase, [name]: parseFloat(value) };
    setPurchase(updatedPurchase);
    setEstimate({ quantity: updatedPurchase.quantity, purchasePrice: updatedPurchase.purchasePrice, websiteName: updatedPurchase.websiteName });
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    const userPurchasesRef = ref(database, `purchases/${user.uid}`);
    const newPurchaseRef = push(userPurchasesRef);

    await set(newPurchaseRef, purchase);

    setPurchase({
      itemName: '',
      purchaseDate: '',
      quantity: 1,
      purchasePrice: 0,
      websiteName: ''
    });
  };

  return (
    <div className="container mx-auto">
      <form className="form-control">
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Item Name</span>
          </label>
          <input type="text" name="itemName" value={purchase.itemName} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Purchase Date</span>
          </label>
          <input type="date" name="purchaseDate" value={purchase.purchaseDate} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Quantity</span>
          </label>
          <input type="number" name="quantity" value={purchase.quantity} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Purchase Price</span>
          </label>
          <input type="number" name="purchasePrice" value={purchase.purchasePrice} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text">Website Name</span>
          </label>
          <input type="text" name="websiteName" value={purchase.websiteName} onChange={handleChange} className="input input-bordered w-full" />
        </div>
        <div className="grid grid-cols-2 gap-8">
          <button type="button" onClick={handleSubmit} className="btn btn-primary bg-white border-black hover:bg-textGradStart ml-4 hover:border-black transition duration-200">Add Purchase</button>
          <button type="button" onClick={() => setPurchase({
            itemName: '',
            purchaseDate: '',
            quantity: 1,
            purchasePrice: 0,
            websiteName: ''
          })} className="btn btn-primary bg-white border-black hover:bg-textGradStart mr-4 hover:border-black transition duration-200">Clear All</button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;
