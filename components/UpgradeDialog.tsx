'use client';

import { useState } from "react";
import { SubscriptionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Rocket, Gift, CalendarDays } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

interface UpgradeDialogProps {
  currentPlan: SubscriptionType;
  isTrialExpired?: boolean;
}

export function UpgradeDialog({ currentPlan, isTrialExpired }: UpgradeDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  // Original prices
  const basicOriginalMonthly = 199;
  const premiumOriginalMonthly = 299;

  // Early bird discounted prices
  const basicMonthly = 99;
  const premiumMonthly = 199;

  // Calculate yearly prices with 33% discount
  const basicYearly = Math.floor(basicMonthly * 12 * 0.67 / 100) * 100 + 99;
  const premiumYearly = Math.floor(premiumMonthly * 12 * 0.67 / 100) * 100 + 99;

  // Calculate monthly equivalent for yearly plans
  const basicMonthlyEquivalent = Math.round(basicYearly / 12);
  const premiumMonthlyEquivalent = Math.round(premiumYearly / 12);

  const isPaymentPage = pathname.startsWith('/payment');

  const handlePayment = (plan: 'basic' | 'premium') => {
    router.push(`/payment?plan=${plan}&billing=${billingCycle}`);
    setOpen(false);
  };

  if (currentPlan === 'premium') return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="hidden md:flex"
          disabled={isPaymentPage}
        >
          Upgrade{currentPlan === 'basic' ? ' to Premium' : ' Plan'}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {currentPlan === 'basic' ? 'Upgrade to Premium' : 'Choose Your Plan'}
          </DialogTitle>
          <DialogDescription>
            {currentPlan === 'basic'
              ? 'Get access to all premium features and unlimited messaging'
              : 'Select the plan that best fits your business marketing needs'}
          </DialogDescription>
        </DialogHeader>

        {/* Billing toggle */}
        <div className="flex justify-center mt-4 mb-6">
          <div className="inline-flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${billingCycle === "monthly"
                  ? "bg-white dark:bg-slate-700 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingCycle("yearly")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${billingCycle === "yearly"
                  ? "bg-white dark:bg-slate-700 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50"
                }`}
            >
              Yearly
              {billingCycle === "yearly" && (
                <span className="ml-2 bg-green-100 dark:bg-green-900/60 text-green-700 dark:text-green-300 text-xs px-2 py-0.5 rounded-full font-medium">
                  Save 33%
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Early bird offer banner */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-lg mb-6">
          <div className="flex items-center justify-center">
            <Rocket className="h-5 w-5 mr-2" />
            <p className="font-medium">Early Bird Offer: Limited-time special pricing for first 100 customers!</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mt-4">
          {currentPlan === 'free' && (
            <div className="bg-card border-2 rounded-lg border-primary/20 p-6 relative">
              {billingCycle === "yearly" && (
                <div className="absolute -top-3 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
                  <Gift className="h-3 w-3 mr-1" /> Save 33%
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200">Basic Plan</h3>
              <div className="flex items-baseline mt-2">
                <span className="text-lg line-through text-slate-400 dark:text-slate-500 mr-2">
                  ${billingCycle === "monthly" ? basicOriginalMonthly : Math.round(basicOriginalMonthly * 12 * 0.67)}
                </span>
                <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  ${billingCycle === "monthly" ? basicMonthly : basicYearly}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-1">
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
              {billingCycle === "yearly" && (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  Just ${basicMonthlyEquivalent}/mo when billed annually
                </p>
              )}
              <p className="text-sm text-muted-foreground mt-1 mb-4">For growing businesses</p>
              <ul className="space-y-2 my-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Send up to 1000 messages/month</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Advanced scheduling & recurring messages</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Message templates & personalization</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-primary" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                onClick={() => handlePayment('basic')}
              >
                Choose Basic
              </Button>
            </div>
          )}

          <div className={`bg-card border-2 rounded-lg border-primary p-6 relative ${currentPlan === 'free' ? '' : 'md:col-span-2 max-w-md mx-auto'}`}>
            {billingCycle === "yearly" && (
              <div className="absolute -top-3 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
                <Gift className="h-3 w-3 mr-1" /> Save 33%
              </div>
            )}
            <div className="absolute -top-3 left-8 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1 rounded-full text-xs font-medium shadow-md">
              Most Popular
            </div>
            <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mt-2">Premium Plan</h3>
            <div className="flex items-baseline mt-2">
              <span className="text-lg line-through text-slate-400 dark:text-slate-500 mr-2">
                ${billingCycle === "monthly" ? premiumOriginalMonthly : '2399'}
              </span>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                ${billingCycle === "monthly" ? premiumMonthly : premiumYearly}
              </span>
              <span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-1">
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-green-600 dark:text-green-400 text-sm font-medium mt-2 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                Just ${premiumMonthlyEquivalent}/mo when billed annually
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-1 mb-4">For large-scale enterprises</p>
            <ul className="space-y-2 my-6">
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Send 10000 messages/month</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Bulk import of customer lists</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Link your WhatsApp Business number</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span className="text-sm">Priority support</span>
              </li>
            </ul>
            <Button
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
              onClick={() => handlePayment('premium')}
            >
              Choose Premium
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
