// Base currency is USD
export const BASE_CURRENCY = 'USD';

export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'CAD' | 'AUD' | 'JPY' | 'CNY';

// Default exchange rates (will be updated with real-time data)
export const EXCHANGE_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  INR: 83.12,
  CAD: 1.35,
  AUD: 1.52,
  JPY: 150.25,
  CNY: 7.19,
};

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, Currency> = {
  US: 'USD',
  GB: 'GBP',
  IN: 'INR',
  CA: 'CAD',
  AU: 'AUD',
  JP: 'JPY',
  CN: 'CNY',
  // European Union countries
  AT: 'EUR', // Austria
  BE: 'EUR', // Belgium
  BG: 'EUR', // Bulgaria
  HR: 'EUR', // Croatia
  CY: 'EUR', // Cyprus
  CZ: 'EUR', // Czech Republic
  DK: 'EUR', // Denmark
  EE: 'EUR', // Estonia
  FI: 'EUR', // Finland
  FR: 'EUR', // France
  DE: 'EUR', // Germany
  GR: 'EUR', // Greece
  HU: 'EUR', // Hungary
  IE: 'EUR', // Ireland
  IT: 'EUR', // Italy
  LV: 'EUR', // Latvia
  LT: 'EUR', // Lithuania
  LU: 'EUR', // Luxembourg
  MT: 'EUR', // Malta
  NL: 'EUR', // Netherlands
  PL: 'EUR', // Poland
  PT: 'EUR', // Portugal
  RO: 'EUR', // Romania
  SK: 'EUR', // Slovakia
  SI: 'EUR', // Slovenia
  ES: 'EUR', // Spain
  SE: 'EUR', // Sweden
};

export async function fetchExchangeRates(): Promise<void> {
  try {
    // Using Exchange Rates API (exchangerate-api.com)
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();

    if (data.result === 'success') {
      const rates = data.rates;
      // Update only the currencies we support
      Object.keys(EXCHANGE_RATES).forEach((currency) => {
        if (currency in rates) {
          EXCHANGE_RATES[currency as Currency] = rates[currency];
        }
      });
    } else {
      console.error('Failed to fetch exchange rates:', data);
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
}

export function getCurrencyForCountry(countryCode: string): Currency {
  return COUNTRY_TO_CURRENCY[countryCode] || 'USD';
}

export function convertCurrency(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
  return amountInUSD * EXCHANGE_RATES[toCurrency];
}

export function formatCurrency(amount: number, currency: Currency): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(amount);
}

export function getCurrencySymbol(currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(0).replace(/[\d\s.,]/g, '');
} 
