'use client'

import Link from "next/link";
import { Check, Star, Zap, BarChart, Users, MessageSquare, FileSpreadsheet, PhoneCall, CalendarDays, Gift, Rocket, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useCurrency } from "@/lib/currency-context";
import { CurrencySelector } from "./CurrencySelector";

export function PricingCards() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const { formatPrice } = useCurrency();

  // Original prices (to be shown with strikethrough)
  const basicOriginalMonthly = 39;
  const premiumOriginalMonthly = 69;

  // Early bird discounted prices
  const basicMonthly = 29;
  const premiumMonthly = 59;

  // Calculate yearly prices (33% discount)
  const basicYearly = Math.floor(basicMonthly * 10 + 9); // 33% off
  const premiumYearly = Math.floor(premiumMonthly * 10 + 9); // 33% off

  // Calculate original yearly prices
  const basicOriginalYearly = Math.floor(basicOriginalMonthly * 10 + 9);
  const premiumOriginalYearly = Math.floor(premiumOriginalMonthly * 10 + 9);

  // Calculate monthly equivalent for yearly plans
  const basicMonthlyEquivalent = Math.round(basicYearly / 12);
  const premiumMonthlyEquivalent = Math.round(premiumYearly / 12);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
          Simple, Transparent Pricing
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto mb-8">
          Choose the perfect plan for your business marketing needs
        </p>

        <div className="flex flex-col items-center gap-4 mb-8">
          {/* Currency selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600 dark:text-slate-400">Select currency:</span>
            <CurrencySelector />
          </div>

          {/* Billing toggle */}
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
                  2-months free
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Early bird offer banner */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white p-3 rounded-lg mb-8 max-w-5xl mx-auto">
        <div className="flex items-center justify-center">
          <Rocket className="h-5 w-5 mr-2" />
          <p className="font-medium">Early Bird Offer: Limited-time special pricing for first 100 customers!</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto">
        {/* Basic Plan */}
        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-8 bg-white dark:bg-slate-800 flex flex-col hover:shadow-lg transition-shadow duration-300 relative group">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div> */}
          {billingCycle === "yearly" && (
            <div className="absolute -top-3 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
              2-months free
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Basic Plan</h3>
            <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium py-1 px-3">
              For Budding Creators
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline">
              {/* Original price with strikethrough */}
              <span className="text-2xl line-through text-slate-400 dark:text-slate-500 mr-2">
                {formatPrice(billingCycle === "monthly" ? basicOriginalMonthly : basicOriginalYearly)}
              </span>
              {/* Discounted price */}
              <span className="text-5xl font-bold text-slate-800 dark:text-slate-200">
                {formatPrice(billingCycle === "monthly" ? basicMonthly : basicYearly)}
              </span>
              <span className="text-xl text-slate-500 dark:text-slate-400 font-normal ml-2">
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-green-600 dark:text-green-400 font-medium mt-2 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                Just {formatPrice(basicMonthlyEquivalent)}/mo when billed annually
              </p>
            )}
            <p className="text-slate-600 dark:text-slate-400 mt-3">Ideal for medium-sized businesses, e-commerce stores, and service agencies.</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-700/50 h-px w-full mb-8"></div>

          <ul className="space-y-4 text-left mb-10 flex-grow">
            <li className="flex items-start">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Create up to 40 videos/month</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">AI generated Content</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Voiceovers</span>
            </li>
            {/* <li className="flex items-start"> */}
            {/*   <BarChart className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" /> */}
            {/*   <span>Basic analytics (delivery reports, open rates)</span> */}
            {/* </li> */}
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">No Watermark</span>
            </li>
          </ul>

          <Link href={`/payment?plan=basic&billing=${billingCycle}`} className="mt-auto cursor-pointer">
            <Button className="w-full py-6 text-lg cursor-pointer bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md">
              Choose Basic
            </Button>
          </Link>
        </div>

        {/* Premium Plan */}
        <div className="border-2 border-blue-500 dark:border-blue-600 rounded-xl p-8 bg-white dark:bg-slate-800 flex flex-col relative group hover:shadow-xl transition-shadow duration-300">
          {/* <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div> */}
          {billingCycle === "yearly" && (
            <div className="absolute -top-3 right-8 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm flex items-center">
              <Gift className="h-3 w-3 mr-1" /> 2-months free
            </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Premium Plan</h3>
            <div className="bg-blue-500/10 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium py-1 px-3">
              For Established Creators
            </div>
          </div>

          <div className="flex items-center justify-center -mt-2 mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-1.5 rounded-full text-sm font-medium shadow-md flex items-center">
              <Star className="h-4 w-4 mr-1.5" /> Most Popular
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-baseline">
              {/* Original price with strikethrough */}
              <span className="text-2xl line-through text-slate-400 dark:text-slate-500 mr-2">
                {formatPrice(billingCycle === "monthly" ? premiumOriginalMonthly : premiumOriginalYearly)}
              </span>
              {/* Discounted price */}
              <span className="text-5xl font-bold text-slate-800 dark:text-slate-200">
                {formatPrice(billingCycle === "monthly" ? premiumMonthly : premiumYearly)}
              </span>
              <span className="text-xl text-slate-500 dark:text-slate-400 font-normal ml-2">
                /{billingCycle === "monthly" ? "month" : "year"}
              </span>
            </div>
            {billingCycle === "yearly" && (
              <p className="text-green-600 dark:text-green-400 font-medium mt-2 flex items-center">
                <CalendarDays className="h-4 w-4 mr-1.5" />
                Just {formatPrice(premiumMonthlyEquivalent)}/mo when billed annually
              </p>
            )}
            <p className="text-slate-600 dark:text-slate-400 mt-3">Ideal for large enterprises, call centers, and marketing agencies.</p>
          </div>

          <div className="bg-slate-100 dark:bg-slate-700/50 h-px w-full mb-8"></div>

          <ul className="space-y-4 text-left mb-10 flex-grow">
            <li className="flex items-start">
              <Video className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Create up to 120 videos/month</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">AI generated Content</span>
            </li>
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">Voiceovers</span>
            </li>
            {/* <li className="flex items-start"> */}
            {/*   <BarChart className="h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0" /> */}
            {/*   <span>Basic analytics (delivery reports, open rates)</span> */}
            {/* </li> */}
            <li className="flex items-start">
              <Check className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-slate-700 dark:text-slate-300">No Watermark</span>
            </li>
          </ul>

          <Link href={`/payment?plan=premium&billing=${billingCycle}`} className="mt-auto cursor-pointer">
            <Button className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md cursor-pointer">
              Choose Premium
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 
