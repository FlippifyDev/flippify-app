"use client"

import type { DatepickerOptions, DatepickerInterface } from 'flowbite';
import React, { useEffect, useRef, useState } from 'react';
import { Datepicker } from 'flowbite';

interface SalesTrackerDatepickerProps {
  value: string;
  onChange: (value: string) => void;
}

const OrderDatepicker: React.FC<SalesTrackerDatepickerProps> = ({ value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value);
  const datepickerRef = useRef<HTMLInputElement | null>(null);
  const datepickerInstance = useRef<DatepickerInterface | null>(null);
  
  const handleDateChange = (event: any) => {
	const newValue = event.target.value;
	setInternalValue(newValue);
	// Update the parent with the new value
  };


  useEffect(() => {
    setInternalValue(value); // Update internal value if parent value changes
  }, [value]);

  return (
    <div className="relative">
      <input
	  	type="date"
        value={internalValue}
        onChange={(e) => handleDateChange(e.target.value)}
        className="text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-500 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"
        placeholder="Purchase Date"
        id="datepicker-format"
        data-date-format="dd MM yyyy"
      />
    </div>
  );
};

export default OrderDatepicker;
