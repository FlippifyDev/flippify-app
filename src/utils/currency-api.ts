// Need to fix this and have it auto fetching actual exchange rates - this currently doesnt work.

export const fetchConversionRatesFromFirebase = async (): Promise<Record<string, number>> => {
	return { GBP: 1, USD: 1.29, EUR: 1.19, AUD: 2.05, CAD: 1.86, JPY: 192.53, NZD: 2.26 };
};
