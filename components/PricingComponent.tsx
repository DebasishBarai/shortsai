"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "./ui/button";
import { paypalOptions, PLAN_PRICES } from "@/lib/paypal-config";

export const PricingComponent = () => {
  const router = useRouter();
  const { data: session } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<'basic' | 'premium' | null>(null);

  const handleUpgrade = (plan: 'basic' | 'premium') => {
    if (!session) {
      router.push('/login');
      return;
    }
    router.push(`/payment?plan=${plan}`);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto px-4">
      {/* Basic Plan */}
      <div className="border rounded-lg p-8">
        <h3 className="text-2xl font-bold">Basic Plan</h3>
        <p className="text-3xl font-bold mt-4">${PLAN_PRICES.basic}</p>
        <p className="text-muted-foreground">One-time payment</p>
        <ul className="mt-6 space-y-4">
          <li>✓ Up to 10 reminders per month</li>
          <li>✓ WhatsApp notifications</li>
          <li>✓ Basic customization</li>
        </ul>
        <Button 
          className="w-full mt-8"
          onClick={() => handleUpgrade('basic')}
        >
          Get Started
        </Button>
      </div>

      {/* Premium Plan */}
      <div className="border-2 border-primary rounded-lg p-8">
        <h3 className="text-2xl font-bold">Premium Plan</h3>
        <p className="text-3xl font-bold mt-4">${PLAN_PRICES.premium}</p>
        <p className="text-muted-foreground">One-time payment</p>
        <ul className="mt-6 space-y-4">
          <li>✓ Unlimited reminders</li>
          <li>✓ Priority WhatsApp delivery</li>
          <li>✓ Premium customization</li>
        </ul>
        <Button 
          className="w-full mt-8"
          onClick={() => handleUpgrade('premium')}
        >
          Upgrade to Premium
        </Button>
      </div>
    </div>
  );
};

