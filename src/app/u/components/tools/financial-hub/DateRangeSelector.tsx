"use client"

import { useState, useRef, useEffect } from "react";

interface TimeRange {
    label: string;
    value: string;
}

const getDaysSinceStartOfYear = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const diffInMs = now.getTime() - startOfYear.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)).toString();
};

const getDaysSinceStartOfMonth = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const diffInMs = now.getTime() - startOfMonth.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)).toString();
};

const getDaysSinceStartOfWeek = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const dayOfWeek = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    startOfWeek.setDate(now.getDate() - dayOfWeek); // Move to start of the week (Sunday)
    startOfWeek.setHours(0, 0, 0, 0);
    const diffInMs = now.getTime() - startOfWeek.getTime();
    return Math.floor(diffInMs / (1000 * 60 * 60 * 24)).toString();
};

const timeRanges: TimeRange[] = [
    { label: "Today", value: "0" }, // Same day
    { label: "Yesterday", value: "1" }, // 1 day back
    { label: "Last week", value: "7" }, // Last 7 days
    { label: "Last month", value: "30" }, // Last 30 days
    { label: "Last year", value: "365" }, // Last 365 days
    { label: "Last 24 hours", value: "1" }, // 24 hours
    { label: "Last 7 days", value: "7" }, // Last 7 days
    { label: "Last 30 days", value: "30" }, // Last 30 days
    { label: "Last 90 days", value: "90" }, // Last 90 days
    { label: "Week to date", value: getDaysSinceStartOfWeek() }, // From start of this week
    { label: "Month to date", value: getDaysSinceStartOfMonth() }, // From start of this month
    { label: "Year to date", value: getDaysSinceStartOfYear() }, // From start of this year
    { label: "All Time", value: `${365 * 5}` }, // 5 years as a fallback
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
                className="w-full py-2 px-4 rounded-lg bg-gray-200 text-sm flex items-center gap-2"
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
                    {timeRanges.map((range) => (
                        <>
                            <li
                                key={range.label}
                                role="option"
                                aria-selected={range.value === value}
                                className={`px-4 py-2 text-sm cursor-pointer flex items-center gap-2 hover:bg-gray-100 ${range.value === value ? "bg-gray-50" : ""
                                    }`}
                                onClick={() => { handleTimeRangeChange(range.label, range.value); setIsOpen(false); }}
                            >
                                <span>
                                    {range.label}
                                </span>
                            </li>
                            {["Last year", "Last 90 days", "Year to date"].includes(range.label) && <hr className="border-gray-200" />}
                        </>
                    ))}
                </ul>
            </div>
        </div>
    );
}
