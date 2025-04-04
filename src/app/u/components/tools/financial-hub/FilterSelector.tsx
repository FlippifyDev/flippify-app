"use client"


// External Imports
import { useState, useRef } from "react";


const filters = ["General"];


interface FilterSelectorProps {
    value: string;
    onChange: (type: string) => void;
}


const FilterSelector: React.FC<FilterSelectorProps> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative w-full" ref={dropdownRef} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button
                type="button"
                id="dropdownTimeRangeButton"
                data-dropdown-toggle="dropdownTimeRange"
                data-dropdown-delay="500"
                className="w-full py-2 px-4 rounded-lg bg-houseFinancialHub text-sm text-white flex items-center gap-2"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                onClick={() => setIsOpen((prev) => !prev)}
            >
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

            {/* Dropdown Menu */}
            <div
                id="timeRangeDropdown"
                className={`absolute z-10 w-32 bg-white rounded-md shadow-lg overflow-y-auto transition-all duration-300 origin-top ${isOpen ? "opacity-100 scale-y-100" : "opacity-0 scale-y-0 max-h-0"}`}
            >
                <ul className="" role="listbox">
                    {filters.map((type, index) => (
                        <div key={index}>
                            <li
                                role="option"
                                aria-selected={type === value}
                                className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${type === value ? "bg-gray-50" : ""
                                    }`}
                                onClick={() => { onChange(type); setIsOpen(false); }}
                            >
                                <span>
                                    {type}
                                </span>
                            </li>
                            {["Last year", "Last 90 days", "Year to date"].includes(type) && <hr className="border-gray-200" />}
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default FilterSelector
