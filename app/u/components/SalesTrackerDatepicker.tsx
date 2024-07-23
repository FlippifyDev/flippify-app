import type { DatepickerOptions, DatepickerInterface } from 'flowbite';
import React, { useEffect, useRef } from 'react';
import { Datepicker } from 'flowbite';

interface SalesTrackerDatepickerProps {
  value: string;
  onChange: (value: string) => void;
}

const SalesTrackerDatepicker: React.FC<SalesTrackerDatepickerProps> = ({ value, onChange }) => {
  const datepickerRef = useRef<HTMLInputElement | null>(null);
  const datepickerInstance = useRef<DatepickerInterface | null>(null);

  useEffect(() => {
    if (datepickerRef.current) {
      const options: DatepickerOptions = {
        autohide: true,
        format: 'dd/MM/yyyy', // Ensure format is consistent
      };

      datepickerInstance.current = new Datepicker(datepickerRef.current, options);

      const handleDateChange = (event: any) => {
        onChange(event.target.value);
      };

      datepickerRef.current.addEventListener('change', handleDateChange);

      return () => {
        if (datepickerRef.current) {
          datepickerRef.current.removeEventListener('change', handleDateChange);
        }
        datepickerInstance.current?.destroy();
      };
    }
  }, [onChange]);

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z"/>
        </svg>
      </div>
      <input
        ref={datepickerRef}
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
        placeholder="Select date"
        id="datepicker-format"
        data-date-format="dd/mm/yyyy"
      />
    </div>
  );
};

export default SalesTrackerDatepicker;
