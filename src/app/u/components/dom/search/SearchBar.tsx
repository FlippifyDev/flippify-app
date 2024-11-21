"use client"

import { useState } from 'react';
import { IoSearch } from 'react-icons/io5';


interface SearchBarProps {
	setSearchQueryToSubmit: (value: string) => void;
}


const SearchBar:React.FC<SearchBarProps> = ({ setSearchQueryToSubmit }) => {
	const [searchQuery, setSearchQuery] = useState<string>("");

	const handleSearchSubmit = () => {
		setSearchQueryToSubmit(searchQuery);
	};

	return (
		<label className="input input-bordered flex items-center gap-2 w-80 mb-8 text-xl">
			<input
				type="text"
				placeholder="Search"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") {
						handleSearchSubmit();
					}
				}}
				className="grow border-0 input input-bordered"
			/>
			<IoSearch />
		</label>
	)
}

export default SearchBar
