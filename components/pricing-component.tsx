"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { Button } from "./ui/button";

const initialOptions = {
  clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!,
  currency: "USD",
  intent: "capture",
  components: "buttons",
  "disable-funding": "credit,card",
};

export const PricingComponent = () => {
  const { data: session, status } = useSession();
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  const handleBasicPlanPayment = async (data: any) => {
    try {
      console.log("Payment successful:", data);
      // Add your payment success logic here
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  const handlePremiumPlanPayment = async (data: any) => {
    try {
      console.log("Payment successful:", data);
      // Add your payment success logic here
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Basic Plan</h2>
                <div className="text-4xl font-bold mb-2">$19</div>
                <p className="text-muted-foreground">One-time payment</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-2" />
                  <span>Up to 10 reminders per month</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-2" />
                  <span>WhatsApp notifications</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-2" />
                  <span>Recurring reminders</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 text-primary mr-2" />
                  <span>Basic customization</span>
                </li>
              </ul>
              {
                status === "authenticated" ? (
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: "19.00",
                            },
                            description: "RemindMe Basic Plan",
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then(handleBasicPlanPayment);
                    }}
                  />
                ) : (
                  <Button className="w-full" onClick={() => signIn()}>Get Started</Button>
                )
              }
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 bg-primary text-primary-foreground hover:shadow-xl transition-shadow">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
                <div className="text-4xl font-bold mb-2">$29</div>
                <p className="text-primary-foreground/80">One-time payment</p>
              </div>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Unlimited reminders</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Priority WhatsApp delivery</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Advanced recurring options</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Premium customization</span>
                </li>
                <li className="flex items-center">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Priority support</span>
                </li>
              </ul>
              {
                status === "authenticated" ? (
                  <PayPalButtons
                    style={{ layout: "vertical" }}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        intent: "CAPTURE",
                        purchase_units: [
                          {
                            amount: {
                              currency_code: "USD",
                              value: "29.00",
                            },
                            description: "RemindMe Premium Plan",
                          },
                        ],
                      });
                    }}
                    onApprove={(data, actions) => {
                      return actions.order!.capture().then(handlePremiumPlanPayment);
                    }}
                  />
                ) : (
                  <Button className="w-full text-primary dark:text-white" variant='outline' onClick={() => signIn()}>Get Started</Button>
                )
              }
            </Card>
          </div>
        </div>
      </div>
    </PayPalScriptProvider>
  );
}
