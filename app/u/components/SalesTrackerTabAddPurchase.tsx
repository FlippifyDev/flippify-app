import { database, ref, set, push } from '../../api/firebaseConfig';
import { useEstimate } from '../../components/EstimateContext';
import { auth } from '../../api/firebaseConfig';
import { IPurchase } from './SalesTrackerModels';

import { useAuthState } from 'react-firebase-hooks/auth';
import React, { useState } from 'react';
import { format } from 'date-fns';

const SalesTrackerTabAddPurchase: React.FC = () => {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd'); // Format for HTML date input

  const [itemName, setItemName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<string>(formattedToday);
  const [purchasedQuantity, setQuantity] = useState<number | ''>(1);
  const [purchasePricePerUnit, setPurchasePrice] = useState<number | ''>(0);
  const [websiteName, setWebsiteName] = useState('');
  const [availability, setAvailability] = useState(1);

  const { estimate, setEstimate } = useEstimate();
  const [user] = useAuthState(auth);

  const handleItemNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setItemName(e.target.value);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseFloat(e.target.value);
    if (value === '' || value >= 1) {
      setQuantity(value);
      setAvailability(value === '' ? 1 : value);
      setEstimate({
        ...estimate,
        purchasedQuantity: value === '' ? 1 : value,
        purchasePricePerUnit: purchasePricePerUnit ? purchasePricePerUnit / (value === '' ? 1 : value) : 0,
      });
    }
  };

  const handlePurchasePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === '' ? '' : parseFloat(e.target.value);
    if (value === '' || value >= 0) {
      setPurchasePrice(value);
      setEstimate({
        ...estimate,
        purchasePricePerUnit: value === '' ? 0 : value,
      });
    }
  };

  const handleWebsiteNameChange = (e: React.ChangeEvent<HTMLInputElement>) => setWebsiteName(e.target.value);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchaseDate(e.target.value);
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    const parsedDate = purchaseDate ? new Date(purchaseDate) : today;
    const newPurchase: IPurchase = {
      itemName,
      purchaseDate: format(parsedDate, 'dd/MM/yyyy'),
      purchasedQuantity: purchasedQuantity === '' ? 1 : purchasedQuantity,
      purchasePricePerUnit: purchasePricePerUnit === '' ? 0 : purchasePricePerUnit,
      websiteName,
      availability,
    };

    const userPurchasesRef = ref(database, `purchases/${user.uid}`);
    const newPurchaseRef = push(userPurchasesRef);

    await set(newPurchaseRef, newPurchase);

    setItemName('');
    setPurchaseDate(formattedToday);
    setQuantity(1);
    setPurchasePrice(0);
    setWebsiteName('');
    setAvailability(1);
  };

  return (
    <div className="container">
      <form className="form-control mx-auto font-semibold">
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Item Name</span>
          </label>
          <input
            type="text"
            name="itemName"
            value={itemName}
            onChange={handleItemNameChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="Item Name"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Purchase Date</span>
          </label>
          <input
            type="date"
            name="saleDate"
            value={purchaseDate}
            onChange={handleDateChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Quantity</span>
          </label>
          <input
            type="number"
            name="quantity"
            value={purchasedQuantity === '' ? '' : purchasedQuantity}
            onChange={handleQuantityChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="1"
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
            value={purchasePricePerUnit === '' ? '' : purchasePricePerUnit}
            onChange={handlePurchasePriceChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="0"
          />
        </div>
        <div className="mb-4">
          <label className="label">
            <span className="label-text text-lightModeText">Website Name</span>
          </label>
          <input
            type="text"
            name="websiteName"
            value={websiteName}
            onChange={handleWebsiteNameChange}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="John Lewis, Amazon etc"
          />
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary w-36 sm:w-42 md:w-48 bg-white text-black border-black hover:bg-textGradStart hover:border-black transition duration-200"
          >
            Add Purchase
          </button>
          <button
            type="button"
            onClick={() => {
              setItemName('');
              setPurchaseDate(formattedToday);
              setQuantity(1);
              setPurchasePrice(0);
              setWebsiteName('');
              setAvailability(1);
            }}
            className="btn btn-primary text-black w-36 sm:w-42 md:w-48 bg-white border-black hover:bg-textGradStart hover:border-black transition duration-200"
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesTrackerTabAddPurchase;
