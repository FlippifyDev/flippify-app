import React from 'react'


interface UnderlineInputProps {
	type: string;
	id: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


const UnderlineInput: React.FC<UnderlineInputProps> = ({ type, id, value, onChange }) => {
	return (
		<input
			type={type}
			id={id}
			value={value}
			onChange={onChange}
			className="w-full px-3 py-2 border-0 border-b-2 border-gray-300 focus:border-black focus:outline-none focus:ring-0 transition duration-500"
		/>
	)
}


export default UnderlineInput
