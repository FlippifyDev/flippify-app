export const validateNumberInput = (value: string, setFunction: (value: string) => void): void => {
    // Regex to allow only numbers and at most one "."
    const validNumberRegex = /^\d*\.?\d*$/;
    if (validNumberRegex.test(value)) {
        setFunction(value);
    }
};


export const validateAlphaNumericInput = (
    value: string,
    setFunction: (value: string) => void
): void => {
    // Regex to allow only letters and numbers (no special characters)
    const validAlphaNumericRegex = /^[a-zA-Z0-9]*$/;
    if (validAlphaNumericRegex.test(value)) {
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
        console.log("setting value")
        setFunction(value);
    }
};


export const validateUrlInput = (url: string, setFunction: (value: string) => void, setValidUrl?: (value: boolean) => void): void => {
    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
    const isValidUrl = urlPattern.test(url);
    if (isValidUrl) {
        setFunction(url);
        if (setValidUrl) setValidUrl(true);
    } else {
        if (setValidUrl) setValidUrl(false);

    }
};


export const validatePasswordInput = (password: string, setFunction: (value: string) => void): void => {
    if (password === "") {
        setFunction(password);
        return;
    }
    // Regex to allow only alphanumeric characters and special characters
    const validPasswordRegex = /^[a-zA-Z0-9!@#$%^&*()_+=]+$/;
    if (validPasswordRegex.test(password)) {
        setFunction(password);
    }
}

export const validateEmailInput = (email: string): boolean => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
};