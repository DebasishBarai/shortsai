'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from 'sonner';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Loader2 } from 'lucide-react';
import { paypalOptions, PLAN_PRICES } from "@/lib/paypal-config";
import { useCurrency } from '@/lib/currency-context';

export function PaymentComponent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const plan = searchParams.get('plan') as 'basic' | 'premium' | null;
  const billing = searchParams.get('billing') as 'monthly' | 'yearly' | null;
  const { currency, convertPrice } = useCurrency();

  if (!plan || !billing) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Invalid Plan Selection</CardTitle>
            <CardDescription>Please select a valid plan and billing cycle.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  // Calculate the amount based on plan and billing cycle
  const basicMonthly = 99;
  const premiumMonthly = 199;
  const basicYearly = Math.floor(basicMonthly * 12 * 0.67 / 100) * 100 + 99;
  const premiumYearly = Math.floor(premiumMonthly * 12 * 0.67 / 100) * 100 + 99;

  const amount = plan === 'basic' 
    ? (billing === 'monthly' ? basicMonthly : basicYearly)
    : (billing === 'monthly' ? premiumMonthly : premiumYearly);

  const convertedAmount = convertPrice(amount);

  useEffect(() => {
    if (!plan || !['basic', 'premium'].includes(plan)) {
      router.push('/dashboard');
    }
    setIsLoading(false);
  }, [plan, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Purchase</CardTitle>
          <CardDescription>
            Complete your payment for the {plan} plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center mb-6">
            <div className="text-3xl font-bold">{convertedAmount.toFixed(2)} {currency}</div>
            <div className="text-sm text-muted-foreground">One-time payment</div>
          </div>

          <div className="w-full p-4 border rounded-lg">
            <PayPalScriptProvider options={{ ...paypalOptions, currency }}>
              <PayPalButtons
                style={{
                  layout: "vertical",
                  shape: "rect",
                  label: "pay",
                }}
                createOrder={(data, actions) => {
                  return actions.order.create({
                    intent: "CAPTURE",
                    purchase_units: [
                      {
                        amount: {
                          currency_code: currency,
                          value: convertedAmount.toFixed(2),
                        },
                        description: `RemindMe ${plan.charAt(0).toUpperCase() + plan.slice(1)} Plan (${billing})`,
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order!.capture().then((details) => {
                    console.log('Payment completed:', details);
                    toast.success('Payment successful! Your plan has been upgraded.');
                    router.push('/dashboard');
                  });
                }}
                onError={(err) => {
                  console.error('🔴 PayPal error:', err);
                  toast.error('Payment failed. Please try again.');
                }}
                onCancel={() => {
                  console.log('🔵 Payment cancelled by user');
                  toast.info('Payment cancelled');
                }}
              />
            </PayPalScriptProvider>
          </div>

          {message && (
            <div className="mt-4 text-center text-sm text-red-500">
              {message}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 
