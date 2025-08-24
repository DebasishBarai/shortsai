"use client";

import { ThemeProvider } from "@/components/theme-provider";
import { CurrencyProvider } from "@/lib/currency-context";
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <CurrencyProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </CurrencyProvider>
      <Toaster />
    </>
  );
};
