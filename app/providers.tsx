"use client";

import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "@/components/theme-provider";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { RecoilRoot } from "recoil";
import { CurrencyProvider } from "@/lib/currency-context";
import { Toaster } from 'sonner';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const paypalOptions = {
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
  }

  return (
    <SessionProvider>
      <PayPalScriptProvider options={paypalOptions}>
        <CurrencyProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RecoilRoot>
              {children}
            </RecoilRoot>
          </ThemeProvider>
        </CurrencyProvider>
        <Toaster />
      </PayPalScriptProvider>
    </SessionProvider>
  );
};
