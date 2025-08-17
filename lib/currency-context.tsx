'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Currency, convertCurrency, formatCurrency, getCurrencyForCountry, EXCHANGE_RATES, fetchExchangeRates } from './currency-converter';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (price: number) => number;
  formatPrice: (price: number) => string;
  lastUpdated: Date | null;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

// Update rates every hour
const UPDATE_INTERVAL = 60 * 60 * 1000;

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('USD');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    // Initial fetch of exchange rates
    const updateRates = async () => {
      await fetchExchangeRates();
      setLastUpdated(new Date());
    };

    updateRates();

    // Set up periodic updates
    const intervalId = setInterval(updateRates, UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Try to get user's country from their IP address
    const detectUserCurrency = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        const countryCode = data.country_code;
        const detectedCurrency = getCurrencyForCountry(countryCode);
        setCurrency(detectedCurrency);
      } catch (error) {
        console.error('Failed to detect user currency:', error);
        // Fallback to browser's locale
        try {
          const userLocale = navigator.language;
          const formatter = new Intl.NumberFormat(userLocale, { style: 'currency' });
          const currencyCode = formatter.resolvedOptions().currency as Currency;
          if (currencyCode && currencyCode in EXCHANGE_RATES) {
            setCurrency(currencyCode);
          }
        } catch (e) {
          console.error('Failed to detect currency from locale:', e);
        }
      }
    };

    detectUserCurrency();
  }, []);

  const convertPrice = (price: number) => {
    return convertCurrency(price, 'USD', currency);
  };

  const formatPrice = (price: number) => {
    return formatCurrency(convertPrice(price), currency);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, convertPrice, formatPrice, lastUpdated }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
} 