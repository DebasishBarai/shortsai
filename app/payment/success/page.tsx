'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { Suspense } from 'react';

// Success content component that uses search params
function SuccessContent() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const plan = searchParams.get('plan');
  const billing = searchParams.get('billing');
  const subscriptionId = searchParams.get('subscription_id');
  
  // Verify the subscription and activate the account
  useEffect(() => {
    const verifySubscription = async () => {
      if (!subscriptionId) {
        setError('Subscription ID not found');
        setLoading(false);
        return;
      }
      
      try {
        // Here you would typically call your API to verify the subscription
        // and activate the user's account with the selected plan
        
        // For now, we'll just simulate a successful verification
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setLoading(false);
      } catch (err) {
        setError('Failed to verify subscription');
        setLoading(false);
      }
    };
    
    verifySubscription();
  }, [subscriptionId]);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm text-center">
        {loading ? (
          <div className="py-8">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Verifying your subscription...</h2>
            <p className="text-slate-600 dark:text-slate-400">This will only take a moment.</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Subscription Error</h1>
            <p className="mb-6 text-slate-600 dark:text-slate-400">{error}</p>
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">Return to Pricing</Button>
            </Link>
          </div>
        ) : (
          <div className="py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">Subscription Successful!</h1>
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Thank you for subscribing to our {plan} plan with {billing} billing.
              Your account has been activated and you can now start using our services.
            </p>
            <Link href="/dashboard">
              <Button size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">Go to Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

// Loading fallback for Suspense
function SuccessLoading() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm text-center">
        <div className="py-8">
          <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-500 mb-4" />
          <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Loading subscription details...</h2>
        </div>
      </div>
    </div>
  );
}

// Main component that wraps the content with Suspense
export default function SuccessPage() {
  return (
    <Suspense fallback={<SuccessLoading />}>
      <SuccessContent />
    </Suspense>
  );
} 