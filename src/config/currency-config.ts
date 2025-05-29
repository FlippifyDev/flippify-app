import getSymbolFromCurrency from "currency-symbol-map";

export const currencySymbols: Record<string, string> = new Proxy({}, {
    get: (_target, code: string) => {
        // Attempt to get the symbol, fallback to the code if unavailable
        return getSymbolFromCurrency(code) ?? code;
    }
});