import React from 'react'


interface UnderlineSelectProps {
    id: string;
    value: string;
    options: { value: string; label: string }[]; 
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}


const UnderlineSelect: React.FC<UnderlineSelectProps> = ({ id, value, options, onChange }) => {
	return (
        <select
            id={id}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-black transition duration-500"
        >
            {options.map((option) => (
                <option key={option.value} value={option.value}>
                    {option.label}
                </option>
            ))}
        </select>
	)
}

export default UnderlineSelect
