'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Loader2, CreditCard } from "lucide-react";
import { Suspense } from 'react';
import { useSession, signIn } from 'next-auth/react';
import PayPalSubscriptionButton from '@/components/paypal/paypal-subscription-button';

// This component uses the search params
function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing') || 'monthly';

  const { data: session, status } = useSession();

  // Handle loading state while checking session
  if (status === 'loading') {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
        <span className="ml-4 text-lg">Checking authentication...</span>
      </div>
    );
  }

  // Handle unauthenticated users with a clear message and redirect button
  if (!session) {
    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);

    return (
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm text-center">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6">You are not logged in</h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Please log in to continue with your subscription.
          </p>
          <Button
            onClick={() => signIn()}
            className="w-full py-6 text-lg cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  // Plan details for display
  const planDetails = {
    basic: {
      name: 'Basic Plan',
      monthly: {
        price: '$99',
        interval: 'month',
        id: "P-49361144BF717873PM7R6AXA"
      },
      yearly: {
        price: '$799',
        interval: 'year',
        id: "P-9T4050966V6815908M7SOORA"
      }
    },
    premium: {
      name: 'Premium Plan',
      monthly: {
        price: '$199',
        interval: 'month',
        id: "P-4HG412572X9641144M7SOFWY"
      },
      yearly: {
        price: '$1,599',
        interval: 'year',
        id: "P-5JU59787DH8741227M7SOMYY"
      }
    }
  };

  // Get current plan details
  const currentPlan = plan === 'basic' ? planDetails.basic : planDetails.premium;
  const currentBilling = billing === 'yearly' ? currentPlan.yearly : currentPlan.monthly;
  const currentPlanId = currentBilling.id;

  const handleSubscribe = async () => {
    if (!plan) return;

    setLoading(true);
    setError(null);

    try {
      const baseUrl = window.location.origin;

      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          billing,
          baseUrl
        }),
      });

      const data = await response.json();

      if (data.approvalUrl) {
        // Redirect to PayPal for subscription approval
        window.location.href = data.approvalUrl;
      } else {
        setError(data.error || 'Failed to create subscription');
      }
    } catch (err) {
      setError('An error occurred while processing your payment');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscriptionSuccess = async (subscriptionId: string) => {
    console.log('Subscription ID:', subscriptionId);
  };

  // Redirect if no plan is selected
  useEffect(() => {
    if (!plan) {
      router.push('/pricing');
    }
  }, [plan, router]);

  if (!plan) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold mb-6 text-slate-800 dark:text-slate-200">Complete Your Subscription</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Order Summary</h2>
          <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <div className="flex justify-between mb-2">
              <span className="text-slate-600 dark:text-slate-400">Plan:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{currentPlan.name}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-600 dark:text-slate-400">Billing Cycle:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200 capitalize">{billing}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-600 dark:text-slate-400">Price:</span>
              <span className="font-medium text-slate-800 dark:text-slate-200">{currentBilling.price}/{currentBilling.interval}</span>
            </div>
            {billing === 'yearly' && (
              <div className="mt-2 text-green-600 dark:text-green-400 text-sm font-medium">
                You save 33% with annual billing!
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* <Button */}
          {/*   onClick={handleSubscribe} */}
          {/*   className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md flex items-center justify-center" */}
          {/*   disabled={loading} */}
          {/* > */}
          {/*   {loading ? ( */}
          {/*     <> */}
          {/*       <Loader2 className="mr-2 h-5 w-5 animate-spin" /> */}
          {/*       Processing... */}
          {/*     </> */}
          {/*   ) : ( */}
          {/*     <> */}
          {/*       <CreditCard className="mr-2 h-5 w-5" /> */}
          {/*       Subscribe with PayPal */}
          {/*     </> */}
          {/*   )} */}
          {/* </Button> */}
          <div className="max-w-md mx-auto bg-white shadow-lg rounded-lg p-6">
            <PayPalSubscriptionButton
              clientId="AU4L6AD6WnFxAfgbFhTKK63nF-BJFzEeGmOrgHGM8qeCocCVwSjdsWyGAuIvO5sAVEBt18cSbst-LEZD"
              planId={currentPlanId}
              onSubscriptionSuccess={handleSubscriptionSuccess}
            />
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 text-center">
            By subscribing, you agree to our Terms of Service and Privacy Policy.
            You can cancel your subscription at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function PaymentLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm">
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <h2 className="text-xl font-medium text-slate-800 dark:text-slate-200">Loading payment details...</h2>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the content with Suspense
export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentLoading />}>
      <PaymentContent />
    </Suspense>
  );
} 
