const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const generateRandomChars = (numChar: number) => {
    let code = '';
    for (let i = 0; i < numChar; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
};


export const generateRandomFlippifyTransactionId = (numChar: number) => {
    return `ftid-${generateRandomChars(numChar)}`;
}

export const generateRandomFlippifyOrderId = (numChar: number) => {
    return `foid-${generateRandomChars(numChar)}`;
}

export const generateRandomFlippifyListingId = (numChar: number) => {
    return `flid-${generateRandomChars(numChar)}`;
}