// Need to fix this and have it auto fetching actual exchange rates - this currently doesnt work.

export const fetchConversionRates = async (): Promise<Record<string, number>> => {
    return { GBP: 0.78, USD: 1, EUR: 0.92, AUD: 1.55, CAD: 1.44, JPY: 149.24, NZD: 1.68 };
};
