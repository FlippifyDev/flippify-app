import { useState, useRef, useEffect } from "react";
import Flag from "react-world-flags";

type Currency = "GBP" | "USD" | "EUR" | "AUD" | "CAD" | "JPY" | "NZD";

const flagCodes: Record<Currency, string> = {
  GBP: "GB",
  USD: "US",
  EUR: "EU",
  AUD: "AU",
  CAD: "CA",
  JPY: "JP",
  NZD: "NZ",
};

interface CurrencySelectorProps {
  value: Currency;
  onChange: (currency: Currency) => void;
}

export default function CurrencySelector({
  value,
  onChange,
}: CurrencySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative w-full" ref={dropdownRef} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <button
        type="button"
        id="dropdownCurrencyButton"
        data-dropdown-toggle="dropdownCurrency"
        data-dropdown-delay="500"
        className="w-full py-2 px-4 rounded-lg bg-gray-50 border border-gray-500 text-sm flex items-center gap-2"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Flag code={flagCodes[value]} className="h-4 w-6 object-cover" />
        <span>{value}</span>
        <svg
          className={`w-4 h-4 ml-1 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      <div
        id="dropdownCurrency"
        className={`absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg overflow-y-auto transition-all duration-300 origin-top ${
          isOpen ? "opacity-100 scale-y-100 max-h-20" : "opacity-0 scale-y-0 max-h-0"
        }`}
      >
        <ul className="py-1" role="listbox">
          {Object.entries(flagCodes).map(([curr, flag]) => (
            <li
              key={curr}
              role="option"
              aria-selected={curr === value}
              className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${
                curr === value ? "bg-gray-50" : ""
              }`}
              onClick={() => {
                onChange(curr as Currency);
                setIsOpen(false);
              }}
            >
              <Flag code={flag} className="h-4 w-6 object-cover" />
              <span>{curr}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
