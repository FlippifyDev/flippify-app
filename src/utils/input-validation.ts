export const validateNumberInput = (value: string, setFunction: (value: string) => void): void => {
	// Regex to allow only numbers and at most one "."
	const validNumberRegex = /^\d*\.?\d*$/;
	if (validNumberRegex.test(value)) {
		setFunction(value);
	}
};


export const validatePriceInput = (value: string, setFunction: (value: string) => void): void => {
	// Regex to allow only numbers and at most one "."
	const validPriceRegex = /^\d*(\.\d{0,2})?$/;
	if (validPriceRegex.test(value)) {
		setFunction(value);
	}
};


export const validateTextInput = (value: string, setFunction: (value: string) => void): void => {
	// Regex to allow only alphabets and spaces
	if (/^[a-zA-Z\s]*$/.test(value)) {
		setFunction(value);
	}
};