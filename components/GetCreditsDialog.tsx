'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Check, Coins, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

export function GetCreditsDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const creditPackages = [
    {
      name: "Starter Pack",
      credits: 25,
      price: 10,
      popular: false,
      features: [
        "25 AI Video Credits",
        "5 x 15-second videos, OR",
        "2 x 30-second videos, OR", 
        "1 x 60-second video",
        "All Video Styles",
        "All Voice Types",
        "No Watermark",
        "Priority Support"
      ]
    },
    {
      name: "Creator Pack",
      credits: 60,
      price: 20,
      popular: true,
      features: [
        "60 AI Video Credits",
        "12 x 15-second videos, OR",
        "6 x 30-second videos, OR",
        "3 x 60-second videos",
        "All Video Styles",
        "All Voice Types",
        "No Watermark",
        "Priority Support",
        "Bulk Export"
      ]
    },
    {
      name: "Pro Pack",
      credits: 120,
      price: 40,
      popular: false,
      features: [
        "120 AI Video Credits",
        "24 x 15-second videos, OR",
        "12 x 30-second videos, OR",
        "6 x 60-second videos",
        "All Video Styles",
        "All Voice Types",
        "No Watermark",
        "Priority Support",
        "Bulk Export",
        "Custom Branding"
      ]
    }
  ];

  const handlePurchase = (packageIndex: number) => {
    const selectedPackage = creditPackages[packageIndex];
    router.push(`/payment?package=${packageIndex}&credits=${selectedPackage.credits}&price=${selectedPackage.price}`);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="hidden md:flex"
        >
          <Coins className="h-4 w-4 mr-2" />
          Get Credits
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-center">
            Get AI Video Credits
          </DialogTitle>
          <DialogDescription className="text-center">
            Choose the credit package that works best for your video creation needs
          </DialogDescription>
        </DialogHeader>

        {/* Value Proposition */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 p-4 rounded-lg mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            <span className="font-semibold text-blue-700 dark:text-blue-300">Flexible Credit System</span>
          </div>
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
            <strong>15s video:</strong> 5 credits • <strong>30s video:</strong> 10 credits • <strong>60s video:</strong> 20 credits
          </p>
          <p className="text-sm text-blue-600 dark:text-blue-400">
            Each credit creates one complete AI video with images, audio, and captions
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-4">
          {creditPackages.map((pkg, index) => (
            <div 
              key={index} 
              className={`bg-card border-2 rounded-lg p-6 relative ${
                pkg.popular 
                  ? 'border-blue-500 dark:border-blue-400' 
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium shadow-sm">
                  Most Popular
                </div>
              )}
              
              <div className="text-center mb-4">
                <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  {pkg.name}
                </h3>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Coins className="h-6 w-6 text-yellow-500" />
                  <span className="text-3xl font-bold text-slate-800 dark:text-slate-200">
                    {pkg.credits}
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Credits</span>
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${pkg.price}
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  One-time payment
                </p>
              </div>

              <ul className="space-y-2 mb-6">
                {pkg.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  pkg.popular 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 dark:text-slate-200'
                }`}
                onClick={() => handlePurchase(index)}
              >
                Get {pkg.credits} Credits
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
} 