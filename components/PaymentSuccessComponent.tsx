'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

export function PaymentSuccessComponent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      toast.success('Payment successful! Your plan has been upgraded.');
      router.push('/dashboard');
    }
  }, [token, router]);

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Processing your payment...</h1>
      <p>Please wait while we confirm your payment.</p>
    </div>
  );
} 