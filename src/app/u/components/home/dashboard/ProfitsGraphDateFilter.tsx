import { forwardRef } from 'react';
import CustomDropdown from './DashboardCustomDropdown'; // Adjust the import path to your CustomDropdown

interface ProfitsGraphDateFilterProps {
	selectedRange: number; // Keep as number to match your existing logic
	selectedLabel: string; // Label for display
	handleRangeChange: (value: string, label: string) => void; // Keep the original signature
}

const ProfitsGraphDateFilter = forwardRef<HTMLDivElement, ProfitsGraphDateFilterProps>(({
	selectedRange,
	selectedLabel,
	handleRangeChange,
}, ref) => {
	const timeRangeOptions = [
		{ label: "Today", value: "1" },
		{ label: "This Week", value: "7" },
		{ label: "This Month", value: "30" },
		{ label: "Last 3 Months", value: "90" },
		{ label: "Last 6 Months", value: "180" },
		{ label: "This Year", value: "365" },
		{ label: "All Time", value: "730" },
	];

	// Wrapper function to adapt CustomDropdown's onChange to handleRangeChange
	const onRangeChange = (value: string) => {
		const selectedOption = timeRangeOptions.find(option => option.value === value);
		if (selectedOption) {
			handleRangeChange(value, selectedOption.label);
		}
	};

	return (
		<div className="relative" ref={ref}>
			<CustomDropdown
				value={selectedRange.toString()} // Convert number to string for CustomDropdown
				onChange={onRangeChange}
				options={timeRangeOptions}
			/>
		</div>
	);
});

ProfitsGraphDateFilter.displayName = 'ProfitsGraphDateFilter';

export default ProfitsGraphDateFilter;