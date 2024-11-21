import { forwardRef } from 'react';

interface ProfitsGraphTagFilterProps {
	tagDropdownOpen: boolean;
	selectedTag: string | null;
	uniqueTags: string[];
	setTagDropdownOpen: (value: boolean) => void;
	setSelectedTag: (value: string | null) => void;
}

const ProfitsGraphTagFilter = forwardRef<HTMLDivElement, ProfitsGraphTagFilterProps>(({
	tagDropdownOpen,
	selectedTag,
	uniqueTags,
	setTagDropdownOpen,
	setSelectedTag
}, ref) => {
	return (
		<div className="relative" ref={ref}> {/* Use forwarded ref here */}
			<div
				className="btn m-1 text-lightModeText bg-white hover:bg-gray-100 transition duration-200 rounded-lg w-36"
				onClick={() => setTagDropdownOpen(!tagDropdownOpen)} // Toggle dropdown for tags
			>
				{selectedTag || "All Tags"} {/* Display selected tag or default text */}
			</div>
			{tagDropdownOpen && (
				<ul
					className="absolute left-0 bg-white border-gray-100 z-[1] w-52 p-2 shadow transition duration-200 rounded-lg"
					style={{ marginTop: "-4px" }} // Styling for dropdown
				>
					<li>
						<a
							onClick={() => setSelectedTag(null)} // Handle "All Tags" selection
							className="block px-4 py-2 hover:bg-gray-200 transition duration-100 rounded-lg select-none"
						>
							All Tags
						</a>
					</li>
					{uniqueTags.map((tag, index) => (
						<li key={index}>
							<a
								onClick={() => setSelectedTag(tag)} // Set selected tag
								className="block px-4 py-2 hover:bg-gray-200 transition duration-100 rounded-lg select-none"
							>
								{tag}
							</a>
						</li>
					))}
				</ul>
			)}
		</div>
	);
});


ProfitsGraphTagFilter.displayName = 'ProfitsGraphTagFilter';

export default ProfitsGraphTagFilter;
