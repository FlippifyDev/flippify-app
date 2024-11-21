import { forwardRef } from 'react';

interface ProfitsGraphDateFilterProps {
	rangeDropdownOpen: boolean;
	selectedLabel: string;
	selectedRange: number;
	setRangeDropdownOpen: (value: boolean) => void;
	handleRangeChange: (value: string, label: string) => void;
}

const ProfitsGraphDateFilter = forwardRef<HTMLDivElement, ProfitsGraphDateFilterProps>(({
	rangeDropdownOpen,
	selectedLabel,
	selectedRange,
	setRangeDropdownOpen,
	handleRangeChange
}, ref) => {
	return (
		<div className="relative" ref={ref}> {/* Use forwarded ref here */}
			<div
				className="btn m-1 text-lightModeText bg-white hover:bg-gray-100 transition duration-200 rounded-lg w-36"
				onClick={() => setRangeDropdownOpen(!rangeDropdownOpen)}
			>
				{selectedRange === 1
					? "Today"
					: selectedRange === 7
						? "This Week"
						: selectedRange === 30
							? "This Month"
							: selectedRange === 90
								? "Last 3 Months"
								: selectedRange === 180
									? "Last 6 Months"
									: selectedRange === 365 || selectedRange === 730
										? `${selectedLabel}`
										: `Last ${selectedRange} days`}{" "}
			</div>
			{rangeDropdownOpen && (
				<ul
					className="absolute left-0 bg-white border-gray-100 z-[1] w-52 p-2 shadow transition duration-200 rounded-lg"
					style={{ marginTop: "-4px" }}
				>
					{[
						{ range: 1, label: "Today" },
						{ range: 7, label: "This Week" },
						{ range: 30, label: "This Month" },
						{ range: 90, label: "Last 3 Months" },
						{ range: 180, label: "Last 6 Months" },
						{ range: 365, label: "This Year" },
						{ range: 730, label: "All Time" },
					].map(({ range, label }) => (
						<li key={range}>
							<a
								onClick={() => handleRangeChange(range.toString(), label)}
								className="block px-4 py-2 hover:bg-gray-200 transition duration-100 rounded-lg select-none"
							>
								{label}
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
});


ProfitsGraphDateFilter.displayName = 'ProfitsGraphDateFilter';

export default ProfitsGraphDateFilter;
