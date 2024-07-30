import React, { useState } from 'react';
import { auth, database, ref, set, push } from '../../api/auth-firebase/firebaseConfig';
import { IPurchase } from './SalesTrackerModels';
import { format } from 'date-fns';

interface SalesTrackerTabAddPurchaseProps {
  userData: {
    uid: string;
    customerId: string;
  };
}

const sanitizePath = (path: string): string => {
  return path.replace(/[.#$[\]]/g, '_');
};

const SalesTrackerTabAddPurchase: React.FC<SalesTrackerTabAddPurchaseProps> = ({ userData }) => {
  const today = new Date();
  const formattedToday = format(today, 'yyyy-MM-dd');

  const [itemName, setItemName] = useState('');
  const [purchaseDate, setPurchaseDate] = useState<string>(formattedToday);
  const [purchasedQuantity, setQuantity] = useState<number | ''>(1);
  const [purchasePricePerUnit, setPurchasePrice] = useState<number | ''>(0);
  const [websiteName, setWebsiteName] = useState('');
  const [availability, setAvailability] = useState<number>(1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const parsedValue = (name === 'purchasedQuantity' || name === 'purchasePricePerUnit')
      ? parseFloat(value)
      : value;

    if (['purchasedQuantity', 'purchasePricePerUnit'].includes(name) && typeof parsedValue === 'number' && parsedValue < 0) {
      return;
    }

    if (['purchasedQuantity', 'purchasePricePerUnit'].includes(name)) {
      if (value === '' || (typeof parsedValue === 'number' && !isNaN(parsedValue) && parsedValue >= 0)) {
        if (name === 'purchasedQuantity') {
          setQuantity(parsedValue as number | "");
          setAvailability(parsedValue === '' ? 1 : parsedValue as number);
        } else if (name === 'purchasePricePerUnit') {
          setPurchasePrice(parsedValue as number | "");
        }
      }
    } else {
      if (name === 'itemName') {
        setItemName(value);
      } else if (name === 'websiteName') {
        setWebsiteName(value);
      }
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPurchaseDate(e.target.value);
  };

  const handleSubmit = async () => {
    if (!userData) {
      console.error("User data is not available");
      return;
    }

    const parsedDate = purchaseDate ? new Date(purchaseDate) : today;
    const newPurchase: IPurchase = {
      itemName,
      purchaseDate: format(parsedDate, 'dd/MM/yyyy'),
      purchasedQuantity: purchasedQuantity === '' ? 1 : purchasedQuantity,
      purchasePricePerUnit: purchasePricePerUnit === '' ? 0 : purchasePricePerUnit,
      websiteName,
      availability: availability,
    };

    const sanitizedCustomerId = sanitizePath(userData.customerId);
    const userPurchasesRef = ref(database, `purchases/${sanitizedCustomerId}`);
    const newPurchaseRef = push(userPurchasesRef);

    await set(newPurchaseRef, newPurchase);

    setItemName('');
    setPurchaseDate(formattedToday);
    setQuantity(1);
    setPurchasePrice(0);
    setWebsiteName('');
    setAvailability(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!parseFloat(e.key) && e.key !== 'Backspace' && e.key !== '.' && e.key !== '0') {
      e.preventDefault();
    }
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
            onChange={handleChange}
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
            name="purchaseDate"
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
            name="purchasedQuantity"
            value={purchasedQuantity === '' ? '' : purchasedQuantity}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="1"
            min="1"
            step="1"
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
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            className="input input-bordered w-full bg-white placeholder-lightModeText-light"
            placeholder="0"
            min="0"
            step="0.01"
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
            onChange={handleChange}
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