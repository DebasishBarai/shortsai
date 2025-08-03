'use client';

import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";

export default function CancelPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 shadow-sm text-center">
        <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-200">Subscription Cancelled</h1>
        <p className="mb-6 text-slate-600 dark:text-slate-400">
          Your subscription process was cancelled. No charges have been made.
          If you have any questions or need assistance, please contact our support team.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pricing">
            <Button variant="outline" size="lg" className="border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200">
              Return to Pricing
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
              Contact Support
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 