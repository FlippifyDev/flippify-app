import React, { useState } from 'react';
import { database, ref, set, push } from '../../api/firebaseConfig';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../api/firebaseConfig';
import { useEstimate } from '../../components/EstimateContext';

interface Purchase {
  itemName: string;
  purchaseDate: string;
  quantity: number;
  purchasePrice: number;
  websiteName?: string;
  availability: number;
}

const AddPurchase: React.FC = () => {
  const [purchase, setPurchase] = useState<Purchase>({
    itemName: '',
    purchaseDate: '',
    quantity: 1,
    purchasePrice: 0,
    websiteName: '',
    availability: 1
  });

  const { setEstimate } = useEstimate();
  const [user] = useAuthState(auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if ((name === 'quantity' || name === 'purchasePrice') && parseFloat(value) < 0) {
      return;
    }

    const updatedPurchase = { ...purchase, [name]: name === 'quantity' || name === 'purchasePrice' ? parseFloat(value) : value };
    if (name === 'quantity') {
      updatedPurchase.availability = parseFloat(value);
    }
    setPurchase(updatedPurchase);

    // Update the context
    setEstimate({
      quantity: updatedPurchase.quantity,
      purchasePrice: updatedPurchase.purchasePrice / updatedPurchase.quantity,
      websiteName: updatedPurchase.websiteName,
    });
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
      websiteName: '',
      availability: 1
    });
  };

  return (
    <div className="container mx-auto font-semibold">
      <form className="form-control">
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Item Name</span>
          </label>
          <input type="text" name="itemName" value={purchase.itemName} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Purchase Date</span>
          </label>
          <input type="date" name="purchaseDate" value={purchase.purchaseDate} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Quantity</span>
          </label>
          <input type="number" name="quantity" value={purchase.quantity} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Total Purchase Price</span>
          </label>
          <input type="number" name="purchasePrice" value={purchase.purchasePrice} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Website Name</span>
          </label>
          <input type="text" name="websiteName" value={purchase.websiteName} onChange={handleChange} className="input input-bordered w-full bg-white" />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button type="button" onClick={handleSubmit} className="btn btn-primary w-36 sm:w-42 md:w-48 bg-white border-black hover:bg-textGradStart hover:border-black transition duration-200">Add Purchase</button>
          <button type="button" onClick={() => setPurchase({
            itemName: '',
            purchaseDate: '',
            quantity: 1,
            purchasePrice: 0,
            websiteName: '',
            availability: 1
          })} className="btn btn-primary w-36 sm:w-42 md:w-48 bg-white border-black hover:bg-textGradStart hover:border-black transition duration-200">Clear All</button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;
