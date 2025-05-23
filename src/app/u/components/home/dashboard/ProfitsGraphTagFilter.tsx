import { forwardRef } from 'react';
import Dropdown from '../../dom/ui/Dropdown';

interface ProfitsGraphTagFilterProps {
	selectedTag: string | null;
	uniqueTags: string[];
	setSelectedTag: (value: string | null) => void;
}

const ProfitsGraphTagFilter = forwardRef<HTMLDivElement, ProfitsGraphTagFilterProps>(({
	selectedTag,
	uniqueTags,
	setSelectedTag,
}, ref) => {
	const tagOptions = [
		{ label: "All Tags", value: "all" }, // Special value for "All Tags"
		...uniqueTags.map(tag => ({ label: tag, value: tag })),
	];

	// Wrapper function to handle "all" case
	const handleTagChange = (value: string) => {
		setSelectedTag(value === "all" ? null : value);
	};

	return (
		<div className="relative" ref={ref}>
			<Dropdown
				value={selectedTag || "all"} // Use "all" when selectedTag is null
				onChange={handleTagChange}
				options={tagOptions}
			/>
		</div>
	);
});

ProfitsGraphTagFilter.displayName = 'ProfitsGraphTagFilter';

export default ProfitsGraphTagFilter;