// pages/AddPurchase.tsx

import React, { useState, useEffect } from 'react';
import { database, ref, push, get, child, set } from '../../api/firebaseConfig'; // Adjust the path as necessary
import { useSession } from 'next-auth/react';

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
    quantity: 0,
    purchasePrice: 0,
    websiteName: ''
  });

  const { data: session } = useSession();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Ensure quantity and purchasePrice are not negative
    if ((name === 'quantity' || name === 'purchasePrice') && parseFloat(value) < 0) {
      return; // Do not update state if input is negative
    }

    setPurchase({ ...purchase, [name]: value });
  };

  const handleSubmit = async () => {
    if (!session?.user?.name) {
      console.error("User is not logged in");
      return;
    }

    const username = session.user.name; // Get the username from the session
    const userPurchasesRef = ref(database, `purchases/${username}`);

    // Fetch existing purchases to determine the next increment number
    const snapshot = await get(userPurchasesRef);
    const purchases = snapshot.val();
    const incrementNumber = purchases ? Object.keys(purchases).length + 1 : 1;

    // Create a unique key for the new purchase
    const purchaseKey = `${username}-${incrementNumber}`;

    // Save the purchase to the database with the unique key
    const newPurchaseRef = child(userPurchasesRef, purchaseKey);
    await set(newPurchaseRef, { ...purchase, username });

    // Clear form after submission
    setPurchase({
      itemName: '',
      purchaseDate: '',
      quantity: 0,
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
            quantity: 0,
            purchasePrice: 0,
            websiteName: ''
          })} className="btn btn-primary bg-white border-black hover:bg-textGradStart mr-4 hover:border-black transition duration-200">Clear All</button>
        </div>
      </form>
    </div>
  );
};

export default AddPurchase;
