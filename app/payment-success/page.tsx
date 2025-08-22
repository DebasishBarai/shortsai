'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Payment successful! Your plan has been upgraded.</h1>
      <Button variant='default' onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
    </div>
  );
}
