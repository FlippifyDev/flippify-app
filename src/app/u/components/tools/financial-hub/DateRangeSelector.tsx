"use client"

import { useState, useRef, useEffect } from "react";

interface TimeRange {
    label: string;
    value: string;
}

const timeRanges: TimeRange[] = [
    { label: "Yesterday", value: "1" },
    { label: "Today", value: "0" },
    { label: "Last 7 days", value: "7" },
    { label: "Last 30 days", value: "30" },
    { label: "Last 90 days", value: "90" },
    { label: "This Year", value: "365" },
    { label: "All Time", value: `${365 * 5}` },
];

interface DateRangeSelectorProps {
    value: string;
    onChange: (label: string, range: string) => void;
}

export default function DateRangeSelector({ value, onChange }: DateRangeSelectorProps) {
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

    const handleTimeRangeChange = (label: string, value: string) => {
        onChange(label, value); // Update the parent component's state
        setIsOpen(false); // Close the dropdown
    };
    
    return (
        <div className="relative w-full" ref={dropdownRef} onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
            <button
                type="button"
                id="dropdownTimeRangeButton"
                data-dropdown-toggle="dropdownTimeRange"
                data-dropdown-delay="500"
                className="w-full py-2 px-4 rounded-lg bg-gray-50 border border-gray-500 text-sm flex items-center gap-2"
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
                className={`absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg overflow-y-auto transition-all duration-300 origin-top ${isOpen ? "opacity-100 scale-y-100 max-h-32" : "opacity-0 scale-y-0 max-h-0"}`}
            >
                <ul className="py-1" role="listbox">
                    {timeRanges.map((range) => (
                        <li
                            key={range.label}
                            role="option"
                            aria-selected={range.value === value}
                            className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${range.value === value ? "bg-gray-50" : ""
                                }`}
                            onClick={() => { handleTimeRangeChange(range.label, range.value); setIsOpen(false); }}
                        >
                            <span className="">
                                {range.label}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
