import React from 'react'


interface ToggleProps {
	text_left?: string;
	text_right?: string;
    checked?: boolean;
	onChange: () => void;
}


const Toggle: React.FC<ToggleProps> = ({ text_left, text_right, checked, onChange }) => {
	return (
		<label className="inline-flex items-center cursor-pointer">
			<input
				type="checkbox"
				value=""
                checked={checked}
				className="sr-only peer"
				onChange={onChange}
			/>
			{text_left ? (
				<span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
					{text_left}
				</span>
			) : null}
			<div className="relative w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
			{text_right ? (
				<span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300 select-none">
					{text_right}
				</span>
			) : null}
		</label>
	)
}

export default Toggle
