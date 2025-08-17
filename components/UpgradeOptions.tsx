import { SubscriptionType } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Gift, CalendarDays, Rocket } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

interface UpgradeOptionsProps {
  currentPlan: SubscriptionType;
  isTrialExpired?: boolean;
}

export function UpgradeOptions({ currentPlan, isTrialExpired }: UpgradeOptionsProps) {
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

  const handleUpgrade = (plan: 'basic' | 'premium') => {
    // Add payment logic here
    console.log(`Upgrading to ${plan}`);
  };

  if (currentPlan === 'premium') return null;

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <CardTitle>
          {currentPlan === 'basic' ? 'Upgrade to Premium' : 'Upgrade Your Plan'}
        </CardTitle>
        <CardDescription>
          {currentPlan === 'basic'
            ? 'Get access to all premium features and unlimited messaging'
            : isTrialExpired
              ? 'Choose a plan to continue using RemindMe'
              : 'Upgrade now to unlock more features and messaging capacity'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Billing toggle */}
        <div className="flex justify-center mt-2 mb-6">
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

        <div className="grid md:grid-cols-2 gap-4">
          {currentPlan === 'free' && (
            <Card className="border-2 border-primary/20 relative">
              {billingCycle === "yearly" && (
                <div className="absolute -top-3 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
                  <Gift className="h-3 w-3 mr-1" /> Save 33%
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-xl">Basic Plan</CardTitle>
                <div className="flex items-baseline">
                  <span className="text-lg line-through text-slate-400 dark:text-slate-500 mr-2">
                    ${billingCycle === "monthly" ? basicOriginalMonthly : Math.round(basicOriginalMonthly * 12 * 0.67)}
                  </span>
                  <span className="text-2xl font-bold">
                    ${billingCycle === "monthly" ? basicMonthly : basicYearly}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-1">
                    /{billingCycle === "monthly" ? "month" : "year"}
                  </span>
                </div>
                {billingCycle === "yearly" && (
                  <p className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
                    <CalendarDays className="h-4 w-4 mr-1.5" />
                    Just ${basicMonthlyEquivalent}/mo when billed annually
                  </p>
                )}
                <CardDescription>For growing businesses</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
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
                <Link href={`/payment?plan=basic&billing=${billingCycle}`}>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                    Choose Basic
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card className="border-2 border-primary relative">
            {billingCycle === "yearly" && (
              <div className="absolute -top-3 right-6 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
                <Gift className="h-3 w-3 mr-1" /> Save 33%
              </div>
            )}
            <CardHeader>
              <CardTitle className="text-xl">Premium Plan</CardTitle>
              <div className="flex items-baseline">
                <span className="text-lg line-through text-slate-400 dark:text-slate-500 mr-2">
                  ${billingCycle === "monthly" ? premiumOriginalMonthly : "2399"}
                </span>
                <span className="text-2xl font-bold">
                  ${billingCycle === "monthly" ? premiumMonthly : premiumYearly}
                </span>
                <span className="text-sm text-slate-500 dark:text-slate-400 font-normal ml-1">
                  /{billingCycle === "monthly" ? "month" : "year"}
                </span>
              </div>
              {billingCycle === "yearly" && (
                <p className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center">
                  <CalendarDays className="h-4 w-4 mr-1.5" />
                  Just ${premiumMonthlyEquivalent}/mo when billed annually
                </p>
              )}
              <CardDescription>For large-scale enterprises</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
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
              <Link href={`/payment?plan=premium&billing=${billingCycle}`}>
                <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                  Choose Premium
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 
