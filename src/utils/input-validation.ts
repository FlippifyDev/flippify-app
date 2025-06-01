export const validateNumberInput = (
    value: string,
    setFunction: (value: string) => void,
    maxLength: number = 12
): void => {

    // Check if the input exceeds the maximum length.
    if (value.length > maxLength) {
        return;
    }

    // Regex to allow only numbers and at most one "."
    const validNumberRegex = /^\d*\.?\d*$/;
    if (validNumberRegex.test(value)) {
        setFunction(value);
    }
};

export const validateIntegerInput = (
    value: string,
    setFunction: (value: string) => void,
    maxLength: number = 12
): void => {
    // Check if the input exceeds the maximum length.
    if (value.length > maxLength) {
        return;
    }

    // Regex to allow only letters and numbers (no special characters)
    const validIntegerRegex = /^[0-9]*$/;
    if (validIntegerRegex.test(value)) {
        setFunction(value);
    }
};


export const validateSafeInput = (
    value: string,
    setFunction: (value: string) => void,
    maxLength: number = 100
): void => {
    // Allow clearing the field
    if (value === "") {
        setFunction(value);
        return;
    }

    // Reject if it exceeds the maximum length
    if (value.length > maxLength) {
        return;
    }

    // Only permit letters, numbers, spaces, hyphens, and underscores.
    // This regex disallows typical "injection" characters like < > ' " ; \ / & etc.
    const safeRegex = /^[\p{L}\p{N}\s_-]*$/u;

    if (safeRegex.test(value)) {
        setFunction(value);
    }
  };

export const validateAlphaNumericInput = (
    value: string,
    setFunction: (value: string) => void,
    maxLength: number = 100
): void => {
    if (value === "") setFunction(value);

    // Check if the input exceeds the maximum length.
    if (value.length > maxLength) {
        return;
    }

    // Regex to allow only letters and numbers (no special characters)
    const validAlphaNumericRegex = /^(?:[\p{L}\p{N}]+(?: [\p{L}\p{N}]+)* ?)$/u;
    if (validAlphaNumericRegex.test(value)) {
        setFunction(value);
    }
};


export const validatePriceInput = (
    value: string,
    setFunction: (value: string) => void,
    maxLength: number = 12
): void => {
    // Check if the input exceeds the maximum length.
    if (value.length > maxLength) {
        return;
    }

    // Regex to allow only numbers and at most one "."
    const validPriceRegex = /^\d*(\.\d{0,2})?$/;
    if (validPriceRegex.test(value)) {
        setFunction(value);
    }
};


export const validateTextInput = (
    value: string,
    setFunction: (value: string) => void,
    maxLength: number = 200
): void => {
    // Check if the input exceeds the maximum length.
    if (value.length > maxLength) {
        return;
    }

    // Regex to allow only alphabets and spaces
    if (/^[a-zA-Z\s]*$/.test(value)) {
        setFunction(value);
    }
};


export const validateUrlInput = (
    url: string,
    setFunction: (value: string) => void,
    setValidUrl?: (value: boolean) => void,
    maxLength: number = 2048
): void => {
    // Check if the input exceeds the maximum length.
    if (url.length > maxLength) {
        return;
    }

    const urlPattern = /^(https?:\/\/)?([\w-]+(\.[\w-]+)+)(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
    const isValidUrl = urlPattern.test(url);
    if (isValidUrl) {
        setFunction(url);
        if (setValidUrl) setValidUrl(true);
    } else {
        if (setValidUrl) setValidUrl(false);

    }
};


export const validatePasswordInput = (
    password: string,
    setFunction: (value: string) => void,
    maxLength: number = 64
): void => {
    // Check if the input exceeds the maximum length.
    if (password.length > maxLength) {
        return;
    }

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

export const validateEmailInput = (
    email: string,
    maxLength: number = 254
): boolean => {

    // Check if the input exceeds the maximum length.
    if (email.length > maxLength) {
        return false;
    }

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
};


export const validateEmail = (
    email: string,
    setFunction: (value: string) => void,
    maxLength: number = 128
): void => {
    if (email === "") setFunction(email);

    // Check if the input exceeds the maximum length.
    if (email.length > maxLength) return;

    const emailPattern = /^(?:[\p{L}\p{N}@\.]+(?: [\p{L}\p{N}@\.]+)* ?)$/u;
    if (emailPattern.test(email)) {
        setFunction(email);
    }
};