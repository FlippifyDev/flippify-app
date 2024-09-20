export const currencySymbols: Record<"GBP" | "USD" | "EUR" | "AUD" | "CAD", string> = {
  GBP: "£",
  USD: "$",
  EUR: "€",
  AUD: "A$",
  CAD: "C$",
};

// Define the expected shape of the API response
interface CurrencyApiResponse {
  data: {
    [key: string]: number; // Currency codes as keys, conversion rates as values
  };
}

// Fetch conversion rates from the Free Currency API
export async function fetchConversionRates(): Promise<Record<string, number>> {
  try {
    const response = await fetch(
      "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_Ar4EMELuF7FdrszcREaXF6wwgXeWrV6sJKcJPIhp"
    );
    
    if (!response.ok) {
      throw new Error("Failed to fetch conversion rates");
    }

    // Parse the response to the expected format
    const data: CurrencyApiResponse = await response.json();

    // Get GBP rate for conversion
    const gbpRate = data.data.GBP;

    // Convert the rates to be GBP-based
    const conversionRates = Object.fromEntries(
      Object.entries(data.data).map(([currency, rate]) => [currency, rate / gbpRate])
    );

    return conversionRates;
  } catch (error) {
    console.error("Error fetching conversion rates:", error);

    // Return fallback values in case of error
    return { GBP: 1, USD: 1.33, EUR: 1.19, AUD: 1.95, CAD: 1.8 };
  }
}
