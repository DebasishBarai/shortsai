'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, Coins } from "lucide-react";
import { Suspense } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

// Success content component that uses search params
function SuccessContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creditsAdded, setCreditsAdded] = useState(false);
  
  const packageIndex = searchParams.get('package');
  const credits = searchParams.get('credits');
  const price = searchParams.get('price');
  
  // Add credits to user account
  useEffect(() => {
    const addCredits = async () => {
      if (!credits || !session?.user?.email) {
        setError('Missing credit information or user not authenticated');
        setLoading(false);
        return;
      }
      
      try {
        // Call API to add credits to user account
        const response = await axios.post('/api/add-credits', {
          credits: parseInt(credits)
        });
        
        if (response.status === 200) {
          setCreditsAdded(true);
          toast.success(`Successfully added ${credits} credits to your account!`);
        } else {
          throw new Error('Failed to add credits');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error adding credits:', err);
        setError('Failed to add credits to your account. Please contact support.');
        setLoading(false);
      }
    };
    
    addCredits();
  }, [credits, session]);
  
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm text-center">
        {loading ? (
          <div className="py-8">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-blue-500 mb-4" />
            <h2 className="text-2xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Adding credits to your account...</h2>
            <p className="text-slate-600 dark:text-slate-400">This will only take a moment.</p>
          </div>
        ) : error ? (
          <div className="py-8">
            <h1 className="text-2xl font-bold text-red-600 dark:text-red-400 mb-4">Credit Purchase Error</h1>
            <p className="mb-6 text-slate-600 dark:text-slate-400">{error}</p>
            <Link href="/pricing">
              <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">Return to Pricing</Button>
            </Link>
          </div>
        ) : (
          <div className="py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">Credits Purchased Successfully!</h1>
            
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Coins className="h-6 w-6 text-yellow-500" />
                <span className="text-xl font-semibold text-green-700 dark:text-green-300">
                  +{credits} Credits Added
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                You can now create {credits} AI videos
              </p>
            </div>
            
            <p className="mb-6 text-slate-600 dark:text-slate-400">
              Thank you for your purchase! Your {credits} credits have been added to your account.
              You can now start creating amazing AI videos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/create">
                <Button size="lg" className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
                  Create Your First Video
                </Button>
              </Link>
            <Link href="/dashboard">
                <Button size="lg" variant="outline" className="px-8">
                  Go to Dashboard
                </Button>
            </Link>
            </div>
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