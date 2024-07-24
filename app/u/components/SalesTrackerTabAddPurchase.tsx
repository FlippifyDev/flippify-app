"use client"

import { database, ref, set, push } from '../../api/firebaseConfig';
import { auth } from '../../api/firebaseConfig';
import { useEstimate } from '../../components/EstimateContext';
import { IPurchase } from './SalesTrackerModels';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuthState } from 'react-firebase-hooks/auth';
import { format } from 'date-fns';

const SalesTrackerDatepicker = dynamic(() => import('./SalesTrackerDatepicker'), {
  ssr: false,
});

const SalesTrackerTabAddPurchase: React.FC = () => {
  const today = format(new Date(), 'dd/MM/yyyy');

  const [itemName, setItemName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState(today);
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

  const handleDateChange = (value: string) => {
    setPurchaseDate(value);
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User is not logged in");
      return;
    }

    const newPurchase: IPurchase = {
      itemName,
      purchaseDate,
      purchasedQuantity: purchasedQuantity === '' ? 1 : purchasedQuantity,
      purchasePricePerUnit: purchasePricePerUnit === '' ? 0 : purchasePricePerUnit,
      websiteName,
      availability,
    };

    const userPurchasesRef = ref(database, `purchases/${user.uid}`);
    const newPurchaseRef = push(userPurchasesRef);

    await set(newPurchaseRef, newPurchase);

    setItemName('');
    setPurchaseDate(today);
    setQuantity(1);
    setPurchasePrice(0);
    setWebsiteName('');
    setAvailability(1);
  };

  return (
    <div className="container mx-auto font-semibold">
      <form className="form-control">
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
          <SalesTrackerDatepicker value={purchaseDate} onChange={handleDateChange} />
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
            className="btn btn-primary w-36 sm:w-42 md:w-48 bg-white border-black hover:bg-textGradStart hover:border-black transition duration-200"
          >
            Add Purchase
          </button>
          <button
            type="button"
            onClick={() => {
              setItemName('');
              setPurchaseDate(today);
              setQuantity(1);
              setPurchasePrice(0);
              setWebsiteName('');
              setAvailability(1);
            }}
            className="btn btn-primary w-36 sm:w-42 md:w-48 bg-white border-black hover:bg-textGradStart hover:border-black transition duration-200"
          >
            Clear All
          </button>
        </div>
      </form>
    </div>
  );
};

export default SalesTrackerTabAddPurchase;
