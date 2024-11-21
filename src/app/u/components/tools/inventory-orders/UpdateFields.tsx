import React from 'react'
import DatePicker from "./OrderDatepicker";
import { validatePriceInput, validateTextInput } from '@/src/utils/input-validation';


interface UpdateFieldsProps {
	fadeIn: boolean;
	purchaseDate: string;
	setPurchaseDate: (value: string) => void;
	purchasePrice: number | string;
	setPurchasePrice: (value: string | number) => void;
	purchasePlatform: string;
	setPurchasePlatform: (value: string) => void;
	customTag: string;
	setCustomTag: (value: string) => void;
	updateSelectedOrders: () => void;
}


const UpdateFields: React.FC<UpdateFieldsProps> = (
	{
		fadeIn,
		purchaseDate,
		setPurchaseDate,
		purchasePrice,
		setPurchasePrice,
		purchasePlatform,
		setPurchasePlatform,
		customTag,
		setCustomTag,
		updateSelectedOrders
	}
) => {
	const updateInputClass = "text-black placeholder-gray-600 w-full px-4 py-2.5 mt-2 text-base transition duration-200 ease-in-out transform border-transparent rounded-lg bg-gray-200 focus:border-blueGray-500 focus:bg-white focus:outline-none focus:shadow-outline focus:ring-2 ring-offset-current ring-offset-2 ring-gray-400"



	return (
		<div className={`transition-opacity duration-500 rounded-lg bg-white p-4 space-y-6 ${fadeIn ? 'opacity-100 ease-in' : 'opacity-0 ease-out'}`}>
			<h3 className="text-lg font-semibold">
				Update Selected Orders
			</h3>
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 max-w-3xl gap-4">
				<div className="cols-span-1 flex flex-col">
					<DatePicker value={purchaseDate} onChange={setPurchaseDate} />
				</div>
				<div className="cols-span-1 flex flex-col">
					<input
						value={purchasePrice || ""}
						onChange={(e) => validatePriceInput(e.target.value, setPurchasePrice)}
						onBlur={() => {
							// Convert to number and handle edge cases
							if (typeof purchasePrice === "string" && purchasePrice.endsWith(".")) {
								setPurchasePrice(parseFloat(purchasePrice.slice(0, -1)));
							} else if (typeof purchasePrice === "string") {
								setPurchasePrice(parseFloat(purchasePrice));
							}
						}}
						placeholder="Purchase Price"
						className={`${updateInputClass}`}
					/>
				</div>
				<div className="cols-span-1 flex flex-col">
					<input
						value={purchasePlatform}
						onChange={(e) => validateTextInput(e.target.value, setPurchasePlatform)}
						placeholder="Purchase Platform"
						className={`${updateInputClass}`}
					/>
				</div>
				<div className="cols-span-1 flex flex-col">
					<input
						value={customTag}
						onChange={(e) => validateTextInput(e.target.value, setCustomTag)}
						placeholder="Custom Tag"
						className={`${updateInputClass}`}
					/>
				</div>
			</div>
			<button
				onClick={updateSelectedOrders}
				className="bg-slate-800 text-white py-1 px-4 rounded-lg h-10"
			>
				Update Orders
			</button>
		</div>
	)
}

export default UpdateFields
