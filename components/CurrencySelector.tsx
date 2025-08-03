'use client';

import { useCurrency } from '@/lib/currency-context';
import { Currency } from '@/lib/currency-converter';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { getCurrencySymbol } from '@/lib/currency-converter';

export function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Select value={currency} onValueChange={(value: Currency) => setCurrency(value)}>
      <SelectTrigger className="w-[180px]">
        <SelectValue>
          {currency} ({getCurrencySymbol(currency)})
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="USD">USD ($)</SelectItem>
        <SelectItem value="EUR">EUR (€)</SelectItem>
        <SelectItem value="GBP">GBP (£)</SelectItem>
        <SelectItem value="INR">INR (₹)</SelectItem>
        <SelectItem value="CAD">CAD (C$)</SelectItem>
        <SelectItem value="AUD">AUD (A$)</SelectItem>
        <SelectItem value="JPY">JPY (¥)</SelectItem>
        <SelectItem value="CNY">CNY (¥)</SelectItem>
      </SelectContent>
    </Select>
  );
} 