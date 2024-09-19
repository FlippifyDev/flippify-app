export async function fetchConversionRates() {
    try {
      const response = await fetch('https://api.example.com/conversion-rates'); // Use your actual API
      const data = await response.json();
  
      return {
        GBP: data.GBP || 1,
        USD: data.USD || 1.28,
        EUR: data.EUR || 1.16,
        AUD: data.AUD || 1.80,
        CAD: data.CAD || 1.65,
      };
    } catch (error) {
      console.error("Error fetching conversion rates:", error);
      // Return fallback rates if API fails
      return {
        GBP: 1,
        USD: 1.28,
        EUR: 1.16,
        AUD: 1.80,
        CAD: 1.65,
      };
    }
  }
  